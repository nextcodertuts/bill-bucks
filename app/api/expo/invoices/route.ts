import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amount, imageUrl, isMerchant, merchantId } = body;

    if (!userId || !amount || !imageUrl || isMerchant === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.create({
      data: {
        userId,
        amount: amount, // Make sure amount is passed as a string or number
        imageUrl,
        isMerchant,
        merchantId: isMerchant ? merchantId : null, // ensure null for non-merchants
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Invoice upload error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}

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
