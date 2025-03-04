/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Read form data (image + other fields)
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const merchantId = formData.get("merchantId") as string;
    const amount = formData.get("amount") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!merchantId || !amount) {
      return NextResponse.json(
        { error: "Merchant ID and amount are required" },
        { status: 400 }
      );
    }

    // Convert file to Blob
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    // Upload to Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", blob, file.name);
    cloudinaryFormData.append("upload_preset", "invoices");

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    );

    if (!cloudinaryResponse.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const cloudinaryData = await cloudinaryResponse.json();
    const imageUrl = cloudinaryData.secure_url;

    // Save invoice to database using Prisma
    const invoice = await prisma.invoice.create({
      data: {
        merchantId,
        userId: user.id,
        amount: parseFloat(amount),
        imageUrl,
      },
    });

    // Check if this user was referred by someone and if they've reached 5 invoices
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { referredBy: true },
    });

    if (currentUser?.referredBy) {
      // Count the number of invoices this user has
      const invoiceCount = await prisma.invoice.count({
        where: { userId: user.id },
      });

      // If this is the 5th invoice, reward the referrer
      if (invoiceCount === 5) {
        const referrer = await prisma.user.findFirst({
          where: { referralCode: currentUser.referredBy },
        });

        if (referrer) {
          // Add 10 rupees to the referrer's balance
          await prisma.user.update({
            where: { id: referrer.id },
            data: { balance: { increment: 10 } },
          });

          // Create a record in the referral history
          await prisma.referralHistory.create({
            data: {
              userId: referrer.id,
              referredUserId: user.id,
              amount: 10,
            },
          });

          // Send a notification to the referrer (optional)
          // This would be implemented in a separate function
        }
      }
    }

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let dateFilter = {};

    switch (period) {
      case "monthly":
        dateFilter = {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lt: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              0
            ),
          },
        };
        break;
      case "yearly":
        dateFilter = {
          createdAt: {
            gte: new Date(new Date().getFullYear(), 0, 1),
            lt: new Date(new Date().getFullYear() + 1, 0, 1),
          },
        };
        break;
      case "custom":
        if (startDate && endDate) {
          dateFilter = {
            createdAt: {
              gte: new Date(startDate),
              lt: new Date(endDate),
            },
          };
        }
        break;
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: user.id,
        ...dateFilter,
      },
      include: {
        merchant: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = invoices.reduce(
      (sum, invoice) => sum + Number(invoice.amount),
      0
    );

    return NextResponse.json({ invoices, total });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
