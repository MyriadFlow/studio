import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "No content provided" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: '420fa5e0818989bf7c8',
          pinata_secret_api_key: '059a5c6e54156958dce952e5ca416a0ee9832a071900ee4841e616e41a6c14c',
        },
        body: JSON.stringify({
          pinataContent: content,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Pinata Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to pin to IPFS", message: error.message },
      { status: 500 }
    );
  }
}
