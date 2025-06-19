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
    <div className="max-w-7xl mx-auto">
      {/* Character Header - Full Width */}
      <Card className="mb-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{character.class}</h1>
              <p className="text-slate-300 font-mono text-sm">
                {character.address.slice(0, 8)}...{character.address.slice(-6)}
              </p>
            </div>
            <Badge className={`text-xl px-6 py-3 font-bold ${getRankColor(character.rank)}`}>
              {character.rank} 級
            </Badge>
          </div>

          {/* Stats & Character Image - Gaming Profile Layout */}
          <div className="flex gap-6 h-full">
            {/* Stats Column - 1/3 Width */}
            <div className="w-1/3 flex flex-col justify-between">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{character.totalTransactions}</div>
                <div className="text-sm text-slate-400">總交易數</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {character.activeYearsDetailed?.displayText || character.activeYears}
                </div>
                <div className="text-sm text-slate-400">活躍年數</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{character.chainsUsed.length}</div>
                <div className="text-sm text-slate-400">使用鏈數</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">{character.analysis.nftCount}</div>
                <div className="text-sm text-slate-400">NFT 收藏</div>
              </div>
            </div>
            
            {/* Character Image Placeholder - 2/3 Width */}
            <div className="w-2/3 flex justify-center items-center">
              <div className="aspect-square w-full max-w-sm bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center border-2 border-slate-300">
                <div className="text-center text-slate-500">
                  <div className="text-6xl mb-3">🎭</div>
                  <div className="text-lg font-medium">Character Avatar</div>
                  <div className="text-sm text-slate-400 mt-1">Generated from onchain history</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid - Left/Right Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column - Radar Chart */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4 text-center">角色屬性</h2>
            <div className="flex justify-center">
              <HexagonRadarChart attributes={character.attributes} size={320} />
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Protocol Interactions & Blockchain */}
        <Card className="flex-1">
          <CardContent className="p-6">
            {/* Chains Used */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">探索的區塊鏈世界</h2>
              <div className="flex flex-wrap gap-2">
                {character.chainsUsed.map((chain) => (
                  <Badge key={chain} variant="outline" className="capitalize text-sm py-1 px-3">
                    {chain}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contract Interactions */}
            {character.analysis.contractInteractions.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">協議互動統計</h2>
                <div className="overflow-x-auto">
                  <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
                    {character.analysis.contractInteractions.map((interaction) => (
                      <div key={interaction.protocol} className="bg-slate-50 rounded-lg p-4 text-center flex-shrink-0 min-w-[140px]">
                        <div className="font-medium text-sm text-slate-700 mb-1">
                          {interaction.protocol}
                        </div>
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {interaction.count}
                        </div>
                        <div className="text-xs text-slate-500 mb-2">次互動</div>
                        <Badge variant="secondary" className="text-xs">
                          {interaction.addresses.length} 個合約
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction Activity Graph - Full Width */}
      {character.transactionActivity && (
        <TransactionContributionGraph 
          transactions={character.transactionActivity}
          className="mb-6"
        />
      )}

      {/* Character Story - Full Width */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">角色背景故事</h2>
          <div className="prose prose-slate max-w-none">
            <p className="whitespace-pre-line text-slate-700 leading-relaxed text-lg">
              {character.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}