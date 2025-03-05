/* eslint-disable @typescript-eslint/no-unused-vars */
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, upiId } = await request.json();

    // Validate amount
    const withdrawalAmount = parseFloat(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid withdrawal amount" },
        { status: 400 }
      );
    }

    // Validate UPI ID
    if (!upiId || typeof upiId !== "string" || !upiId.includes("@")) {
      return NextResponse.json({ error: "Invalid UPI ID" }, { status: 400 });
    }

    // Check user balance
    const userWithBalance = await prisma.user.findUnique({
      where: { id: user.id },
      select: { balance: true },
    });

    if (
      !userWithBalance ||
      userWithBalance.balance.lessThan(withdrawalAmount)
    ) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Create withdrawal request and update user balance
    const withdrawal = await prisma.$transaction(async (tx) => {
      // Create withdrawal request
      const withdrawal = await tx.withdrawal.create({
        data: {
          userId: user.id,
          amount: withdrawalAmount,
          upiId,
          status: "PENDING",
        },
      });

      // Deduct amount from user balance
      await tx.user.update({
        where: { id: user.id },
        data: {
          balance: {
            decrement: withdrawalAmount,
          },
        },
      });

      return withdrawal;
    });

    return NextResponse.json(withdrawal, { status: 201 });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return NextResponse.json(
      { error: "Failed to process withdrawal" },
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

    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(withdrawals);
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}
