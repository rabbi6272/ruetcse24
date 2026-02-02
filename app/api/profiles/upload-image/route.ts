import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("profile");
  try {
    let buffer: Buffer;
    // If the file is a Blob/File (browser File), convert to Buffer
    if (file && typeof (file as any).arrayBuffer === "function") {
      const bytes = await (file as any).arrayBuffer();
      buffer = Buffer.from(bytes);
    }
    // Check if file is already a buffer
    else if (Buffer.isBuffer(file)) {
      buffer = file as unknown as Buffer;
    }
    // Check if file is a string (possibly a base64 data URL)
    else if (typeof file === "string" && file.startsWith("data:")) {
      const base64Data = file.split(",")[1];
      buffer = Buffer.from(base64Data, "base64");
    } else {
      throw new Error("Invalid file format or no file uploaded");
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "Users",
          resource_type: "image",
          upload_preset: "user-images",
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

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Upload failed", error);
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
    });
  }
}
