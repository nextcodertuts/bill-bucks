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

    const cashbacks = await prisma.cashback.findMany({
      where: {
        userId: user.id,
      },
      include: {
        invoice: {
          select: {
            amount: true,
            merchant: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cashbacks);
  } catch (error) {
    console.error("Error fetching cashbacks:", error);
    return NextResponse.json(
      { error: "Failed to fetch cashbacks" },
      { status: 500 }
    );
  }
}
