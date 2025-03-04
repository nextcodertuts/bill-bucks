/* eslint-disable @typescript-eslint/no-unused-vars */
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's referral information
    const userWithReferrals = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        referralCode: true,
        balance: true,
        referredBy: true,
      },
    });

    if (!userWithReferrals) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the count of users referred by this user
    const referredUsersCount = await prisma.user.count({
      where: { referredBy: userWithReferrals.referralCode },
    });

    // Get the referral history
    const referralHistory = await prisma.referralHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // If the user was referred by someone, get that user's info
    let referredByUser = null;
    if (userWithReferrals.referredBy) {
      referredByUser = await prisma.user.findFirst({
        where: { referralCode: userWithReferrals.referredBy },
        select: {
          id: true,
          name: true,
        },
      });
    }

    return NextResponse.json({
      referralCode: userWithReferrals.referralCode,
      balance: userWithReferrals.balance,
      referredBy: referredByUser,
      referredUsersCount,
      referralHistory,
      referralLink: `${
        process.env.NEXT_PUBLIC_APP_URL || "https://billbucks.app"
      }/register?ref=${userWithReferrals.referralCode}`,
    });
  } catch (error) {
    console.error("Error getting referral status:", error);
    return NextResponse.json(
      { error: "Failed to get referral status" },
      { status: 500 }
    );
  }
}
