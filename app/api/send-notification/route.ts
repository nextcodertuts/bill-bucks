/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { NextResponse } from "next/server";
import { adminMessaging } from "@/lib/firebase-admin";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { notification, data, userIds } = await request.json();

    if (!notification.title || !notification.body) {
      return NextResponse.json(
        { error: "Notification title and body are required" },
        { status: 400 }
      );
    }

    // Get FCM tokens from database
    let tokens = [];
    if (userIds && userIds.length > 0) {
      // If specific users are targeted
      tokens = await prisma.pushToken.findMany({
        where: {
          userId: {
            in: userIds,
          },
        },
        select: {
          token: true,
        },
      });
    } else {
      // Send to all users
      tokens = await prisma.pushToken.findMany({
        select: {
          token: true,
        },
      });
    }

    if (tokens.length === 0) {
      return NextResponse.json(
        { error: "No valid tokens found" },
        { status: 400 }
      );
    }

    // Prepare notification message
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl,
      },
      data: {
        ...data,
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
      android: {
        priority: "high",
        notification: {
          imageUrl: notification.imageUrl,
          priority: "max",
          defaultSound: true,
          defaultVibrateTimings: true,
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
        fcm_options: {
          image: notification.imageUrl,
        },
      },
      tokens: tokens.map((t) => t.token),
    };

    // Send the message
    const response = await adminMessaging.sendEachForMulticast(message);

    // Clean up invalid tokens
    const invalidTokens = response.responses
      .map((res, idx) => (res.success ? null : tokens[idx].token))
      .filter(Boolean);

    if (invalidTokens.length > 0) {
      await prisma.pushToken.deleteMany({
        where: {
          token: {
            in: invalidTokens as string[],
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      results: {
        success: response.successCount,
        failure: response.failureCount,
      },
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
