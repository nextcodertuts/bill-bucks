import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const merchantId = formData.get("merchantId") as string;
    const amount = formData.get("amount") as string;
    const isMerchant = formData.get("isMerchant") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    const invoiceAmount = parseFloat(amount);

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

    // Start a transaction to handle invoice creation and cashback
    const result = await prisma.$transaction(async (tx) => {
      // Create the invoice
      const invoice = await tx.invoice.create({
        data: {
          merchantId: isMerchant ? merchantId : null,
          userId: user.id,
          amount: invoiceAmount,
          imageUrl,
          isMerchant,
        },
        include: {
          user: {
            select: {
              nonMerchantBillCount: true,
            },
          },
        },
      });

      let cashbackAmount = 0;
      let cashbackType = "";

      if (isMerchant && invoiceAmount >= 300) {
        // For merchant bills - instant cashback between 3-5 rupees only if amount >= 300
        const randomCashback = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
        cashbackAmount = randomCashback;
        cashbackType = "MERCHANT";
      } else if (!isMerchant) {
        // For non-merchant bills - check if eligible for cashback
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: { nonMerchantBillCount: { increment: 1 } },
        });

        if (updatedUser.nonMerchantBillCount % 15 === 0) {
          cashbackAmount = 3;
          cashbackType = "NON_MERCHANT";
        }
      }

      if (cashbackAmount > 0) {
        // Create cashback record
        await tx.cashback.create({
          data: {
            userId: user.id,
            invoiceId: invoice.id,
            amount: cashbackAmount,
            type: cashbackType,
          },
        });

        // Update user balance
        await tx.user.update({
          where: { id: user.id },
          data: {
            balance: {
              increment: cashbackAmount,
            },
          },
        });
      }

      // Get the updated user data
      const updatedUserData = await tx.user.findUnique({
        where: { id: user.id },
        select: {
          nonMerchantBillCount: true,
        },
      });

      return {
        invoice: {
          ...invoice,
          user: updatedUserData,
        },
        cashbackAmount,
        cashbackType,
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
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
        cashback: true,
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
