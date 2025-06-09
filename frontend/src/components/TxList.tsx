// components/TxList.tsx

"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function TxList() {
  const { address, isConnected } = useAccount();
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchTxs() {
    if (!address) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/txs?wallet=${address}`);
      const data = await res.json();
      if (Array.isArray(data.txs)) {
        setTxs(data.txs);
      } else {
        setTxs([]);
        if (data.error) {
          alert("API Error: " + data.error);
        }
      }
    } catch (err) {
      alert(
        "Fetch error: " + (err instanceof Error ? err.message : String(err))
      );
      setTxs([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded">
      <ConnectButton />

      {isConnected && (
        <>
          <button
            onClick={fetchTxs}
            disabled={loading}
            className={`px-4 py-2 rounded mt-4 text-white ${
              loading ? "bg-gray-500" : "bg-blue-500"
            }`}
          >
            {loading ? "Loading..." : "Show Transactions"}
          </button>

          <ul className="mt-4">
            {txs.length === 0 && !loading && <li>No transactions found.</li>}
            {txs.map((tx, idx) => (
              <li key={idx} className="mb-2 border-b pb-2">
                <div>
                  <strong>Hash:</strong> {tx.hash}
                </div>
                <div>
                  <strong>From:</strong> {tx.from}
                </div>
                <div>
                  <strong>To:</strong> {tx.to}
                </div>
                <div>
                  <strong>Value:</strong> {tx.value}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
