"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RPGCharacterCard } from "@/components/RPGCharacterCard";
import { Loader2, Search, Sparkles } from "lucide-react";

export default function CharacterPage() {
  const { address } = useAccount();
  const [walletInput, setWalletInput] = useState("");
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCharacter = async (walletAddress: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/supabase-rpg-character?wallet=${walletAddress}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate character");
      }

      setCharacter(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    const targetWallet = walletInput || address;
    if (targetWallet) {
      generateCharacter(targetWallet);
    }
  };

  // Auto-generate for connected wallet
  useEffect(() => {
    if (address && !walletInput) {
      setWalletInput(address);
    }
  }, [address]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header 
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ghost Genesis
          </h1>
        </div>
        */}

        {/* Input Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-center">
                <ConnectButton />
              </div>

              <div className="flex gap-3">
                <Input
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                  placeholder="輸入錢包地址 (0x...) 或連接你的錢包"
                  className="flex-1"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !walletInput}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成角色
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Test Button */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setWalletInput(
                      "0xC79Ead066Ba487398F57f6083A97890d77C55482"
                    );
                    generateCharacter(
                      "0xC79Ead066Ba487398F57f6083A97890d77C55482"
                    );
                  }}
                  className="text-sm"
                >
                  🎮 體驗示範角色
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="text-red-800">
                <strong>錯誤:</strong> {error}
                {error.includes("No transactions found") && (
                  <div className="mt-2 text-sm">
                    <p>請先同步錢包交易數據:</p>
                    <code className="bg-red-100 px-2 py-1 rounded text-xs">
                      POST /api/supabase-wallet-sync{" "}
                      {`{"wallet": "${walletInput}"}`}
                    </code>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Character Display */}
        {character && (
          <div className="animate-in fade-in duration-500">
            <RPGCharacterCard character={character} />
          </div>
        )}

        {/* Empty State */}
        {!character && !loading && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">👻</div>
              <h3 className="text-lg font-semibold mb-2">
                等待喚醒你的鏈上靈魂
              </h3>
              <p className="text-muted-foreground">
                輸入錢包地址，讓我們分析你的鏈上足跡，生成專屬的 RPG 角色
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info Footer */}
        <div className="mt-12 text-center text-sm text-slate-500">
          <p>
            ✨ 基於 {character?.totalTransactions || "N/A"}{" "}
            筆鏈上交易數據分析生成 • 數據來源: Dune Analytics + Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
