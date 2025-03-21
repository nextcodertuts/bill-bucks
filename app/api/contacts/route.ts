/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const BATCH_SIZE = 50; // Process contacts in smaller batches

export async function POST(request: Request) {
  try {
    const contacts = await request.json();

    if (!Array.isArray(contacts)) {
      return NextResponse.json(
        { error: "Invalid contacts data format" },
        { status: 400 }
      );
    }

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as { contact: any; error: string }[],
    };

    // Process contacts in batches
    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
      const batch = contacts.slice(i, i + BATCH_SIZE);

      try {
        // Use prisma transaction for batch processing
        await prisma.$transaction(async (tx) => {
          for (const contact of batch) {
            const { name, phoneNumber, email } = contact;

            if (!phoneNumber) {
              results.failed++;
              results.errors.push({
                contact,
                error: "Phone number is required",
              });
              continue;
            }

            try {
              await tx.contact.upsert({
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
              results.successful++;
            } catch (error) {
              results.failed++;
              results.errors.push({
                contact,
                error: "Failed to save contact",
              });
            }
          }
        });
      } catch (error) {
        console.error("Error processing batch:", error);
        // Continue with next batch even if current batch fails
      }
    }

    return NextResponse.json({
      message: `Processed ${results.successful} contacts successfully, ${results.failed} failed`,
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
