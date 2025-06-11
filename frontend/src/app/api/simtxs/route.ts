// src/app/api/simtxs/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("wallet");
  const chainIds = req.nextUrl.searchParams.get("chain_ids");
  const limit = req.nextUrl.searchParams.get("limit") || "20";
  const offset = req.nextUrl.searchParams.get("offset") || "0";

  if (!address) {
    return NextResponse.json(
      { error: "Missing wallet address" },
      { status: 400 }
    );
  }

  const queryParams = new URLSearchParams({
    limit,
    offset,
  });
  
  if (chainIds) {
    queryParams.set("chain_ids", chainIds);
  }

  try {
    const response = await fetch(
      `https://api.sim.dune.com/v1/evm/transactions/${address}?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "X-Sim-Api-Key": process.env.DUNE_API_KEY || "",
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
