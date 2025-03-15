/* eslint-disable @typescript-eslint/no-unused-vars */
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create a subscription token
    const subscription = await razorpay.subscriptions.create({
      plan_id: "plan_Q6JdUo0bbA58ni", // Monthly plan ID
      customer_notify: 1,
      quantity: 1,
      total_count: 12, // 12 months
      notes: {
        userId: user.id,
      },
    });

    // Update user with subscription details
    await prisma.user.update({
      where: { id: user.id },
      data: {
        razorpaySubscriptionId: subscription.id,
        subscriptionStatus: "PENDING",
      },
    });

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { subscriptionId, status } = await request.json();

    const user = await prisma.user.findFirst({
      where: { razorpaySubscriptionId: subscriptionId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscribe: status === "active",
        subscriptionStatus: status.toUpperCase(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
