// api/wallet/withdraw/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, amount, upiId } = body;

    if (!userId || !amount || !upiId) {
      return NextResponse.json(
        {
          error: "User ID, amount, and UPI ID are required",
        },
        { status: 400 }
      );
    }

    // Validate amount is a number and greater than 0
    const withdrawalAmount = Number.parseFloat(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      return NextResponse.json(
        {
          error: "Amount must be a positive number",
        },
        { status: 400 }
      );
    }

    // Check if user exists and has sufficient balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.balance.lessThan(withdrawalAmount)) {
      return NextResponse.json(
        {
          error: "Insufficient balance",
        },
        { status: 400 }
      );
    }

    // Create withdrawal record
    const withdrawal = await prisma.$transaction(async (tx) => {
      // Create withdrawal record
      const newWithdrawal = await tx.withdrawal.create({
        data: {
          userId,
          amount: withdrawalAmount,
          upiId,
          status: "PENDING",
        },
      });

      // Update user balance
      await tx.user.update({
        where: { id: userId },
        data: {
          balance: { decrement: withdrawalAmount },
        },
      });

      return newWithdrawal;
    });

    return NextResponse.json({
      success: true,
      withdrawal: {
        id: withdrawal.id,
        amount: withdrawal.amount.toString(),
        status: "Processing",
        upiId: withdrawal.upiId,
        date: withdrawal.createdAt.toLocaleDateString("en-IN"),
        time: withdrawal.createdAt.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return NextResponse.json(
      {
        error: "Failed to process withdrawal",
      },
      { status: 500 }
    );
  }
}
