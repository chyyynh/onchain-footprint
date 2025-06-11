// src/app/api/getAllTxAlchemy/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("wallet");
  const fromBlock = req.nextUrl.searchParams.get("fromBlock") || "0x0";
  const toBlock = req.nextUrl.searchParams.get("toBlock") || "latest";

  if (!address) {
    return NextResponse.json(
      { error: "Missing wallet address" },
      { status: 400 }
    );
  }

  if (!process.env.ALCHEMY_API_KEY) {
    return NextResponse.json(
      { error: "Alchemy API key not configured" },
      { status: 500 }
    );
  }

  try {
    const allTransactions: any[] = [];
    let pageKey: string | undefined;
    let hasMore = true;
    let requestCount = 0;

    // Fetch all pages of transactions
    while (hasMore && requestCount < 50) { // Limit to prevent infinite loops
      requestCount++;

      const requestBody = {
        jsonrpc: "2.0",
        id: requestCount,
        method: "alchemy_getAssetTransfers",
        params: [{
          fromAddress: address,
          toAddress: address,
          fromBlock: fromBlock,
          toBlock: toBlock,
          category: ["external", "internal", "erc20", "erc721", "erc1155"],
          withMetadata: true,
          excludeZeroValue: false,
          maxCount: "0x3e8", // 1000 transactions per request
          ...(pageKey && { pageKey })
        }]
      };

      const response = await fetch(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: "Failed to fetch from Alchemy", details: errorText },
          { status: response.status }
        );
      }

      const data = await response.json();

      if (data.error) {
        return NextResponse.json(
          { error: "Alchemy API error", details: data.error },
          { status: 400 }
        );
      }

      const transfers = data.result?.transfers || [];
      
      if (transfers.length > 0) {
        allTransactions.push(...transfers);
      }

      // Check if there are more pages
      pageKey = data.result?.pageKey;
      hasMore = !!pageKey && transfers.length > 0;

      // Safety check to prevent excessive API calls
      if (allTransactions.length > 50000) {
        console.warn("Reached maximum transaction limit (50,000)");
        break;
      }
    }

    // Now get regular transactions (contract interactions without transfers)
    const txListResponse = await fetch(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "txlist",
          method: "eth_getTransactionCount",
          params: [address, "latest"]
        }),
      }
    );

    const txCountData = await txListResponse.json();
    const txCount = parseInt(txCountData.result || "0", 16);

    return NextResponse.json({
      transfers: allTransactions,
      transfer_count: allTransactions.length,
      estimated_total_tx_count: txCount,
      requests_made: requestCount,
      message: allTransactions.length >= 50000 
        ? "Results limited to 50,000 transfers. Use pagination for complete data." 
        : undefined,
      note: "This endpoint returns asset transfers. For ALL transactions including contract calls, use a different approach."
    });

  } catch (err) {
    console.error("Alchemy API error:", err);
    return NextResponse.json(
      { error: "Server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}