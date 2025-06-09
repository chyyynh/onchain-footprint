// src/app/api/txs/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json(
      { error: "Missing wallet address" },
      { status: 400 }
    );
  }

  const apiKey = process.env.ALCHEMY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing Alchemy API key" },
      { status: 500 }
    );
  }

  try {
    console.log("Fetching txs for wallet:", wallet);

    // 這是你新的 REST API endpoint，注意要帶上 wallet address 和 apiKey
    const url = `https://api.g.alchemy.com/data/v1/${apiKey}/transactions/history/by-address`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addresses: [
          {
            address: wallet,
            networks: ["eth-mainnet"],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Alchemy API error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();

    // 這邊你要根據 API 回傳格式做調整
    // 假設它回傳一個 transactions 陣列（請根據實際回傳結構修改）
    const formattedTxs = (data.transactions || []).map((tx: any) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value || "0",
      asset: tx.asset || "ETH",
      blockNum: tx.blockNum || "",
    }));

    return NextResponse.json({ txs: formattedTxs });
  } catch (err) {
    console.error("Failed to fetch txs:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch transactions",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
