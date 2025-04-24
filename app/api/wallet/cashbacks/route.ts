import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get userId from the URL query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get cashbacks with pagination
    const [cashbacks, totalCount] = await Promise.all([
      prisma.cashback.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          invoice: {
            include: {
              merchant: true,
            },
          },
        },
      }),
      prisma.cashback.count({
        where: { userId },
      }),
    ]);

    // Format cashback data
    const formattedCashbacks = cashbacks.map((cashback) => ({
      id: cashback.id,
      amount: cashback.amount.toString(),
      type: cashback.type,
      date: cashback.createdAt.toLocaleDateString("en-IN"),
      time: cashback.createdAt.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      merchantName: cashback.invoice.merchant?.name || "Non-Merchant Bill",
      invoiceAmount: cashback.invoice.amount.toString(),
      invoiceId: cashback.invoiceId,
    }));

    return NextResponse.json({
      cashbacks: formattedCashbacks,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching cashbacks:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch cashbacks",
      },
      { status: 500 }
    );
  }
}
