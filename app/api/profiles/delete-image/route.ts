import { v2 as cloudinary } from "cloudinary";

import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function DELETE(request: Request) {
  const { publicId } = await request.json();
  if (!publicId) {
    return NextResponse.json(
      { error: "PublicId is required" },
      { status: 400 },
    );
  }
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok" && result.result === "not found") {
      return NextResponse.json(
        { error: "Failed to delete image from Cloudinary" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the image" },
      { status: 500 },
    );
  }
}
