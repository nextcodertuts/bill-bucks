import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { referralCode } = await request.json();

    if (!referralCode) {
      return NextResponse.json(
        { error: "Referral code is required" },
        { status: 400 }
      );
    }

    // Check if the user already has a referral code applied
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { referredBy: true },
    });

    if (currentUser?.referredBy) {
      return NextResponse.json(
        { error: "You have already used a referral code" },
        { status: 400 }
      );
    }

    // Check if the referral code exists and is not the user's own code
    const referrer = await prisma.user.findFirst({
      where: {
        referralCode,
        id: {
          not: user.id, // Ensure users can't refer themselves
        },
      },
    });

    if (!referrer) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 400 }
      );
    }

    // Apply the referral code to the user
    await prisma.user.update({
      where: { id: user.id },
      data: { referredBy: referralCode },
    });

    return NextResponse.json({
      success: true,
      message: "Referral code applied successfully",
    });
  } catch (error) {
    console.error("Error applying referral code:", error);
    return NextResponse.json(
      { error: "Failed to apply referral code" },
      { status: 500 }
    );
  }
}
