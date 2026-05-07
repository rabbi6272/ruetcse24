import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("profile");

    // Validate file existence
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 },
      );
    }

    // Convert file to buffer
    const buffer = await fileToBuffer(file);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer);

    return NextResponse.json(
      {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Upload failed:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Upload failed";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Helper function to convert file to buffer
async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Helper function to upload to Cloudinary
function uploadToCloudinary(buffer: Buffer): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "Users",
        resource_type: "image",
        // Optimizations
        transformation: [
          {
            quality: "auto:good", // Automatic quality optimization
            fetch_format: "auto", // Automatic format selection (WebP for supported browsers)
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(buffer);
  });
}
