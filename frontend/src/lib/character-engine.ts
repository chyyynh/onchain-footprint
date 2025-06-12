// RPG Character Engine - Transform onchain footprint to RPG character
import type { Transaction } from '@/types/supabase';

// Character Attributes (from PM doc)
export interface CharacterAttributes {
  wisdom: number;      // 🧠 DeFi interactions, asset management
  adventure: number;   // 🧭 Multi-chain exploration, new protocols  
  aesthetic: number;   // 🎨 NFT participation, ENS, art protocols
  social: number;      // 👥 DAO participation, POAP, social protocols
  greed: number;       // 🪙 Airdrop hunting, frequent trading
  stability: number;   // 🔒 Long-term holding, mainstream protocols
}

// Character Classes (from PM doc)
export type CharacterClass = 
  | "NFT收藏家" // NFT Collector
  | "DeFi鍊金術師" // DeFi Alchemist  
  | "空投獵人" // Airdrop Hunter
  | "協議議員" // Protocol Diplomat
  | "鏈境旅人" // Chain Wanderer
  | "名號使者" // Identity Seeker
  | "新手旅人" // Newcomer
  | "鍊間使者"; // Interchain Nomad

// Character Rank (from PM doc)
export type CharacterRank = "S" | "A" | "B" | "C" | "D";

export interface RPGCharacter {
  address: string;
  class: CharacterClass;
  rank: CharacterRank;
  attributes: CharacterAttributes;
  description: string;
  totalTransactions: number;
  activeYears: number;
  chainsUsed: string[];
  analysis: {
    nftCount: number;
    defiProtocols: string[];
    airdrops: string[];
    daoVotes: number;
    uniqueContracts: number;
  };
}

// Contract address mappings for analysis
const KNOWN_CONTRACTS = {
  // DeFi Protocols
  UNISWAP_V2: ["0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f"],
  UNISWAP_V3: ["0x1f98431c8ad98523631ae4a59f267346ea31f984"],
  AAVE: ["0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9"],
  COMPOUND: ["0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b"],
  CURVE: ["0x79a8c46dea5ada233abaffd40f3a0a2b1e5a4f27"],
  LIDO: ["0xae7ab96520de3a18e5e111b5eaab095312d7fe84"],
  
  // NFT Marketplaces
  OPENSEA: ["0x7be8076f4ea4a4ad08075c2508e481d6c946d12b", "0x7f268357a8c2552623316e2562d90e642bb538e5"],
  ZORA: ["0xabefbc9fd2f806065b4f3c237d4b59d9a97bcac7"],
  
  // Layer 2 & Bridges
  ARBITRUM: ["0x72ce9c846789fdb6fc1f34ac4ad25dd9ef7031ef"],
  OPTIMISM: ["0x25ace71c97b33cc4729cf772ae268934f7ab5fa1"],
  POLYGON: ["0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf"],
  
  // ENS
  ENS: ["0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"],
};

