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
    const amount = formData.get("amount") as string;
    const merchantId = formData.get("merchantId") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const notes = formData.get("notes") as string;

    const invoice = await prisma.invoice.create({
      data: {
        amount: parseFloat(amount),
        merchantId,
        imageUrl,
        notes,
        userId: user.id,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
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
