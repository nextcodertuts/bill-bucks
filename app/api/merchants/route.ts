import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, address, phone, city } = body;

    // Basic validation
    if (!name || !address || !phone || !city) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Create the merchant
    const merchant = await prisma.merchant.create({
      data: {
        name,
        address,
        phone,
        city,
      },
    });

    return NextResponse.json(merchant, { status: 201 });
  } catch (error) {
    console.error("Error creating merchant:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
