/* eslint-disable @typescript-eslint/no-explicit-any */
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
    // Authenticate the user
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Razorpay API keys are missing" },
        { status: 500 }
      );
    }

    // Validate phone number
    const phoneNumber = user.phoneNumber || "";
    if (!/^\d{10}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Create Razorpay customer (if not exists)
    let customer;
    try {
      customer = await razorpay.customers.create({
        name: user.name || "User",
        contact: phoneNumber,
        fail_existing: 0, // Don't fail if customer exists
      });
    } catch (error: any) {
      if (error.error?.description?.includes("Customer already exists")) {
        // Fetch existing customer instead of failing
        customer = await razorpay.customers.fetch(phoneNumber);
      } else {
        console.error("Razorpay customer creation failed:", error);
        return NextResponse.json(
          { error: "Failed to create Razorpay customer" },
          { status: 500 }
        );
      }
    }

    // Create a UPI mandate for ₹500 (valid for 1 year)
    const mandate = await razorpay.paymentLink.create({
      amount: 50000, // Razorpay uses paise, so ₹500 = 50000 paise
      currency: "INR",
      accept_partial: false, // No partial payments
      description: "UPI Auto-Debit Mandate",
      customer: {
        name: user.name || "User",
        contact: phoneNumber,
      },
      method: "upi",
      upi: {
        flow: "collect",
      },
      expire_by: Math.floor(Date.now() / 1000) + 31536000, // 1-year validity (in seconds)
      notes: {
        userId: user.id,
      },
      reminder_enable: true, // Razorpay will send reminders
      notify: {
        sms: true,
        email: true,
      },
    });

    return NextResponse.json({
      success: true,
      mandate_id: mandate.id,
      payment_link: mandate.short_url, // This is the link user needs to approve
    });
  } catch (error: any) {
    console.error("Error creating mandate:", error);
    return NextResponse.json(
      { error: "Failed to create mandate" },
      { status: 500 }
    );
  }
}
