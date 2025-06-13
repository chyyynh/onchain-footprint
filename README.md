# onchain-footprint

# 👻 Ghost Genesis

> Forge Your Onchain Soul - Generate unique RPG characters from blockchain footprints

In the onchain mist, everyone leaves shadows. These shadows form your Ghost.

## 🎯 Project Overview

Ghost Genesis transforms your onchain activities into unique RPG characters. By analyzing wallet transaction history, NFT interactions, DeFi usage, and other behaviors, it automatically generates personalized character classes, attributes, rarity levels, and backstories.

## ✨ Core Features

- 📊 **Transaction Analysis**: Deep analysis of onchain behavior patterns
- 🎮 **Character Generation**: Generate RPG characters based on behavior
- 📈 **Attribute Radar**: 6-dimensional analysis (Wisdom, Adventure, Aesthetic, Social, Greed, Stability)
- 🏆 **Rarity System**: S/A/B/C/D five-tier rarity classification
- 🌐 **Multi-chain Support**: Support for 9+ blockchains

## 🎭 Character Classes

| Class                | Description                       | Criteria                               |
| -------------------- | --------------------------------- | -------------------------------------- |
| 🎨 NFT Collector     | Art connoisseur with unique taste | High Aesthetic + Many NFT transactions |
| ⚗️ DeFi Alchemist    | Master of various protocols       | High Wisdom + Many DeFi interactions   |
| 🏹 Airdrop Hunter    | Opportunity-savvy hunter          | High Greed + Frequent trading          |
| 🏛️ Protocol Diplomat | Governance contributor            | High Social + DAO participation        |
| 🗺️ Chain Wanderer    | Cross-chain explorer              | High Adventure + Multi-chain activity  |

## 🚀 Quick Start

### Install Dependencies

```bash
pnpm install
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Set required API keys
DUNE_API_KEY=your_dune_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to get started.

## 🏗️ Technical Architecture

```
[Web3 Tracker] ──┬──▶ [Character Engine]
                  │
                  └──▶ [Frontend UI] ──▶ [Profile Page]
                                    └──▶ [Share / OG Image]

[Frontend UI] ──▶ [Supabase Auth + DB] ◀── [Character Engine]
```

### Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Web3**: wagmi, viem, RainbowKit
- **Database**: Supabase (PostgreSQL)
- **Data Sources**: Dune Analytics, Alchemy
- **UI Components**: Radix UI, Lucide React

## 📖 Main Pages

- **🏠 Home** (`/`): Project introduction and quick start
- **📊 Activity** (`/activity`): Transaction history viewing and analysis
- **🎮 Character** (`/character`): RPG character generation and display

## 🔧 API Endpoints

### Character Generation

```bash
GET /api/character?wallet=0x...
```

### Wallet Sync

```bash
POST /api/sync-wallet
{
  "wallet": "0x...",
  "label": "My Wallet"
}
```

### Transaction Query

```bash
GET /api/simtxs?wallet=0x...&limit=20&offset=0
```

## 🎯 Development Roadmap

- [x] **Stage 1**: Wallet connection and basic data extraction
- [x] **Stage 2**: Character generation engine and UI display
- [ ] **Stage 3**: AI backstory generation
- [ ] **Stage 4**: Social sharing features
- [ ] **Stage 5**: Achievement system and community interaction

---

🔮 **Discover your true self in the mist** - Ghost Genesis
