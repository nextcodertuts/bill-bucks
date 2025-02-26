/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { validateRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert the file to a Blob and create a FormData object for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", blob, file.name);
    cloudinaryFormData.append("upload_preset", "invoices"); // Use your correct upload preset

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    );

    if (!cloudinaryResponse.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const cloudinaryData = await cloudinaryResponse.json();

    return NextResponse.json(
      { url: cloudinaryData.secure_url },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
