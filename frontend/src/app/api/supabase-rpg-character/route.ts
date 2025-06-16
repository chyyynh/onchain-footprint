// API endpoint to generate RPG character from wallet transactions
import { NextRequest, NextResponse } from "next/server";
import { getTransactions } from "@/lib/supabase-helpers";
import { generateRPGCharacter } from "@/lib/character-engine";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  
  if (!wallet) {
    return NextResponse.json(
      { error: "Missing wallet address" },
      { status: 400 }
    );
  }

  try {
    // Get all transactions for the wallet from database in batches
    const allTransactions: any[] = [];
    let offset = 0;
    const batchSize = 1000;
    let hasMore = true;
    
    while (hasMore) {
      const batch = await getTransactions({
        wallet_address: wallet.toLowerCase(),
        limit: batchSize,
        offset: offset
      });
      
      if (batch.length === 0) {
        hasMore = false;
      } else {
        allTransactions.push(...batch);
        offset += batchSize;
        
        // Safety check to prevent infinite loops
        if (allTransactions.length > 50000 || batch.length < batchSize) {
          hasMore = false;
        }
      }
    }
    
    console.log(`🔄 Fetched ${allTransactions.length} total transactions in batches`);
    const transactions = allTransactions;

    if (transactions.length === 0) {
      return NextResponse.json({
        error: "No transactions found",
        message: "Please sync wallet transactions first using /api/supabase-wallet-sync"
      }, { status: 404 });
    }

    // Generate RPG character based on transaction analysis
    const character = generateRPGCharacter(wallet, transactions);

    // Generate AI description (placeholder for now)
    const description = generateCharacterDescription(character);

    return NextResponse.json({
      ...character,
      description,
      generated_at: new Date().toISOString(),
      data_source: "supabase_analysis"
    });

  } catch (error) {
    console.error('Character generation error:', error);
    return NextResponse.json(
      { 
        error: "Character generation failed", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

// Generate character description based on class and attributes
function generateCharacterDescription(character: any): string {
  const { class: characterClass, rank, attributes, analysis } = character;
  
  const descriptions = {
    "NFT收藏家": `你是一位藝術品味獨特的收藏家，在鏈上世界中尋找珍貴的數位藝術。你已收藏了 ${analysis.nftCount} 件 NFT，對美的追求讓你在虛擬畫廊中留下了深深的足跡。`,
    
    "DeFi鍊金術師": `你精通各種 DeFi 協議的奧秘，能夠巧妙地操控流動性與收益。你已掌握了 ${analysis.defiProtocols.length} 種不同的協議，在去中心化金融的世界裡如魚得水。`,
    
    "空投獵人": `你是鏈上機會的敏銳獵手，總能在第一時間發現新的空投機會。你的貪婪指數高達 ${attributes.greed}/5，在各個協議間穿梭尋找著下一個財富密碼。`,
    
    "協議議員": `你積極參與鏈上治理，為去中心化世界的發展貢獻智慧。你的社交能力 ${attributes.social}/5 展現了你在社群中的影響力。`,
    
    "鏈境旅人": `你是跨鏈世界的探險家，足跡遍佈 ${character.chainsUsed.length} 條不同的區塊鏈。你的冒險精神 ${attributes.adventure}/5 驅使你不斷探索新的數位疆域。`,
    
    "名號使者": `你重視自己在鏈上的身份象徵，擁有 ENS 域名等身份標識。你的美感 ${attributes.aesthetic}/5 體現在對個人品牌的精心打造上。`,
    
    "新手旅人": `你剛踏入鏈上世界不久，正在學習和探索各種可能性。雖然經驗尚淺，但每一次交易都是成長的足跡。`,
    
    "鍊間使者": `你熟練地在不同區塊鏈間穿梭，是真正的多鏈玩家。你在 ${character.chainsUsed.length} 條鏈上都留下了活動痕跡，是鏈間橋樑的常客。`
  };

  const baseDescription = descriptions[characterClass as keyof typeof descriptions] || descriptions["新手旅人"];
  
  const rankDescriptions = {
    "S": "你是傳奇級的鏈上大神，經驗豐富且技能全面。",
    "A": "你是鏈上世界的高手，對各種協議都有深入理解。", 
    "B": "你是經驗豐富的鏈上玩家，已掌握多種技能。",
    "C": "你正在鏈上世界中穩步成長，逐漸找到自己的道路。",
    "D": "你是鏈上世界的新手，還有很大的探索空間。"
  };

  return `${baseDescription}\n\n${rankDescriptions[rank as keyof typeof rankDescriptions]} 你在鏈上已活躍了 ${character.activeYears} 年，完成了 ${character.totalTransactions} 筆交易，與 ${analysis.uniqueContracts} 個不同的合約進行過互動。`;
}