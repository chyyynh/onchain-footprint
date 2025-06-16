// src/app/api/dune-transactions-all/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("wallet");
  const chainIds = req.nextUrl.searchParams.get("chain_ids");

  if (!address) {
    return NextResponse.json(
      { error: "Missing wallet address" },
      { status: 400 }
    );
  }

  try {
    const allTransactions: any[] = [];
    let nextOffset: string | null = null;
    let hasMore = true;

    // Fetch all pages
    while (hasMore) {
      const queryParams = new URLSearchParams();
      queryParams.set("limit", "100"); // Use larger limit for efficiency
      
      if (nextOffset) {
        queryParams.set("offset", nextOffset);
      }
      if (chainIds) {
        queryParams.set("chain_ids", chainIds);
      }

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
      
      if (data.transactions && data.transactions.length > 0) {
        allTransactions.push(...data.transactions);
      }

      // Check if there are more pages
      nextOffset = data.next_offset;
      hasMore = !!nextOffset && data.transactions && data.transactions.length > 0;
      
      // Safety check to prevent infinite loops
      if (allTransactions.length > 10000) {
        console.warn("Reached maximum transaction limit (10,000)");
        break;
      }
    }

    return NextResponse.json({
      transactions: allTransactions,
      total_count: allTransactions.length,
      message: allTransactions.length >= 10000 ? "Results limited to 10,000 transactions" : undefined
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err },
      { status: 500 }
    );
  }
}