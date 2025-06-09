// src/app/api/simtxs/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("wallet");
  const page = req.nextUrl.searchParams.get("page") || "1";
  const pageSize = req.nextUrl.searchParams.get("page_size") || "20";

  if (!address) {
    return NextResponse.json(
      { error: "Missing wallet address" },
      { status: 400 }
    );
  }

  const uri = `?address=${address}&page=${page}&page_size=${pageSize}`;

  try {
    const response = await fetch(
      `https://api.sim.dune.com/v1/evm/transactions${uri}`,
      {
        method: "GET",
        headers: {
          "X-Sim-Api-Key": process.env.DUNE_API_KEY || "", // ⚠️ 環境變數要設定
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: "Failed to fetch Dune Sim API", details: text },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err },
      { status: 500 }
    );
  }
}
