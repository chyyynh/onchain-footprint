// app/api/dune-wallet-activity/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");
  if (!wallet)
    return NextResponse.json(
      { error: "Missing wallet address" },
      { status: 400 }
    );

  const uri = `${wallet}`; // Only the wallet address as path param
  const params = new URLSearchParams({
    page: "1",
    page_size: "50",
  });
  const res = await fetch(
    `https://api.sim.dune.com/v1/evm/activity/${uri}?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "X-Sim-Api-Key": process.env.DUNE_API_KEY!,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch from Dune" },
      { status: 500 }
    );
  }

  const data = await res.json();
  console.log("Fetched activity data:", data); // Debug log
  return NextResponse.json(data);
}
