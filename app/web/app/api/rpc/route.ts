import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const rpcUrl = process.env.HELIUS_RPC_URL;

  if (!rpcUrl) {
    return NextResponse.json(
      { error: "RPC endpoint not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "RPC request failed" },
      { status: 500 }
    );
  }
}
