// src/app/api/alchemy-complete/route.ts
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
    // Method 1: Get asset transfers (works well)
    const transfersResponse = await fetch(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "transfers",
          method: "alchemy_getAssetTransfers",
          params: [{
            fromAddress: address,
            category: ["external", "internal", "erc20", "erc721", "erc1155"],
            withMetadata: true,
            excludeZeroValue: false,
            maxCount: "0x3e8" // 1000 transfers
          }]
        }),
      }
    );

    // Method 2: Get asset transfers TO this address  
    const transfersToResponse = await fetch(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "transfersTo",
          method: "alchemy_getAssetTransfers",
          params: [{
            toAddress: address,
            category: ["external", "internal", "erc20", "erc721", "erc1155"],
            withMetadata: true,
            excludeZeroValue: false,
            maxCount: "0x3e8" // 1000 transfers
          }]
        }),
      }
    );

    // Method 3: Use Alchemy's enhanced API to get transaction history
    const txHistoryResponse = await fetch(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "history",
          method: "alchemy_getTransactionHistory",
          params: [address, { fromBlock, toBlock }]
        }),
      }
    );

    let transfersFrom = [];
    let transfersTo = [];
    let transactionHistory = [];

    // Parse transfers FROM address
    if (transfersResponse.ok) {
      const data = await transfersResponse.json();
      if (!data.error) {
        transfersFrom = data.result?.transfers || [];
      }
    }

    // Parse transfers TO address
    if (transfersToResponse.ok) {
      const data = await transfersToResponse.json();
      if (!data.error) {
        transfersTo = data.result?.transfers || [];
      }
    }

    // Parse transaction history (if method exists)
    if (txHistoryResponse.ok) {
      const data = await txHistoryResponse.json();
      if (!data.error) {
        transactionHistory = data.result?.transactions || [];
      }
    }

    // Combine and deduplicate transfers
    const allTransfers = [...transfersFrom, ...transfersTo];
    const uniqueTransfers = allTransfers.filter((transfer, index, self) => 
      index === self.findIndex(t => t.hash === transfer.hash)
    );

    // Get basic transaction count for reference
    const txCountResponse = await fetch(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "txcount",
          method: "eth_getTransactionCount",
          params: [address, "latest"]
        }),
      }
    );

    let totalTxCount = 0;
    if (txCountResponse.ok) {
      const data = await txCountResponse.json();
      totalTxCount = parseInt(data.result || "0", 16);
    }

    return NextResponse.json({
      transfers_from: transfersFrom,
      transfers_to: transfersTo,
      unique_transfers: uniqueTransfers,
      transaction_history: transactionHistory,
      transfers_from_count: transfersFrom.length,
      transfers_to_count: transfersTo.length,
      unique_transfer_count: uniqueTransfers.length,
      transaction_history_count: transactionHistory.length,
      total_estimated_transactions: totalTxCount,
      success: true
    });

  } catch (err) {
    console.error("Alchemy Complete API error:", err);
    return NextResponse.json(
      { error: "Server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}