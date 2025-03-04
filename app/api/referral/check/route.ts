import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the referral code from the URL
    const { searchParams } = new URL(request.url);
    const referralCode = searchParams.get("code");

    if (!referralCode) {
      return NextResponse.json(
        { valid: false, message: "Referral code is required" },
        { status: 200 }
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
      select: {
        id: true,
        name: true,
      },
    });

    if (!referrer) {
      return NextResponse.json(
        { valid: false, message: "Invalid referral code" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      valid: true,
      referrer: {
        id: referrer.id,
        name: referrer.name,
      },
    });
  } catch (error) {
    console.error("Error checking referral code:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to check referral code" },
      { status: 200 }
    );
  }
}
