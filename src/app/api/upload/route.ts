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

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

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
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
          pinata_api_key: process.env.PINATA_API_KEY!,
          pinata_secret_api_key: process.env.PINATA_SECRET_KEY!,
        },
      }
    );

    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);

    return NextResponse.json(pinataRes.data);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}

export { POST };
