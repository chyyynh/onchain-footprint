// RPG Character Engine - Transform onchain footprint to RPG character
import type { Transaction } from "@/types/supabase";

// Character Attributes (from PM doc)
export interface CharacterAttributes {
  wisdom: number; // 🧠 DeFi interactions, asset management
  adventure: number; // 🧭 Multi-chain exploration, new protocols
  aesthetic: number; // 🎨 NFT participation, ENS, art protocols
  social: number; // 👥 DAO participation, POAP, social protocols
  greed: number; // 🪙 Airdrop hunting, frequent trading
  stability: number; // 🔒 Long-term holding, mainstream protocols
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

// Mainnet chains only (exclude testnets)
const MAINNET_CHAINS = [
  "ethereum",
  "polygon",
  "arbitrum",
  "optimism",
  "base",
  "bnb", // Binance Smart Chain
  "avalanche_c", // Avalanche C-Chain
  "fantom",
  "gnosis",
  "blast",
  "mode",
  "zksync",
  "linea",
  "scroll",
  "zkevm", // Polygon zkEVM
  "redstone",
  "sonic",
  "abstract",
  "zora",
  "mantle",
];

// Chain display name mapping
const CHAIN_DISPLAY_NAMES: { [key: string]: string } = {
  "avalanche_c": "Avalanche",
  "bnb": "BSC",
  "zkevm": "Polygon zkEVM"
};

// Filter function to exclude testnet transactions
function filterMainnetTransactions(transactions: Transaction[]): Transaction[] {
  return transactions.filter((tx) =>
    MAINNET_CHAINS.includes(tx.chain.toLowerCase())
  );
}

// Format chain names for display
function formatChainName(chain: string): string {
  return CHAIN_DISPLAY_NAMES[chain.toLowerCase()] || chain;
}

export interface ContractInteraction {
  protocol: string;
  count: number;
  addresses: string[];
}

export interface RPGCharacter {
  address: string;
  class: CharacterClass;
  rank: CharacterRank;
  attributes: CharacterAttributes;
  description: string;
  totalTransactions: number;
  activeYears: number;
  activeYearsDetailed: {
    years: number;
    days: number;
    displayText: string;
  };
  chainsUsed: string[];
  transactionActivity: Array<{
    block_time: string;
    chain: string;
  }>;
  analysis: {
    nftCount: number;
    defiProtocols: string[];
    airdrops: string[];
    daoVotes: number;
    uniqueContracts: number;
    contractInteractions: ContractInteraction[];
  };
}

// Contract address mappings for analysis
const KNOWN_CONTRACTS = {
  // Uniswap (Multi-chain)
  UNISWAP: [
    "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f", // V2 Factory Ethereum
    "0x1f98431c8ad98523631ae4a59f267346ea31f984", // V3 Factory Ethereum
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d", // V2 Router Ethereum
    "0xe592427a0aece92de3edee1f18e0157c05861564", // V3 Router Ethereum
    "0x33128a8fc17869897dce68ed026d694621f6fdfd", // V3 Factory Base
    "0x2626664c2603336e57b271c5c0b26f421741e481", // V3 Router Base
    "0x27a16dc786820b16e5c9028b75b99f6f604b5d26", // Base Router
  ],

  // Aave
  AAVE: [
    "0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9", // V2 Ethereum
    "0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2", // V3 Ethereum
    "0xa238dd80c259a72e81d7e4664a9801593f98d1c5", // V3 Base
  ],

  // Compound
  COMPOUND: [
    "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b", // Ethereum
    "0xa17581a9e3356d9a858b789d68b4d866e593ae94", // V3 Ethereum
  ],

  // Curve
  CURVE: [
    "0x79a8c46dea5ada233abaffd40f3a0a2b1e5a4f27", // Registry Ethereum
    "0x90e00ace148ca3b23ac1bc8c240c2a7dd9c2d7f5", // Factory Ethereum
  ],

  // Lido
  LIDO: [
    "0xae7ab96520de3a18e5e111b5eaab095312d7fe84", // stETH Ethereum
    "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0", // wstETH Ethereum
  ],

  // NFT Marketplaces
  OPENSEA: [
    "0x7be8076f4ea4a4ad08075c2508e481d6c946d12b", // Ethereum
    "0x7f268357a8c2552623316e2562d90e642bb538e5", // Ethereum
    "0x00000000000001ad428e4906ae43d8f9852d0dd6", // Seaport Ethereum
  ],

  ZORA: [
    "0xabefbc9fd2f806065b4f3c237d4b59d9a97bcac7", // Ethereum
  ],

  // Layer 2 Bridges & Gateways
  LAYERZERO: [
    "0x5634c4a5fed09819e3c46d86a965dd9447d86e47", // Base (seen in transactions)
    "0x1a44076050125825900e736c501f859c50fe728c", // Base (seen in transactions)
  ],

  ARBITRUM_BRIDGE: [
    "0x72ce9c846789fdb6fc1f34ac4ad25dd9ef7031ef", // Ethereum
    "0x8315177ab297ba92a06054ce80a67ed4dbd7ed3a", // Ethereum
  ],

  OPTIMISM_BRIDGE: [
    "0x25ace71c97b33cc4729cf772ae268934f7ab5fa1", // Ethereum
    "0x99c9fc46f92e8a1c0dec1b1747d010903e884be1", // Ethereum
  ],

  BASE_BRIDGE: [
    "0x49048044d57e1c92a77f79988d21fa8faf74e97e", // Ethereum
    "0x3154cf16ccdb4c6d922629664174b904d80f2c35", // Ethereum
  ],

  POLYGON_BRIDGE: [
    "0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf", // Ethereum
    "0xa0c68c638235ee32657e8f720a23cec1bfc77c77", // Ethereum
  ],

  // ENS
  ENS: [
    "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85", // Ethereum
    "0x314159265dd8dbb310642f98f50c066173c1259b", // Ethereum
  ],

  // Common ERC20 tokens (USDC, USDT, etc.)
  STABLECOINS: [
    "0xa0b86a33e6ee6481c1e7c4c5c4ecb0a4c9e22ad0", // USDC Base
    "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC Base (seen in transactions)
    "0xa0b2ee912caf7921eaabc866c6ef1520c6a6008c", // USDT Base
  ],
};

// Analyze transactions to determine character attributes
export function analyzeCharacterAttributes(
  transactions: Transaction[]
): CharacterAttributes {
  const attributes: CharacterAttributes = {
    wisdom: 0,
    adventure: 0,
    aesthetic: 0,
    social: 0,
    greed: 0,
    stability: 0,
  };

  // Get unique chains and contracts
  const chainsUsed = new Set(transactions.map((tx) => tx.chain));
  const contractsInteracted = new Set(
    transactions
      .filter((tx) => tx.to_address && tx.input_data !== "0x")
      .map((tx) => tx.to_address!.toLowerCase())
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
  const bridgeTransactions = transactions.filter(
    (tx) => tx.input_data && tx.input_data.includes("bridge")
  );
  if (bridgeTransactions.length > 5) attributes.adventure += 1;

  // Aesthetic: NFT interactions
  const nftTransactions = findNFTTransactions(transactions);
  if (nftTransactions > 5) attributes.aesthetic += 2;
  if (nftTransactions > 20) attributes.aesthetic += 2;
  if (nftTransactions > 50) attributes.aesthetic += 1;

  // Check for ENS interactions
  const ensTransactions = transactions.filter((tx) =>
    KNOWN_CONTRACTS.ENS.includes(tx.to_address?.toLowerCase() || "")
  );
  if (ensTransactions.length > 0) attributes.aesthetic += 2;

  // Social: DAO and governance (harder to detect from basic transactions)
  // Look for snapshot.org interactions or governance tokens
  const governanceKeywords = ["vote", "govern", "snapshot", "dao"];
  const governanceTransactions = transactions.filter((tx) =>
    governanceKeywords.some((keyword) =>
      tx.input_data?.toLowerCase().includes(keyword)
    )
  );
  if (governanceTransactions.length > 0) attributes.social += 2;
  if (governanceTransactions.length > 10) attributes.social += 2;

  // Greed: High frequency trading, airdrop farming patterns
  if (hasHighFrequency) attributes.greed += 2;

  // Look for airdrop claim patterns (many small value transactions)
  const smallValueTx = transactions.filter(
    (tx) => parseInt(tx.value) === 0 && tx.success
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
  const mainstreamProtocols = ["uniswap", "aave", "compound"].filter(
    (protocol) => defiProtocols.some((p) => p.toLowerCase().includes(protocol))
  );
  if (mainstreamProtocols.length > 0) attributes.stability += 1;

  // Cap all attributes at 5
  Object.keys(attributes).forEach((key) => {
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
  const chainsUsed = new Set(transactions.map((tx) => tx.chain));
  const contractsUsed = new Set(transactions.map((tx) => tx.to_address)).size;

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
  const hasENS = transactions.some((tx) =>
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
export function calculateCharacterRank(
  transactions: Transaction[]
): CharacterRank {
  let score = 0;

  // Total transactions > 500
  if (transactions.length > 500) score += 1;

  // Active years > 2
  const timeSpan = getTransactionTimeSpan(transactions);
  if (timeSpan > 730) score += 1; // 2 years

  // Multi-chain usage
  const chainsUsed = new Set(transactions.map((tx) => tx.chain));
  if (chainsUsed.size > 5) score += 2;

  // Unique contracts (complexity indicator)
  const uniqueContracts = new Set(
    transactions.filter((tx) => tx.to_address).map((tx) => tx.to_address!)
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
function calculateDailyTransactionFrequency(
  transactions: Transaction[]
): number {
  if (transactions.length === 0) return 0;

  const timeSpan = getTransactionTimeSpan(transactions);
  const days = Math.max(timeSpan / (24 * 60 * 60 * 1000), 1);

  return transactions.length / days;
}

function getTransactionTimeSpan(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;

  const times = transactions.map((tx) => new Date(tx.block_time).getTime());
  const earliest = Math.min(...times);
  const latest = Math.max(...times);

  return latest - earliest; // milliseconds
}

function calculateActiveYears(transactions: Transaction[]): {
  years: number;
  days: number;
  totalYears: number;
} {
  if (transactions.length === 0) return { years: 0, days: 0, totalYears: 0 };

  const times = transactions.map((tx) => new Date(tx.block_time).getTime());
  const earliest = Math.min(...times);
  const latest = Math.max(...times);

  const timeSpanMs = latest - earliest;
  const timeSpanDays = Math.floor(timeSpanMs / (24 * 60 * 60 * 1000));

  const years = Math.floor(timeSpanDays / 365);
  const remainingDays = timeSpanDays % 365;
  const totalYears = Math.round((timeSpanDays / 365) * 10) / 10;

  // Debug logging
  const earliestDate = new Date(earliest).toLocaleDateString();
  const latestDate = new Date(latest).toLocaleDateString();
  console.log(`📅 Transaction date range: ${earliestDate} to ${latestDate}`);
  console.log(
    `⏱️  Total days: ${timeSpanDays}, Years: ${years}, Remaining days: ${remainingDays}`
  );

  return {
    years,
    days: remainingDays,
    totalYears,
  };
}

function findNFTTransactions(transactions: Transaction[]): number {
  // Look for ERC721/ERC1155 transfer signatures and known NFT contracts
  return transactions.filter((tx) => {
    const data = tx.input_data?.toLowerCase() || "";
    const toAddress = tx.to_address?.toLowerCase() || "";

    // ERC721/ERC1155 function signatures
    const hasNFTSignature =
      data.includes("0xa22cb465") || // setApprovalForAll
      data.includes("0x23b872dd") || // transferFrom
      data.includes("0x42842e0e") || // safeTransferFrom(address,address,uint256)
      data.includes("0xb88d4fde") || // safeTransferFrom(address,address,uint256,bytes)
      data.includes("0xf242432a") || // safeTransferFrom (ERC1155)
      data.includes("0x2eb2c2d6") || // safeBatchTransferFrom (ERC1155)
      data.includes("0x1fad948c") || // approve (ERC721)
      data.includes("0xa9059cbb") || // transfer (could be NFT)
      data.includes("0x40c10f19") || // mint
      data.includes("0x6352211e"); // ownerOf

    // Known NFT marketplaces and platforms
    const isNFTMarketplace =
      KNOWN_CONTRACTS.OPENSEA.includes(toAddress) ||
      KNOWN_CONTRACTS.ZORA.includes(toAddress) ||
      toAddress === "0x59728544b08ab483533076417fbbb2fd0b17ce3a" || // LooksRare
      toAddress === "0x74312363e45dcaba76c59ec49a7aa8a65a67eed3" || // X2Y2
      toAddress === "0x0000000000e655fae4d56241588680f86e3b2377" || // Foundation
      toAddress === "0x2953399124f0cbb46d2cbacd8a89cf0599974963" || // SuperRare
      toAddress === "0x495f947276749ce646f68ac8c248420045cb7b5e" || // OpenSea Shared Storefront
      toAddress === "0xc2edad668740f1aa35e4d8f227fb8e17dca888cd" || // KnownOrigin
      toAddress === "0x60e4d786628fea6478f785a6d7e704777c86a7c6" || // AsyncArt
      toAddress === "0xa5409ec958c83c3f309868babaca7c86dcb077c1"; // Rarible

    // Common NFT collection patterns (many NFT contracts start with specific patterns)
    const hasNFTPattern =
      data.includes("tokenuri") ||
      data.includes("metadata") ||
      data.includes("tokenid") ||
      data.includes("721") ||
      data.includes("1155");

    return hasNFTSignature || isNFTMarketplace || hasNFTPattern;
  }).length;
}

function findDeFiProtocols(transactions: Transaction[]): string[] {
  const protocols = new Set<string>();

  transactions.forEach((tx) => {
    const address = tx.to_address?.toLowerCase() || "";

    if (KNOWN_CONTRACTS.UNISWAP.includes(address)) {
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

function analyzeContractInteractions(
  transactions: Transaction[]
): ContractInteraction[] {
  const interactions: ContractInteraction[] = [];

  // Count interactions with each known protocol
  const protocolCounts = new Map<
    string,
    { count: number; addresses: Set<string> }
  >();

  transactions.forEach((tx) => {
    const address = tx.to_address?.toLowerCase() || "";

    // Check each protocol
    if (KNOWN_CONTRACTS.UNISWAP.includes(address)) {
      const current = protocolCounts.get("Uniswap") || {
        count: 0,
        addresses: new Set(),
      };
      current.count++;
      current.addresses.add(address);
      protocolCounts.set("Uniswap", current);
    }

    if (KNOWN_CONTRACTS.AAVE.includes(address)) {
      const current = protocolCounts.get("Aave") || {
        count: 0,
        addresses: new Set(),
      };
      current.count++;
      current.addresses.add(address);
      protocolCounts.set("Aave", current);
    }

    if (KNOWN_CONTRACTS.COMPOUND.includes(address)) {
      const current = protocolCounts.get("Compound") || {
        count: 0,
        addresses: new Set(),
      };
      current.count++;
      current.addresses.add(address);
      protocolCounts.set("Compound", current);
    }

    if (KNOWN_CONTRACTS.CURVE.includes(address)) {
      const current = protocolCounts.get("Curve") || {
        count: 0,
        addresses: new Set(),
      };
      current.count++;
      current.addresses.add(address);
      protocolCounts.set("Curve", current);
    }

    if (KNOWN_CONTRACTS.LIDO.includes(address)) {
      const current = protocolCounts.get("Lido") || {
        count: 0,
        addresses: new Set(),
      };
      current.count++;
      current.addresses.add(address);
      protocolCounts.set("Lido", current);
    }

    if (KNOWN_CONTRACTS.OPENSEA.includes(address)) {
      const current = protocolCounts.get("OpenSea") || {
        count: 0,
        addresses: new Set(),
      };
      current.count++;
      current.addresses.add(address);
      protocolCounts.set("OpenSea", current);
    }

    if (KNOWN_CONTRACTS.ZORA.includes(address)) {
      const current = protocolCounts.get("Zora") || {
        count: 0,
        addresses: new Set(),
      };
      current.count++;
      current.addresses.add(address);
      protocolCounts.set("Zora", current);
    }

    if (KNOWN_CONTRACTS.LAYERZERO.includes(address)) {
      const current = protocolCounts.get("LayerZero Bridge") || {
        count: 0,
        addresses: new Set(),
      };
      current.count++;
      current.addresses.add(address);
      protocolCounts.set("LayerZero Bridge", current);
    }

    if (KNOWN_CONTRACTS.ARBITRUM_BRIDGE.includes(address)) {
      const current = protocolCounts.get("Arbitrum Bridge") || {
        count: 0,
        addresses: new Set(),
      };
      current.count++;
      current.addresses.add(address);
      protocolCounts.set("Arbitrum Bridge", current);
    }

    if (KNOWN_CONTRACTS.OPTIMISM_BRIDGE.includes(address)) {
      const current = protocolCounts.get("Optimism Bridge") || {
        count: 0,
        addresses: new Set(),
      };
      current.count++;
      current.addresses.add(address);
      protocolCounts.set("Optimism Bridge", current);
    }

    if (KNOWN_CONTRACTS.BASE_BRIDGE.includes(address)) {
      const current = protocolCounts.get("Base Bridge") || {
        count: 0,
        addresses: new Set(),
      };
      current.count++;
      current.addresses.add(address);
      protocolCounts.set("Base Bridge", current);
    }

    if (KNOWN_CONTRACTS.POLYGON_BRIDGE.includes(address)) {
      const current = protocolCounts.get("Polygon Bridge") || {
        count: 0,
        addresses: new Set(),
      };
      current.count++;
      current.addresses.add(address);
      protocolCounts.set("Polygon Bridge", current);
    }

    if (KNOWN_CONTRACTS.ENS.includes(address)) {
      const current = protocolCounts.get("ENS") || {
        count: 0,
        addresses: new Set(),
      };
      current.count++;
      current.addresses.add(address);
      protocolCounts.set("ENS", current);
    }

    if (KNOWN_CONTRACTS.STABLECOINS.includes(address)) {
      const current = protocolCounts.get("Stablecoins") || {
        count: 0,
        addresses: new Set(),
      };
      current.count++;
      current.addresses.add(address);
      protocolCounts.set("Stablecoins", current);
    }
  });

  // Convert to array and sort by count
  protocolCounts.forEach((data, protocol) => {
    interactions.push({
      protocol,
      count: data.count,
      addresses: Array.from(data.addresses),
    });
  });

  return interactions.sort((a, b) => b.count - a.count);
}

// Main function to generate complete RPG character
export function generateRPGCharacter(
  address: string,
  transactions: Transaction[]
): Omit<RPGCharacter, "description"> {
  // Filter out testnet transactions - only use mainnet activity
  const mainnetTransactions = filterMainnetTransactions(transactions);
  
  // Debug logging to help identify issues
  console.log(`🎮 Generating RPG Character for ${address}`);
  console.log(`📊 Total transactions received: ${transactions.length}`);
  console.log(`🌐 Mainnet transactions (filtered): ${mainnetTransactions.length}`);
  console.log(`🧪 Testnet transactions (excluded): ${transactions.length - mainnetTransactions.length}`);

  if (mainnetTransactions.length > 0) {
    const timeSpanMs = getTransactionTimeSpan(mainnetTransactions);
    const timeSpanDays = timeSpanMs / (24 * 60 * 60 * 1000);
    const chains = Array.from(new Set(mainnetTransactions.map((tx) => tx.chain)));

    console.log(
      `⏱️  Time span: ${Math.round(timeSpanDays)} days (${
        Math.round((timeSpanDays / 365) * 10) / 10
      } years)`
    );
    console.log(`🔗 Mainnet chains found: ${chains.length} - ${chains.join(", ")}`);
    console.log(
      `📅 Date range: ${new Date(
        Math.min(...mainnetTransactions.map((tx) => new Date(tx.block_time).getTime()))
      ).toLocaleDateString()} to ${new Date(
        Math.max(...mainnetTransactions.map((tx) => new Date(tx.block_time).getTime()))
      ).toLocaleDateString()}`
    );
    console.log(
      `🔍 ACTUAL TRANSACTION DATA SOURCE: Supabase database (mainnet only)`
    );
  }

  const attributes = analyzeCharacterAttributes(mainnetTransactions);
  const characterClass = determineCharacterClass(mainnetTransactions, attributes);
  const rank = calculateCharacterRank(mainnetTransactions);

  const chainsUsed = Array.from(new Set(mainnetTransactions.map((tx) => tx.chain)))
    .map(chain => formatChainName(chain));
  const nftCount = findNFTTransactions(mainnetTransactions);
  const defiProtocols = findDeFiProtocols(mainnetTransactions);
  const contractInteractions = analyzeContractInteractions(mainnetTransactions);
  const activeYearsData = calculateActiveYears(mainnetTransactions);

  console.log(`🎨 NFT transactions found: ${nftCount}`);
  console.log(
    `💰 DeFi protocols: ${defiProtocols.length} - ${defiProtocols.join(", ")}`
  );
  console.log(
    `📊 Active time: ${activeYearsData.years} years, ${activeYearsData.days} days`
  );

  return {
    address,
    class: characterClass,
    rank,
    attributes,
    totalTransactions: mainnetTransactions.length,
    activeYears: activeYearsData.totalYears,
    activeYearsDetailed: {
      years: activeYearsData.years,
      days: activeYearsData.days,
      displayText: `${activeYearsData.years} Years ${activeYearsData.days} Days`,
    },
    chainsUsed,
    transactionActivity: mainnetTransactions
      .filter(tx => {
        // Only include transactions from the last 365 days for the contribution graph
        const txDate = new Date(tx.block_time);
        const oneYearAgo = new Date();
        oneYearAgo.setDate(oneYearAgo.getDate() - 365);
        return txDate >= oneYearAgo;
      })
      .map(tx => ({
        block_time: tx.block_time,
        chain: tx.chain
      })),
    analysis: {
      nftCount,
      defiProtocols,
      airdrops: [], // TODO: Implement airdrop detection
      daoVotes: 0, // TODO: Implement DAO vote detection
      uniqueContracts: new Set(
        mainnetTransactions.filter((tx) => tx.to_address).map((tx) => tx.to_address!)
      ).size,
      contractInteractions,
    },
  };
}
