"use client";

import { useState } from "react";

export default function FootstepsPage() {
  const [wallet, setWallet] = useState("");
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFootsteps = async () => {
    setLoading(true);
    const res = await fetch(`/api/activity?wallet=${wallet}`);
    const data = await res.json();
    console.log("Fetched activities:", data);
    // The API returns { activity: [...] }
    setActivities(data.activity || []);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Footsteps Explorer 👣</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Enter wallet address"
          className="border rounded px-3 py-2 w-full"
        />
        <button
          onClick={fetchFootsteps}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Fetch
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <ul className="space-y-4">
        {activities.length === 0 && !loading && (
          <li className="text-gray-500">No activity found.</li>
        )}
        {activities.map((a, i) => (
          <li key={i} className="border p-3 rounded shadow">
            <p className="text-sm text-gray-600">
              {a.block_time ? new Date(a.block_time).toLocaleString() : ""}
            </p>
            {a.type === "send" && (
              <p>
                ➡️ Sent: <b>{a.value}</b> {a.token_metadata?.symbol || ""} to{" "}
                {a.to}
              </p>
            )}
            {a.type === "receive" && (
              <p>
                ⬅️ Received: <b>{a.value}</b> {a.token_metadata?.symbol || ""}{" "}
                from {a.from}
              </p>
            )}
            {a.type === "mint" && (
              <p>
                🪙 Minted: <b>{a.value}</b> {a.token_metadata?.symbol || ""}
              </p>
            )}
            {a.type === "burn" && (
              <p>
                🔥 Burned: <b>{a.value}</b> {a.token_metadata?.symbol || ""}
              </p>
            )}
            {a.type === "swap" && (
              <p>
                🔄 Swap: <b>{a.value}</b> {a.token_metadata?.symbol || ""}
              </p>
            )}
            {a.type === "approve" && (
              <p>
                ✅ Approved: <b>{a.value}</b> {a.token_metadata?.symbol || ""}{" "}
                to {a.to}
              </p>
            )}
            {a.type === "call" && (
              <p>
                🔧 Call: <b>{a.method || a.function_name || "Unknown"}</b> to{" "}
                {a.to}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
