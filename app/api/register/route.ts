import prisma from "@/lib/prisma";
import { hash } from "@node-rs/argon2";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, phoneNumber, password, referralCode } = await request.json();

    if (!name || !phoneNumber || !password) {
      return NextResponse.json(
        { message: "Name, phone number, and password are required" },
        { status: 400 }
      );
    }

    // Check if phone number already exists
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Phone number already registered" },
        { status: 400 }
      );
    }

    // Validate referral code if provided
    if (referralCode) {
      const referrer = await prisma.user.findFirst({
        where: { referralCode },
      });

      if (!referrer) {
        return NextResponse.json(
          { message: "Invalid referral code" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await hash(password);
    const user = await prisma.user.create({
      data: {
        name,
        phoneNumber,
        hashedPassword,
        referredBy: referralCode || null,
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        balance: true,
        referralCode: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
