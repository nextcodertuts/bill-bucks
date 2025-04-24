import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const withdrawalId = id;

    if (!withdrawalId) {
      return NextResponse.json(
        { error: "Withdrawal ID is required" },
        { status: 400 }
      );
    }

    // Fetch withdrawal details
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
      notes: withdrawal.notes,
      date: withdrawal.createdAt.toLocaleDateString("en-IN"),
      time: withdrawal.createdAt.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: withdrawal.createdAt,
      updatedAt: withdrawal.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching withdrawal details:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch withdrawal details",
      },
      { status: 500 }
    );
  }
}
