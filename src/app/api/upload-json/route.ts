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
          pinata_api_key: 'fd37bea7d175cf88fb60',
          pinata_secret_api_key: '85d42a6aa7e399789beee89b987a55ebf44173a03ef49782ac486bddb34e22f4',
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
