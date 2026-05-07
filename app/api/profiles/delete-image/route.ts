import { v2 as cloudinary } from "cloudinary";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

import { db } from "../../../../util/FirebaseConfig";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: Request) {
  try {
    const { publicId, studentId, pincode } = await request.json();

    if (!publicId || !studentId || !pincode) {
      return NextResponse.json(
        { error: "PublicId, studentId, and pincode are required" },
        { status: 400 },
      );
    }

    const studentSnap = await getDoc(doc(db, "users", studentId));
    if (!studentSnap.exists() || studentSnap.data().pincode !== pincode) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Remove file extension if present
    const cleanPublicId: string = publicId.replace(/\.[^/.]+$/, "");

    // If publicId doesn't include the folder, prepend it
    const fullPublicId: string = cleanPublicId.startsWith("Users/")
      ? cleanPublicId
      : `Users/${cleanPublicId}`;

    if (!fullPublicId.startsWith("Users/")) {
      return NextResponse.json(
        { error: "Invalid image publicId" },
        { status: 400 },
      );
    }

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
