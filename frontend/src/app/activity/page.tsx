"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";

export default function FootstepsPage() {
  const [wallet, setWallet] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [nextOffset, setNextOffset] = useState<number | null>(null);

  const fetchTransactions = async (resetOffset = false) => {
    setLoading(true);
    const currentOffset = resetOffset ? 0 : offset;
    const res = await fetch(`/api/simtxs?wallet=${wallet}&limit=20&offset=${currentOffset}`);
    const data = await res.json();
    console.log("Fetched transactions:", data);
    
    if (resetOffset) {
      setTransactions(data.transactions || []);
      setOffset(0);
    } else {
      setTransactions(prev => [...prev, ...(data.transactions || [])]);
    }
    
    setNextOffset(data.next_offset || null);
    setLoading(false);
  };

  const loadMore = () => {
    if (nextOffset) {
      setOffset(nextOffset);
      fetchTransactions(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Transaction History</h1>
          <p className="text-xl text-muted-foreground">
            Explore detailed blockchain transaction data
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-3 mb-6">
              <Input
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="Enter wallet address (0x...)"
                className="flex-1"
              />
              <Button
                onClick={() => fetchTransactions(true)}
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {transactions.length === 0 && !loading && wallet && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8" />
                </div>
                <p>No transactions found for this address.</p>
              </div>
            )}

            <div className="space-y-4">
              {transactions.map((tx, i) => (
                <Card key={`${tx.hash}-${i}`} className="transition-transform hover:scale-[1.01]">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            Block {tx.block_number}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {tx.block_time ? new Date(tx.block_time).toLocaleString() : ""}
                          </span>
                        </div>
                        
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
                      
                      <div className="text-right ml-4 space-y-2">
                        {tx.value && tx.value !== "0" && (
                          <Badge variant="secondary">
                            {(parseInt(tx.value) / 1e18).toFixed(4)} ETH
                          </Badge>
                        )}
                        
                        <div>
                          <p className="text-sm font-medium">{tx.gas_used || tx.gas_limit}</p>
                          <p className="text-xs text-muted-foreground">
                            Gas {tx.gas_price && `@ ${(parseInt(tx.gas_price) / 1e9).toFixed(1)} Gwei`}
                          </p>
                        </div>
                        
                        {tx.transaction_type && (
                          <Badge variant="outline">
                            {tx.transaction_type}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {nextOffset && !loading && (
              <div className="mt-6 text-center">
                <Button
                  onClick={loadMore}
                  variant="secondary"
                  size="lg"
                >
                  Load More Transactions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
