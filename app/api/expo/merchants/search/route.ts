import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Normalize the search query
    const normalizedQuery = query.trim();

    // Check if query is a phone number (10 digits)
    const isPhoneNumber = /^\d{10}$/.test(normalizedQuery);

    // Check if query looks like an ID
    const isId =
      /^[a-zA-Z0-9]+$/.test(normalizedQuery) && normalizedQuery.length >= 3;

    // Build the where clause based on query type
    let whereClause = {};

    if (isPhoneNumber) {
      whereClause = {
        phone: normalizedQuery,
      };
    } else if (isId) {
      whereClause = {
        id: normalizedQuery,
      };
    } else {
      whereClause = {
        name: {
          contains: normalizedQuery,
          mode: "insensitive",
        },
      };
    }

    // Execute search with pagination
    const [merchants, total] = await Promise.all([
      prisma.merchant.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          phone: true,
          rating: true,
          category: true,
          logoUrl: true,
        },
        orderBy: [{ rating: "desc" }, { name: "asc" }],
        take: limit,
        skip,
      }),
      prisma.merchant.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      merchants,
      pagination: {
        total,
        page,
        limit,
        hasMore: skip + merchants.length < total,
      },
    });
  } catch (error) {
    console.error("Error searching merchants:", error);
    return NextResponse.json(
      { error: "Failed to search merchants" },
      { status: 500 }
    );
  }
}
