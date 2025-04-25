/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

// GET endpoint to fetch a user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        avatarUrl: true,
        balance: true,
        referralCode: true,
        subscribe: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT endpoint to update a user's profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const { name, phoneNumber, avatarUrl } = await request.json();

    // Validate input
    if (phoneNumber && typeof phoneNumber === "string") {
      // Check if phone number is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          phoneNumber,
          id: { not: userId },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: "Phone number already in use" },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phoneNumber && { phoneNumber }),
        ...(avatarUrl && { avatarUrl }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        avatarUrl: true,
        balance: true,
        referralCode: true,
        subscribe: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);

    // Handle Prisma errors
    if (error.code === "P2025") {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
