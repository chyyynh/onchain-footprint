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
    <div className="w-full h-screen overflow-hidden flex flex-col bg-black relative">
      {/* Gaming HUD Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900 opacity-90"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23334155" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* HUD Header */}
      <div className="relative z-10 w-full px-4 py-2 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          {/* Gaming Title Bar */}
          <div className="flex items-center justify-between mb-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-lg p-3 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h1 className="text-xl font-bold text-cyan-400 font-mono tracking-wider">
                [ GHOST GENESIS v2.1.3 ]
              </h1>
              <div className="text-xs text-slate-400 font-mono">STATUS: ONLINE</div>
            </div>
            <div className="text-xs text-cyan-400 font-mono">
              SYS_TIME: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* HUD Input Terminal */}
          <div className="bg-black/60 border border-cyan-400/40 rounded-lg backdrop-blur-md shadow-2xl shadow-cyan-500/20">
            <div className="border-b border-cyan-400/30 px-3 py-2 bg-gradient-to-r from-cyan-500/10 to-transparent">
              <div className="text-xs text-cyan-400 font-mono">WALLET_SCANNER &gt;&gt; INITIALIZING</div>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <ConnectButton />
                </div>
                <div className="flex-1 relative">
                  <Input
                    value={walletInput}
                    onChange={(e) => setWalletInput(e.target.value)}
                    placeholder="&gt;&gt;&gt; INPUT WALLET ADDRESS (0x...)"
                    className="h-10 bg-black/40 border border-cyan-400/40 text-cyan-100 placeholder:text-cyan-400/60 font-mono focus:border-cyan-400 focus:ring-cyan-400/20"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/60 font-mono text-xs">
                    {walletInput.length}/42
                  </div>
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !walletInput}
                  className="h-10 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-mono font-bold border border-cyan-400/50 shadow-lg shadow-cyan-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      SCANNING...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      INITIALIZE
                    </>
                  )}
                </Button>
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
                  className="h-10 border border-purple-400/50 text-purple-400 hover:bg-purple-500/20 font-mono"
                >
                  DEMO
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* HUD Error Terminal */}
        {error && (
          <div className="max-w-7xl mx-auto mt-2">
            <div className="bg-red-900/40 border border-red-400/50 rounded-lg backdrop-blur-md">
              <div className="border-b border-red-400/30 px-3 py-2 bg-gradient-to-r from-red-500/20 to-transparent">
                <div className="text-xs text-red-400 font-mono">ERROR_LOG &gt;&gt; SYSTEM_ALERT</div>
              </div>
              <div className="p-3">
                <div className="text-red-400 text-sm font-mono">
                  [!] SCAN_FAILED: {error}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* HUD Main Display */}
      <div className="relative z-10 flex-1 overflow-hidden px-4 pb-4">
        <div className="max-w-7xl mx-auto h-full">
          {character && (
            <div className="animate-in fade-in duration-500 h-full">
              <RPGCharacterCard character={character} />
            </div>
          )}

          {/* HUD Standby Screen */}
          {!character && !loading && !error && (
            <div className="text-center h-full flex items-center justify-center">
              <div className="max-w-md">
                {/* Holographic Display Effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-cyan-500/20 animate-pulse rounded-lg"></div>
                  <div className="relative bg-black/40 border border-cyan-400/30 rounded-lg p-8 backdrop-blur-md">
                    <div className="text-6xl mb-4 animate-bounce text-cyan-400">👻</div>
                    <h3 className="text-xl font-bold mb-3 text-cyan-400 font-mono tracking-wider">
                      [ SYSTEM STANDBY ]
                    </h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed font-mono">
                      Awaiting wallet input for onchain footprint analysis.
                      <br/>
                      Initialize scan to generate character data.
                    </p>
                    
                    {/* HUD Attribute Indicators */}
                    <div className="mt-6 grid grid-cols-5 gap-2 text-xs">
                      {['智慧', '冒險', '美感', '社交', '貪婪'].map((attr, i) => (
                        <div key={attr} className="bg-cyan-500/10 border border-cyan-400/30 rounded p-2 text-center">
                          <div className="text-cyan-400 font-mono">{attr}</div>
                          <div className="text-slate-500 text-xs mt-1">--</div>
                        </div>
                      ))}
                    </div>

                    {/* Scanning Animation */}
                    <div className="mt-4 flex justify-center">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i}
                            className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
