"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransactionContributionGraph } from "@/components/TransactionContributionGraph";
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

  const getAttributeStars = (value: number) => {
    return "⭐".repeat(value) + "☆".repeat(5 - value);
  };

  const getAttributeEmoji = (attribute: keyof CharacterAttributes) => {
    const emojis = {
      wisdom: "🧠",
      adventure: "🧭", 
      aesthetic: "🎨",
      social: "👥",
      greed: "🪙",
      stability: "🔒"
    };
    return emojis[attribute];
  };

  const getAttributeName = (attribute: keyof CharacterAttributes) => {
    const names = {
      wisdom: "智慧",
      adventure: "冒險",
      aesthetic: "美感", 
      social: "社交",
      greed: "貪婪",
      stability: "安全感"
    };
    return names[attribute];
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

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">{character.totalTransactions}</div>
              <div className="text-sm text-slate-400">總交易數</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">
                {character.activeYearsDetailed?.displayText || character.activeYears}
              </div>
              <div className="text-sm text-slate-400">活躍年數</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">{character.chainsUsed.length}</div>
              <div className="text-sm text-slate-400">使用鏈數</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">{character.analysis.nftCount}</div>
              <div className="text-sm text-slate-400">NFT 收藏</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid - Left/Right Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Attributes */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">角色屬性</h2>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(character.attributes).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getAttributeEmoji(key as keyof CharacterAttributes)}</span>
                      <span className="font-medium">{getAttributeName(key as keyof CharacterAttributes)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">{value}/5</span>
                      <span className="text-lg">{getAttributeStars(value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chains Used */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">探索的區塊鏈世界</h2>
              <div className="flex flex-wrap gap-2">
                {character.chainsUsed.map((chain) => (
                  <Badge key={chain} variant="outline" className="capitalize text-sm py-1 px-3">
                    {chain}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Contract Interactions */}
          {character.analysis.contractInteractions.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">協議互動統計</h2>
                <div className="grid grid-cols-2 gap-3">
                  {character.analysis.contractInteractions.map((interaction) => (
                    <div key={interaction.protocol} className="bg-slate-50 rounded-lg p-4 text-center">
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
              </CardContent>
            </Card>
          )}
        </div>
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