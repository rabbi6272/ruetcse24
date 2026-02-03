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
    // Remove file extension if present
    const cleanPublicId = publicId.replace(/\.[^/.]+$/, "");

    // If publicId doesn't include the folder, prepend it
    const fullPublicId = cleanPublicId.startsWith("Users/")
      ? cleanPublicId
      : `Users/${cleanPublicId}`;

    const result = await cloudinary.uploader.destroy(fullPublicId, {
      resource_type: "image",
    });

    if (result.result === "ok") {
      return NextResponse.json(
        { message: "Image deleted successfully" },
        { status: 200 },
      );
    } else if (result.result === "not found") {
      return NextResponse.json(
        { error: "Image not found in Cloudinary" },
        { status: 404 },
      );
    } else {
      return NextResponse.json(
        { error: "Failed to delete image from Cloudinary", result },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the image" },
      { status: 500 },
    );
  }
}
