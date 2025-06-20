"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransactionContributionGraph } from "@/components/TransactionContributionGraph";
import { HexagonRadarChart } from "@/components/HexagonRadarChart";
import type { CharacterAttributes, ContractInteraction } from "@/lib/character-engine";

interface RPGCharacterData {
  address: string;
  class: string;
  rank: string;
  attributes: CharacterAttributes;
  totalTransactions: number;
  activeYears: number;
  activeYearsDetailed?: {
    years: number;
    days: number;
    displayText: string;
  };
  chainsUsed: string[];
  transactionActivity?: Array<{
    block_time: string;
    chain: string;
  }>;
  analysis: {
    nftCount: number;
    defiProtocols: string[];
    uniqueContracts: number;
    contractInteractions: ContractInteraction[];
  };
  description: string;
}

interface RPGCharacterCardProps {
  character: RPGCharacterData;
}


export function RPGCharacterCard({ character }: RPGCharacterCardProps) {
  const getRankColor = (rank: string) => {
    const colors = {
      S: "bg-gradient-to-r from-yellow-400 to-orange-500 text-black",
      A: "bg-gradient-to-r from-purple-500 to-pink-500 text-white", 
      B: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
      C: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
      D: "bg-gradient-to-r from-gray-500 to-slate-500 text-white"
    };
    return colors[rank as keyof typeof colors] || colors.D;
  };


  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* HUD Top Panel: Character Profile + Stats */}
      <div className="flex gap-4 mb-3 flex-shrink-0">
        {/* Character Profile HUD */}
        <div className="flex-shrink-0 bg-black/60 border border-cyan-400/40 rounded-lg backdrop-blur-md shadow-2xl shadow-cyan-500/10">
          <div className="border-b border-cyan-400/30 px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-transparent">
            <div className="text-xs text-cyan-400 font-mono">CHAR_PROFILE >> LOADED</div>
          </div>
          <div className="p-3">
            <div className="flex items-center gap-4">
              {/* Holographic Avatar */}
              <div className="relative w-20 h-20 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-lg animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center border border-cyan-400/50 shadow-lg shadow-cyan-500/20">
                  <div className="text-center text-white">
                    <div className="text-2xl">🎭</div>
                    <div className="text-xs opacity-80 font-mono">UNIT</div>
                  </div>
                </div>
              </div>
              
              {/* Character Data */}
              <div className="min-w-0">
                <h1 className="text-lg font-bold mb-1 text-cyan-400 font-mono tracking-wider">
                  {character.class}
                </h1>
                <p className="text-slate-400 font-mono text-xs mb-2">
                  ID: {character.address.slice(0, 8)}...{character.address.slice(-6)}
                </p>
                <div className={`inline-block px-2 py-1 text-xs font-bold font-mono rounded border ${getRankColor(character.rank)} shadow-lg`}>
                  RANK: {character.rank}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HUD Stats Panels */}
        <div className="flex-1 grid grid-cols-4 gap-2">
          <div className="bg-black/60 border border-blue-400/40 rounded backdrop-blur-md">
            <div className="border-b border-blue-400/30 px-2 py-1 bg-gradient-to-r from-blue-500/20 to-transparent">
              <div className="text-xs text-blue-400 font-mono">TX_COUNT</div>
            </div>
            <div className="p-2 text-center">
              <div className="text-xl font-bold text-blue-400 font-mono">{character.totalTransactions}</div>
              <div className="text-xs text-slate-400 font-mono">TOTAL</div>
            </div>
          </div>
          
          <div className="bg-black/60 border border-green-400/40 rounded backdrop-blur-md">
            <div className="border-b border-green-400/30 px-2 py-1 bg-gradient-to-r from-green-500/20 to-transparent">
              <div className="text-xs text-green-400 font-mono">ACTIVE_TIME</div>
            </div>
            <div className="p-2 text-center">
              <div className="text-xl font-bold text-green-400 font-mono">
                {character.activeYearsDetailed?.displayText || character.activeYears}
              </div>
              <div className="text-xs text-slate-400 font-mono">YEARS</div>
            </div>
          </div>
          
          <div className="bg-black/60 border border-purple-400/40 rounded backdrop-blur-md">
            <div className="border-b border-purple-400/30 px-2 py-1 bg-gradient-to-r from-purple-500/20 to-transparent">
              <div className="text-xs text-purple-400 font-mono">CHAINS</div>
            </div>
            <div className="p-2 text-center">
              <div className="text-xl font-bold text-purple-400 font-mono">{character.chainsUsed.length}</div>
              <div className="text-xs text-slate-400 font-mono">NETWORKS</div>
            </div>
          </div>
          
          <div className="bg-black/60 border border-pink-400/40 rounded backdrop-blur-md">
            <div className="border-b border-pink-400/30 px-2 py-1 bg-gradient-to-r from-pink-500/20 to-transparent">
              <div className="text-xs text-pink-400 font-mono">NFT_DATA</div>
            </div>
            <div className="p-2 text-center">
              <div className="text-xl font-bold text-pink-400 font-mono">{character.analysis.nftCount}</div>
              <div className="text-xs text-slate-400 font-mono">ASSETS</div>
            </div>
          </div>
        </div>
      </div>

      {/* HUD Main Displays */}
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
        {/* Attributes Scanner (4 columns) */}
        <div className="col-span-4 h-full bg-black/60 border border-cyan-400/40 rounded-lg backdrop-blur-md shadow-lg shadow-cyan-500/10">
          <div className="border-b border-cyan-400/30 px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-transparent">
            <div className="text-xs text-cyan-400 font-mono">ATTR_SCANNER &gt;&gt; ACTIVE</div>
          </div>
          <div className="p-3 h-full flex flex-col">
            <div className="flex-1 flex justify-center items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-transparent to-purple-400/10 rounded-full animate-spin-slow"></div>
                <HexagonRadarChart attributes={character.attributes} size={220} />
              </div>
            </div>
          </div>
        </div>

        {/* Network & Protocol Analysis (5 columns) */}
        <div className="col-span-5 h-full bg-black/60 border border-green-400/40 rounded-lg backdrop-blur-md shadow-lg shadow-green-500/10">
          <div className="border-b border-green-400/30 px-3 py-2 bg-gradient-to-r from-green-500/20 to-transparent">
            <div className="text-xs text-green-400 font-mono">NETWORK_ANALYSIS &gt;&gt; SCANNING</div>
          </div>
          <div className="p-3 h-full flex flex-col">
            {/* Network Grid */}
            <div className="mb-3">
              <div className="text-sm text-green-400 font-mono mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                BLOCKCHAIN_NETWORKS
              </div>
              <div className="grid grid-cols-4 gap-1">
                {character.chainsUsed.slice(0, 12).map((chain) => (
                  <div 
                    key={chain} 
                    className="bg-green-500/20 border border-green-400/40 rounded text-center py-1 px-1"
                  >
                    <div className="text-xs text-green-400 font-mono truncate">{chain}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Protocol Matrix */}
            {character.analysis.contractInteractions.length > 0 && (
              <div className="flex-1">
                <div className="text-sm text-green-400 font-mono mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  PROTOCOL_MATRIX
                </div>
                <div className="grid grid-cols-3 gap-2 h-full">
                  {character.analysis.contractInteractions.slice(0, 9).map((interaction) => (
                    <div key={interaction.protocol} className="bg-black/40 border border-green-400/30 rounded p-2 text-center backdrop-blur-sm">
                      <div className="text-xs text-green-400 font-mono mb-1 truncate">
                        {interaction.protocol}
                      </div>
                      <div className="text-lg font-bold text-green-400 font-mono">
                        {interaction.count}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">OPS</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Log & Story Archive (3 columns) */}
        <div className="col-span-3 h-full bg-black/60 border border-purple-400/40 rounded-lg backdrop-blur-md shadow-lg shadow-purple-500/10">
          <div className="border-b border-purple-400/30 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-transparent">
            <div className="text-xs text-purple-400 font-mono">DATA_LOG &gt;&gt; ACCESSED</div>
          </div>
          <div className="p-3 h-full flex flex-col">
            {/* Activity Monitor */}
            {character.transactionActivity && (
              <div className="mb-3">
                <div className="text-sm text-purple-400 font-mono mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  ACTIVITY_MONITOR
                </div>
                <div className="bg-black/40 border border-purple-400/30 rounded p-2 backdrop-blur-sm">
                  <div className="text-xs text-purple-400 font-mono">
                    TX_LAST_YEAR: <span className="text-purple-300">{character.transactionActivity.length}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">STATUS: ACTIVE</div>
                </div>
              </div>
            )}

            {/* Character Archive */}
            <div className="flex-1">
              <div className="text-sm text-purple-400 font-mono mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                CHAR_ARCHIVE
              </div>
              <div className="bg-black/40 border border-purple-400/30 rounded p-2 h-full backdrop-blur-sm overflow-hidden">
                <div className="text-xs text-slate-300 leading-relaxed font-mono">
                  <div className="text-purple-400 mb-1">[STORY_LOG]</div>
                  <p className="line-clamp-12 text-slate-400">
                    {character.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}