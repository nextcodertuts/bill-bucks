import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token, platform, deviceInfo } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Upsert the token
    const result = await prisma.pushToken.upsert({
      where: { token },
      update: {
        lastUsed: new Date(),
        platform,
        deviceInfo,
      },
      create: {
        token,
        platform,
        deviceInfo,
        lastUsed: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error registering push token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
