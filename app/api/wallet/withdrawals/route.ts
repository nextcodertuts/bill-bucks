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

    // Get withdrawals with pagination
    const [withdrawals, totalCount] = await Promise.all([
      prisma.withdrawal.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.withdrawal.count({
        where: { userId },
      }),
    ]);

    // Format withdrawal data
    const formattedWithdrawals = withdrawals.map((withdrawal) => ({
      id: withdrawal.id,
      amount: withdrawal.amount.toString(),
      status:
        withdrawal.status === "PENDING"
          ? "Processing"
          : withdrawal.status === "COMPLETED"
          ? "Completed"
          : withdrawal.status === "FAILED"
          ? "Failed"
          : withdrawal.status,
      upiId: withdrawal.upiId,
      date: withdrawal.createdAt.toLocaleDateString("en-IN"),
      time: withdrawal.createdAt.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    return NextResponse.json({
      withdrawals: formattedWithdrawals,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch withdrawals",
      },
      { status: 500 }
    );
  }
}