// Analyze transactions to determine character attributes
export function analyzeCharacterAttributes(transactions: Transaction[]): CharacterAttributes {
  const attributes: CharacterAttributes = {
    wisdom: 0,
    adventure: 0, 
    aesthetic: 0,
    social: 0,
    greed: 0,
    stability: 0
  };

  // Get unique chains and contracts
  const chainsUsed = new Set(transactions.map(tx => tx.chain));
  const contractsInteracted = new Set(
    transactions
      .filter(tx => tx.to_address && tx.input_data !== "0x")
      .map(tx => tx.to_address!.toLowerCase())
  );

  // Calculate transaction frequency (greed indicator)
  const dailyTransactions = calculateDailyTransactionFrequency(transactions);
  const hasHighFrequency = dailyTransactions > 5; // More than 5 tx/day average

  // Wisdom: DeFi protocol usage
  const defiProtocols = findDeFiProtocols(transactions);
  if (defiProtocols.length > 3) attributes.wisdom += 2;
  if (defiProtocols.length > 7) attributes.wisdom += 2;
  if (contractsInteracted.size > 50) attributes.wisdom += 1;

  // Adventure: Multi-chain exploration
  if (chainsUsed.size > 1) attributes.adventure += 2;
  if (chainsUsed.size > 3) attributes.adventure += 2;
  if (chainsUsed.size > 5) attributes.adventure += 1;
  
  // Look for bridge usage (adventure indicator)
  const bridgeTransactions = transactions.filter(tx => 
    tx.input_data && tx.input_data.includes("bridge")
  );
  if (bridgeTransactions.length > 5) attributes.adventure += 1;

  // Aesthetic: NFT interactions
  const nftTransactions = findNFTTransactions(transactions);
  if (nftTransactions > 5) attributes.aesthetic += 2;
  if (nftTransactions > 20) attributes.aesthetic += 2;
  if (nftTransactions > 50) attributes.aesthetic += 1;

  // Check for ENS interactions
  const ensTransactions = transactions.filter(tx =>
    KNOWN_CONTRACTS.ENS.includes(tx.to_address?.toLowerCase() || "")
  );
  if (ensTransactions.length > 0) attributes.aesthetic += 2;

  // Social: DAO and governance (harder to detect from basic transactions)
  // Look for snapshot.org interactions or governance tokens
  const governanceKeywords = ["vote", "govern", "snapshot", "dao"];
  const governanceTransactions = transactions.filter(tx =>
    governanceKeywords.some(keyword => 
      tx.input_data?.toLowerCase().includes(keyword)
    )
  );
  if (governanceTransactions.length > 0) attributes.social += 2;
  if (governanceTransactions.length > 10) attributes.social += 2;

  // Greed: High frequency trading, airdrop farming patterns
  if (hasHighFrequency) attributes.greed += 2;
  
  // Look for airdrop claim patterns (many small value transactions)
  const smallValueTx = transactions.filter(tx => 
    parseInt(tx.value) === 0 && tx.success
  ).length;
  if (smallValueTx > transactions.length * 0.6) attributes.greed += 2; // >60% zero-value tx
  
  // Frequent contract interactions (could indicate farming)
  if (contractsInteracted.size > 100) attributes.greed += 1;

  // Stability: Long-term patterns, mainstream protocol usage
  const transactionSpan = getTransactionTimeSpan(transactions);
  if (transactionSpan > 365) attributes.stability += 2; // >1 year active
  if (transactionSpan > 730) attributes.stability += 2; // >2 years active
  
  // Low frequency indicates stability
  if (dailyTransactions < 1) attributes.stability += 2;
  
  // Usage of mainstream protocols indicates stability
  const mainstreamProtocols = ["uniswap", "aave", "compound"].filter(protocol =>
    defiProtocols.some(p => p.toLowerCase().includes(protocol))
  );
  if (mainstreamProtocols.length > 0) attributes.stability += 1;

  // Cap all attributes at 5
  Object.keys(attributes).forEach(key => {
    attributes[key as keyof CharacterAttributes] = Math.min(
      attributes[key as keyof CharacterAttributes], 
      5
    );
  });

  return attributes;
}

// Determine character class based on behavior patterns
export function determineCharacterClass(
  transactions: Transaction[], 
  attributes: CharacterAttributes
): CharacterClass {
  const nftCount = findNFTTransactions(transactions);
  const defiProtocols = findDeFiProtocols(transactions);
  const chainsUsed = new Set(transactions.map(tx => tx.chain));
  const contractsUsed = new Set(transactions.map(tx => tx.to_address)).size;

  // NFT Collector: High aesthetic, many NFT transactions
  if (attributes.aesthetic >= 4 && nftCount > 20) {
    return "NFT收藏家";
  }

  // DeFi Alchemist: High wisdom, many DeFi protocols
  if (attributes.wisdom >= 4 && defiProtocols.length > 5) {
    return "DeFi鍊金術師";
  }

  // Airdrop Hunter: High greed, many zero-value transactions
  if (attributes.greed >= 4) {
    return "空投獵人";
  }

  // Protocol Diplomat: High social score
  if (attributes.social >= 3) {
    return "協議議員";
  }

  // Chain Wanderer: High adventure, multi-chain
  if (attributes.adventure >= 4 && chainsUsed.size > 3) {
    return "鏈境旅人";
  }

  // Identity Seeker: ENS interactions + aesthetic
  const hasENS = transactions.some(tx =>
    KNOWN_CONTRACTS.ENS.includes(tx.to_address?.toLowerCase() || "")
  );
  if (hasENS && attributes.aesthetic >= 2) {
    return "名號使者";
  }

  // Interchain Nomad: Multi-chain with medium adventure
  if (chainsUsed.size > 2 && attributes.adventure >= 2) {
    return "鍊間使者";
  }

  // Default: Newcomer
  return "新手旅人";
}

