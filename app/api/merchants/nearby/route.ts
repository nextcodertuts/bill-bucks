/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const q = searchParams.get("q") || "";
    const radius = parseFloat(searchParams.get("radius") || "10"); // Default 10km radius

    // Base query with pagination
    const query: any = {
      where: {},
      orderBy: [{ name: "asc" }],
      take: 50, // Limit results
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

    // Add location filter if coordinates are provided
    if (lat && lng) {
      // Using Postgres earth distance calculation
      query.where.AND = [
        {
          latitude: { not: null },
          longitude: { not: null },
        },
        {
          // Rough distance filter using bounding box
          latitude: {
            gte: lat - radius / 111.32, // Convert km to degrees
            lte: lat + radius / 111.32,
          },
          longitude: {
            gte: lng - radius / (111.32 * Math.cos((lat * Math.PI) / 180)),
            lte: lng + radius / (111.32 * Math.cos((lat * Math.PI) / 180)),
          },
        },
      ];

      // Order by distance using Postgres
      query.orderBy = [
        {
          latitude: {
            sort: "asc",
            distance: lat,
          },
        },
        {
          longitude: {
            sort: "asc",
            distance: lng,
          },
        },
      ];
    }

    const merchants = await prisma.merchant.findMany(query);

    return NextResponse.json(merchants);
  } catch (error) {
    console.error("Error fetching nearby merchants:", error);
    return NextResponse.json(
      { error: "Failed to fetch nearby merchants" },
      { status: 500 }
    );
  }
}
