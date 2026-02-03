import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

// Allowed file types
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("profile");

    // Validate file existence
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (file instanceof File) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" },
          { status: 400 },
        );
      }
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
async function fileToBuffer(file: FormDataEntryValue): Promise<Buffer> {
  // Handle File/Blob-like objects by checking for arrayBuffer method
  if (file && typeof file === "object" && typeof (file as any).arrayBuffer === "function") {
    const arrayBuffer = await (file as any).arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  // Handle base64 string
  if (typeof file === "string" && file.startsWith("data:")) {
    const base64Data = file.split(",")[1];
    return Buffer.from(base64Data, "base64");
  }

  // Handle Buffer (unlikely in browser but possible in some contexts)
  if (Buffer.isBuffer(file)) {
    return file;
  }

  throw new Error("Unsupported file format");
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
        // Optional: Add these for better performance
        eager: [
          { width: 400, height: 400, crop: "fill" }, // Thumbnail
          { width: 800, height: 800, crop: "limit" }, // Medium size
        ],
        eager_async: true, // Generate transformations asynchronously
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
