import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user data and calculate days since registration
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        createdAt: true,
        invoices: {
          where: {
            isMerchant: true, // Only consider merchant invoices
            status: "APPROVED", // Only count approved invoices
          },
          select: {
            amount: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate total merchant invoices and amount
    const totalInvoices = user.invoices.length;
    const totalAmount = user.invoices.reduce(
      (sum, invoice) => sum + Number(invoice.amount),
      0
    );

    // Calculate days since registration
    const daysRegistered = Math.floor(
      (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Eligibility criteria
    const criteria = {
      invoices: {
        met: totalInvoices >= 30,
        current: totalInvoices,
        required: 30,
      },
      amount: {
        met: totalAmount >= 30000,
        current: totalAmount,
        required: 30000,
      },
      days: {
        met: daysRegistered >= 45,
        current: daysRegistered,
        required: 45,
      },
    };

    const isEligible =
      criteria.invoices.met && criteria.amount.met && criteria.days.met;

    // Calculate credit limit based on spending history
    let creditLimit = 0;
    if (isEligible) {
      // Base credit limit calculation
      creditLimit = Math.min(
        Math.floor(totalAmount * 0.3), // 30% of total spend
        50000 // Maximum limit of ₹50,000
      );
      // Round to nearest thousand
      creditLimit = Math.floor(creditLimit / 1000) * 1000;
    }

    return NextResponse.json({
      isEligible,
      totalInvoices,
      totalAmount,
      daysRegistered,
      creditLimit,
      availableCredit: creditLimit, // Initially, available credit equals credit limit
      criteria, // Include detailed criteria status
    });
  } catch (error) {
    console.error("Error checking pay later eligibility:", error);
    return NextResponse.json(
      { error: "Failed to check eligibility" },
      { status: 500 }
    );
  }
}
