/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lat = Number.parseFloat(searchParams.get("lat") || "0");
    const lng = Number.parseFloat(searchParams.get("lng") || "0");
    const q = searchParams.get("q") || "";
    const radius = Number.parseFloat(searchParams.get("radius") || "10"); // Default 10km radius
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Check if valid coordinates are provided
    const hasValidCoordinates =
      !isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0);

    // Base query with pagination
    const query: any = {
      where: {} as any,
      take: limit,
      skip,
    };

    // Add search filter if query exists
    if (q) {
      query.where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { address: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ];
    }

    // Add location filter if valid coordinates are provided
    if (hasValidCoordinates) {
      // Use raw SQL to calculate distance using PostgreSQL's Haversine formula
      const merchants = await prisma.$queryRaw`
        SELECT 
          m.*,
          (
            6371 * acos(
              least(1.0, greatest(-1.0, 
                cos(radians(${lat})) * 
                cos(radians(m."latitude")) * 
                cos(radians(m."longitude") - radians(${lng})) + 
                sin(radians(${lat})) * 
                sin(radians(m."latitude"))
              ))
            )
          ) AS distance
        FROM "Merchant" m
        WHERE 
          m."latitude" IS NOT NULL 
          AND m."longitude" IS NOT NULL
          ${
            q
              ? Prisma.sql`AND (
                  m."name" ILIKE ${`%${q}%`} OR
                  m."address" ILIKE ${`%${q}%`} OR
                  m."city" ILIKE ${`%${q}%`} OR
                  m."category" ILIKE ${`%${q}%`}
                )`
              : Prisma.sql``
          }
          AND (
            6371 * acos(
              least(1.0, greatest(-1.0, 
                cos(radians(${lat})) * 
                cos(radians(m."latitude")) * 
                cos(radians(m."longitude") - radians(${lng})) + 
                sin(radians(${lat})) * 
                sin(radians(m."latitude"))
              ))
            )
          ) <= ${radius}
        ORDER BY distance
        LIMIT ${limit}
        OFFSET ${skip}
      `;

      // Count total matching merchants for pagination
      const countResult: any = await prisma.$queryRaw`
        SELECT COUNT(*) as total
        FROM "Merchant" m
        WHERE 
          m."latitude" IS NOT NULL 
          AND m."longitude" IS NOT NULL
          ${
            q
              ? Prisma.sql`AND (
                  m."name" ILIKE ${`%${q}%`} OR
                  m."address" ILIKE ${`%${q}%`} OR
                  m."city" ILIKE ${`%${q}%`} OR
                  m."category" ILIKE ${`%${q}%`}
                )`
              : Prisma.sql``
          }
          AND (
            6371 * acos(
              least(1.0, greatest(-1.0, 
                cos(radians(${lat})) * 
                cos(radians(m."latitude")) * 
                cos(radians(m."longitude") - radians(${lng})) + 
                sin(radians(${lat})) * 
                sin(radians(m."latitude"))
              ))
            )
          ) <= ${radius}
      `;

      const total = Number.parseInt(countResult[0].total);

      // Convert BigInt values to numbers for JSON serialization
      const serializedMerchants = merchants.map((merchant: any) => ({
        ...merchant,
        distance: Number(merchant.distance),
        // Convert any other BigInt properties if needed
        id: merchant.id,
        cashbackAmount: merchant.cashbackAmount
          ? Number(merchant.cashbackAmount)
          : merchant.cashbackAmount,
      }));

      return NextResponse.json({
        merchants: serializedMerchants,
        total,
        hasMore: skip + serializedMerchants.length < total,
      });
    } else {
      // If no valid location provided, use standard Prisma query
      query.orderBy = [{ name: "asc" }];
      const merchants = await prisma.merchant.findMany(query);
      const total = await prisma.merchant.count({ where: query.where });

      return NextResponse.json({
        merchants,
        total,
        hasMore: skip + merchants.length < total,
      });
    }
  } catch (error) {
    console.error("Error fetching nearby merchants:", error);
    return NextResponse.json(
      { error: "Failed to fetch nearby merchants" },
      { status: 500 }
    );
  }
}
