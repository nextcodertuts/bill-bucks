import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const merchants = await prisma.merchant.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 10,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(merchants);
  } catch (error) {
    console.error("Error searching merchants:", error);
    return NextResponse.json(
      { error: "Failed to search merchants" },
      { status: 500 }
    );
  }
}
