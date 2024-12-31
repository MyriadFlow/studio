<<<<<<< HEAD
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
=======
import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";

// Since we can't use formidable directly with Edge Runtime,
// we need to specify Node runtime
export const runtime = "nodejs";

// Configure the maximum duration for the API route
export const maxDuration = 60;

async function POST(req: NextRequest) {
  try {
    // Convert the request to a NodeJS readable stream
    const data = await req.formData();
    const file = data.get("file") as File;
>>>>>>> cdd9263 (chore: fix build issue)

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

<<<<<<< HEAD
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Pinata
    const formDataForPinata = new FormData();
    formDataForPinata.append("file", new Blob([buffer]), file.name);

    const pinataRes = await fetch(
=======
    // Create a temporary file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a temporary file path
    const tempFilePath = `/tmp/${file.name}`;
    fs.writeFileSync(tempFilePath, buffer);

    // Create form data for Pinata
    const formData = new FormData();
    formData.append("file", fs.createReadStream(tempFilePath));

    // Upload to Pinata
    const pinataRes = await axios.post(
>>>>>>> cdd9263 (chore: fix build issue)
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

<<<<<<< HEAD
    if (!pinataRes.ok) {
      throw new Error("Failed to upload to Pinata");
    }

    const data = await pinataRes.json();
    return NextResponse.json(data);
=======
    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);

    return NextResponse.json(pinataRes.data);
>>>>>>> cdd9263 (chore: fix build issue)
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}

export { POST };
