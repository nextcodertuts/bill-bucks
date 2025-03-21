/* eslint-disable @typescript-eslint/no-unused-vars */
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

    // Filter out invalid contacts
    const validContacts = contacts.filter((contact) => contact.phoneNumber);

    if (validContacts.length === 0) {
      return NextResponse.json(
        { error: "No valid contacts provided" },
        { status: 400 }
      );
    }

    // Prepare data for bulk upsert
    const data = validContacts.map((contact) => ({
      phoneNumber: contact.phoneNumber,
      name: contact.name || null,
      email: contact.email || null,
    }));

    // Perform bulk upsert using createMany
    const result = await prisma.$transaction(async (tx) => {
      // First, create all new contacts
      await tx.contact.createMany({
        data,
        skipDuplicates: true,
      });

      // Then, update existing contacts
      for (const contact of data) {
        await tx.contact.update({
          where: { phoneNumber: contact.phoneNumber },
          data: {
            name: contact.name,
            email: contact.email,
          },
        });
      }

      return { count: data.length };
    });

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${result.count} contacts`,
      count: result.count,
    });
  } catch (error) {
    console.error("Error processing contacts:", error);

    // Check if it's a timeout error
    if (error instanceof Error && error.message.includes("timeout")) {
      return NextResponse.json(
        {
          error: "Request timeout - try with fewer contacts",
          details: error.message,
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to process contacts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
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