// Calculate character rank based on experience and rarity
export function calculateCharacterRank(transactions: Transaction[]): CharacterRank {
  let score = 0;
  
  // Total transactions > 500
  if (transactions.length > 500) score += 1;
  
  // Active years > 2
  const timeSpan = getTransactionTimeSpan(transactions);
  if (timeSpan > 730) score += 1; // 2 years
  
  // Multi-chain usage
  const chainsUsed = new Set(transactions.map(tx => tx.chain));
  if (chainsUsed.size > 5) score += 2;
  
  // Unique contracts (complexity indicator)
  const uniqueContracts = new Set(
    transactions.filter(tx => tx.to_address).map(tx => tx.to_address!)
  );
  if (uniqueContracts.size > 100) score += 1;
  
  // NFT activity
  const nftCount = findNFTTransactions(transactions);
  if (nftCount > 10) score += 1;
  
  // DeFi protocols
  const defiCount = findDeFiProtocols(transactions).length;
  if (defiCount > 5) score += 1;

  // Convert score to rank
  if (score >= 8) return "S";
  if (score >= 6) return "A"; 
  if (score >= 4) return "B";
  if (score >= 2) return "C";
  return "D";
}

// Helper functions
function calculateDailyTransactionFrequency(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;
  
  const timeSpan = getTransactionTimeSpan(transactions);
  const days = Math.max(timeSpan / (24 * 60 * 60 * 1000), 1);
  
  return transactions.length / days;
}

function getTransactionTimeSpan(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;
  
  const times = transactions.map(tx => new Date(tx.block_time).getTime());
  const earliest = Math.min(...times);
  const latest = Math.max(...times);
  
  return latest - earliest; // milliseconds
}

function findNFTTransactions(transactions: Transaction[]): number {
  // Look for ERC721/ERC1155 transfer signatures and known NFT contracts
  return transactions.filter(tx => {
    const data = tx.input_data?.toLowerCase() || "";
    return (
      data.includes("0xa22cb465") || // setApprovalForAll
      data.includes("0x23b872dd") || // transferFrom
      data.includes("0x42842e0e") || // safeTransferFrom
      KNOWN_CONTRACTS.OPENSEA.includes(tx.to_address?.toLowerCase() || "") ||
      KNOWN_CONTRACTS.ZORA.includes(tx.to_address?.toLowerCase() || "")
    );
  }).length;
}

function findDeFiProtocols(transactions: Transaction[]): string[] {
  const protocols = new Set<string>();
  
  transactions.forEach(tx => {
    const address = tx.to_address?.toLowerCase() || "";
    
    if (KNOWN_CONTRACTS.UNISWAP_V2.includes(address) || 
        KNOWN_CONTRACTS.UNISWAP_V3.includes(address)) {
      protocols.add("Uniswap");
    }
    if (KNOWN_CONTRACTS.AAVE.includes(address)) {
      protocols.add("Aave");
    }
    if (KNOWN_CONTRACTS.COMPOUND.includes(address)) {
      protocols.add("Compound");
    }
    if (KNOWN_CONTRACTS.CURVE.includes(address)) {
      protocols.add("Curve");
    }
    if (KNOWN_CONTRACTS.LIDO.includes(address)) {
      protocols.add("Lido");
    }
  });
  
  return Array.from(protocols);
}

// Main function to generate complete RPG character
export function generateRPGCharacter(
  address: string,
  transactions: Transaction[]
): Omit<RPGCharacter, 'description'> {
  const attributes = analyzeCharacterAttributes(transactions);
  const characterClass = determineCharacterClass(transactions, attributes);
  const rank = calculateCharacterRank(transactions);
  
  const chainsUsed = Array.from(new Set(transactions.map(tx => tx.chain)));
  const nftCount = findNFTTransactions(transactions);
  const defiProtocols = findDeFiProtocols(transactions);
  const activeYears = getTransactionTimeSpan(transactions) / (365 * 24 * 60 * 60 * 1000);
  
  return {
    address,
    class: characterClass,
    rank,
    attributes,
    totalTransactions: transactions.length,
    activeYears: Math.round(activeYears * 10) / 10,
    chainsUsed,
    analysis: {
      nftCount,
      defiProtocols,
      airdrops: [], // TODO: Implement airdrop detection
      daoVotes: 0, // TODO: Implement DAO vote detection  
      uniqueContracts: new Set(
        transactions.filter(tx => tx.to_address).map(tx => tx.to_address!)
      ).size
    }
  };
}