/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get userId from the URL query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        balance: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate wallet statistics
    const [withdrawals, cashbacks] = await Promise.all([
      // Get total withdrawn amount (COMPLETED status only)
      prisma.withdrawal.aggregate({
        where: {
          userId,
          status: "COMPLETED",
        },
        _sum: { amount: true },
      }),

      // Get total cashback amount
      prisma.cashback.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
    ]);

    // Get recent withdrawals
    const recentWithdrawals = await prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        amount: true,
        status: true,
        upiId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Format withdrawal data to match the expected format in the app
    const formattedWithdrawals = recentWithdrawals.map((withdrawal) => ({
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

    // Get recent cashbacks
    const recentCashbacks = await prisma.cashback.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        invoice: {
          include: {
            merchant: true,
          },
        },
      },
    });

    // Format cashback data
    const formattedCashbacks = recentCashbacks.map((cashback) => ({
      id: cashback.id,
      amount: cashback.amount.toString(),
      type: cashback.type,
      date: cashback.createdAt.toLocaleDateString("en-IN"),
      time: cashback.createdAt.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      merchantName: cashback.invoice.merchant?.name || "Non-Merchant Bill",
    }));

    // Get recent invoices (top 3)
    const recentInvoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        merchant: true,
      },
    });

    // Format invoice data
    const formattedInvoices = recentInvoices.map((invoice) => ({
      id: invoice.id,
      amount: invoice.amount.toString(),
      imageUrl: invoice.imageUrl,
      status: invoice.status,
      isMerchant: invoice.isMerchant,
      merchantName: invoice.merchant?.name || "Non-Merchant Bill",
      date: invoice.createdAt.toLocaleDateString("en-IN"),
      time: invoice.createdAt.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    // Calculate wallet balances
    const totalEarned = cashbacks._sum.amount || 0;
    const totalWithdrawn = withdrawals._sum.amount || 0;

    // Calculate pending amount as total cashbacks minus successful withdrawals
    const pendingAmount = Math.max(0, totalEarned - totalWithdrawn);

    const availableBalance = user.balance;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
      },
      wallet: {
        totalEarned: totalEarned.toString(),
        availableBalance: availableBalance.toString(),
        pendingAmount: pendingAmount.toString(),
        withdrawnAmount: totalWithdrawn.toString(),
      },
      withdrawals: formattedWithdrawals,
      cashbacks: formattedCashbacks,
      recentInvoices: formattedInvoices,
    });
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet data" },
      { status: 500 }
    );
  }
}
