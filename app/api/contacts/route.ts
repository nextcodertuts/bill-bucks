/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const contacts = await request.json();

    if (!Array.isArray(contacts)) {
      return NextResponse.json(
        { error: "Invalid contacts data format" },
        { status: 400 }
      );
    }

    // Process and store each contact
    const results = await Promise.all(
      contacts.map(async (contact) => {
        const { name, phoneNumber, email } = contact;

        // Basic validation
        if (!phoneNumber) {
          return { error: "Phone number is required", contact };
        }

        try {
          // Create or update contact
          const savedContact = await prisma.contact.upsert({
            where: {
              phoneNumber: phoneNumber,
            },
            update: {
              name: name || undefined,
              email: email || undefined,
            },
            create: {
              name: name || null,
              phoneNumber,
              email: email || null,
            },
          });

          return { success: true, contact: savedContact };
        } catch (error) {
          console.error("Error saving contact:", error);
          return { error: "Failed to save contact", contact };
        }
      })
    );

    // Count successful and failed operations
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => r.error).length;

    return NextResponse.json({
      message: `Processed ${successful} contacts successfully, ${failed} failed`,
      results,
    });
  } catch (error) {
    console.error("Error processing contacts:", error);
    return NextResponse.json(
      { error: "Failed to process contacts" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
