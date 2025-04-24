import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch total counts for summary
    const totalInvoices = await prisma.invoice.count({
      where: { userId },
    });

    const pendingInvoices = await prisma.invoice.count({
      where: { userId, status: "PENDING" },
    });

    const approvedInvoices = await prisma.invoice.count({
      where: { userId, status: "APPROVED" },
    });

    const rejectedInvoices = await prisma.invoice.count({
      where: { userId, status: "REJECTED" },
    });

    // Fetch paginated invoices for the user
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: userId,
      },
      include: {
        merchant: true,
        cashback: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Separate merchant and non-merchant invoices
    const merchantInvoices = invoices.filter((invoice) => invoice.isMerchant);
    const nonMerchantInvoices = invoices.filter(
      (invoice) => !invoice.isMerchant
    );

    // Check if there are more invoices to load
    const totalMerchantInvoices = await prisma.invoice.count({
      where: { userId, isMerchant: true },
    });

    const totalNonMerchantInvoices = await prisma.invoice.count({
      where: { userId, isMerchant: false },
    });

    return NextResponse.json({
      totalInvoices,
      pendingInvoices,
      approvedInvoices,
      rejectedInvoices,
      merchantInvoices,
      nonMerchantInvoices,
      pagination: {
        page,
        limit,
        hasMore: skip + invoices.length < totalInvoices,
        totalMerchantInvoices,
        totalNonMerchantInvoices,
      },
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
