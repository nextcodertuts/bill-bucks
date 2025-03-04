/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use server";

import { z } from "zod";
import { lucia } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { hash } from "@node-rs/argon2";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be 10 digits")
      .regex(/^[0-9]{10}$/, "Invalid phone number format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    referralCode: z.string().optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function register(formData: FormData) {
  const result = registerSchema.safeParse({
    name: formData.get("name"),
    phoneNumber: formData.get("phoneNumber"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    referralCode: formData.get("referralCode") || null,
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { name, phoneNumber, password, referralCode } = result.data;

  try {
    // Check if phone number already exists
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (existingUser) {
      return { error: "Phone number already registered" };
    }

    // Validate referral code if provided
    if (referralCode) {
      const referrer = await prisma.user.findFirst({
        where: { referralCode },
      });

      if (!referrer) {
        return { error: "Invalid referral code" };
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
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An error occurred during registration" };
  }
}
