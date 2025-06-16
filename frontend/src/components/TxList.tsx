"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Inbox } from "lucide-react";

export function TxList() {
  const { address, isConnected } = useAccount();
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchTxs() {
    if (!address) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/alchemy-history?wallet=${address}`);
      const data = await res.json();
      if (Array.isArray(data.txs)) {
        setTxs(data.txs);
      } else {
        setTxs([]);
        if (data.error) {
          console.error("API Error:", data.error);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setTxs([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <ConnectButton />
        
        {isConnected && (
          <Button onClick={fetchTxs} disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Show Transactions"
            )}
          </Button>
        )}
      </div>

      {txs.length === 0 && !loading && isConnected && (
        <div className="text-center py-8 text-muted-foreground">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Inbox className="h-8 w-8" />
          </div>
          <p>No transactions found for this wallet.</p>
        </div>
      )}

      {txs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <div className="grid gap-4">
            {txs.map((tx, idx) => (
              <Card key={idx} className="transition-transform hover:scale-[1.02]">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-mono text-sm text-muted-foreground mb-2">
                        <span className="font-semibold">Hash:</span> {tx.hash?.slice(0, 10)}...{tx.hash?.slice(-8)}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">From:</span>
                          <p className="font-mono">{tx.from?.slice(0, 8)}...{tx.from?.slice(-6)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">To:</span>
                          <p className="font-mono">{tx.to?.slice(0, 8)}...{tx.to?.slice(-6)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <Badge variant="secondary" className="mb-2">
                        {tx.value} ETH
                      </Badge>
                      <p className="text-xs text-muted-foreground">Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
