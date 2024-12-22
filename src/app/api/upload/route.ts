import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

// Remove this old config export
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// Add this new config for large file uploads
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Pinata
    const formDataForPinata = new FormData();
    formDataForPinata.append("file", new Blob([buffer]), file.name);

    const pinataRes = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY!,
          pinata_secret_api_key: process.env.PINATA_SECRET_KEY!,
        },
        body: formDataForPinata,
      }
    );

    if (!pinataRes.ok) {
      throw new Error("Failed to upload to Pinata");
    }

    const data = await pinataRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
