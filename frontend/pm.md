# 👻 Ghost Genesis Project Management

> 鏈上 Avatar: Ghost Genesis (ghost.fog.world)  
> 在這層鏈上的迷霧中，每個人都留下了殘影。這些殘影，組成了你的幽靈（Ghost）。  
> 歡迎來到 ghost.fog.world —— 鑄造你的鏈上靈魂。

## 🎯 專案概述 (Project Overview)

Ghost Genesis 是一個創新的 Web3 應用，將使用者的鏈上活動轉化為獨特的 RPG（角色扮演遊戲）角色。透過分析地址在區塊鏈上的足跡（如 NFT 交易、DeFi 互動、空投領取等），我們為每個使用者生成專屬的 RPG 角色、背景故事、職業、稀有度及屬性傾向。

**目標**: 提供遊戲化、視覺化的方式，讓使用者能更直觀、有趣地理解並分享自己的鏈上數位身份。

---

## 🏗️ 系統架構 (System Architecture)

```
[Web3 Tracker] ──┬──▶ [Character Engine] ──▶ [AI Story Generator]
                  │                           │
                  └──▶ [Frontend UI] ──────────┼──▶ [Profile Page]
                                              └──▶ [Share / OG Image]

[Frontend UI] ──▶ [Supabase Auth + DB] ◀── [Character Engine]
```

### 📦 核心模組 (Core Modules)

1. **🔗 Web3 Tracker**: 鏈上資料抓取與分析
2. **🎮 Character Engine**: 角色生成與屬性計算
3. **🎨 Frontend UI**: RPG 風格使用者介面
4. **💾 Auth + Database**: 帳號系統與資料儲存
5. **📤 Social Share**: 分享與成就系統
6. **🔧 DevOps**: CI/CD 與測試

---

## 🎮 角色系統設計 (Character System)

### 🎭 職業分類 (Character Classes)
| 職業 | 英文 | 特徵 | 判定條件 |
|------|------|------|----------|
| 🎨 NFT收藏家 | NFT Collector | 藝術品味獨特的收藏家 | 高美感 + 多NFT交易 |
| ⚗️ DeFi鍊金術師 | DeFi Alchemist | 精通各種協議的高手 | 高智慧 + 多DeFi互動 |
| 🏹 空投獵人 | Airdrop Hunter | 機會敏銳的獵手 | 高貪婪 + 頻繁交易 |
| 🏛️ 協議議員 | Protocol Diplomat | 參與治理的貢獻者 | 高社交 + DAO參與 |
| 🗺️ 鏈境旅人 | Chain Wanderer | 跨鏈世界的探險家 | 高冒險 + 多鏈活躍 |
| 👑 名號使者 | Identity Seeker | 重視鏈上身份的信仰者 | ENS + 高美感 |
| 🔄 鍊間使者 | Interchain Nomad | 鏈間橋樑的常客 | 多鏈 + 橋接交易 |
| 🌱 新手旅人 | Newcomer | 初入鏈上世界的萌新 | 低活躍度 |

### 📊 屬性系統 (Attribute System)
| 屬性 | Emoji | 英文 | 說明 | 計算依據 |
|------|-------|------|------|----------|
| 🧠 智慧 | Wisdom | 善用合約與 DeFi 工具 | DeFi協議數量、複雜交易 |
| 🧭 冒險 | Adventure | 探索新鏈、新協議 | 使用鏈數、早期交互 |
| 🎨 美感 | Aesthetic | 對 NFT、藝術的參與 | NFT收藏、ENS域名 |
| 👥 社交 | Social | 參與 DAO、社交協議 | 投票記錄、POAP數量 |
| 🪙 貪婪 | Greed | 空投狩獵、套利行為 | 空投領取、高頻交易 |
| 🔒 安全感 | Stability | 長期持有、主流協議 | 持有時間、協議選擇 |

### 🏆 稀有度系統 (Rarity System)
- **S級 (傳奇)**: 8+ 分，鏈上大神
- **A級 (高手)**: 6-7 分，經驗豐富
- **B級 (熟手)**: 4-5 分，掌握多技能
- **C級 (入門)**: 2-3 分，穩步成長
- **D級 (萌新)**: 0-1 分，新手階段

---

## 🛠️ 技術棧 (Technology Stack)

### Frontend
- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **動畫**: CSS Animations
- **圖示**: Lucide React

### Web3
- **錢包連接**: wagmi + RainbowKit
- **區塊鏈交互**: viem
- **數據源**: Dune Analytics, Alchemy

### Backend & Database
- **資料庫**: Supabase (PostgreSQL)
- **認證**: Supabase Auth
- **API**: Next.js API Routes

### DevOps
- **部署**: Vercel
- **版本控制**: Git + GitHub
- **包管理**: pnpm

---

## 🗺️ 開發路線圖 (Development Roadmap)

### ✅ 階段 1: MVP 基礎建設 (已完成)
**目標**: 建立核心功能基礎
- [x] Web3 錢包連接 (wagmi + RainbowKit)
- [x] 交易數據抓取 (Dune API)
- [x] 資料庫設計與建立 (Supabase)
- [x] 基礎 UI 框架 (Next.js + Tailwind)
- [x] 交易歷史展示頁面

**交付物**:
- 功能完整的交易查詢系統
- 多鏈交易數據同步
- 基礎的分頁載入功能

### 🔄 階段 2: 角色生成引擎 (進行中)
**目標**: 實現 RPG 角色生成核心邏輯
- [ ] 角色屬性分析演算法 (需要審查優化)
- [ ] 職業分類邏輯 (需要審查優化)
- [ ] 稀有度計算系統 (需要審查優化)
- [x] 角色卡片 UI 組件
- [ ] 屬性雷達圖展示 (目前僅有星級顯示)

**預計交付物**:
- 完整的角色生成 API (`/api/character`)
- 美觀的角色展示頁面
- 6維度屬性分析系統
- 真正的雷達圖視覺化

### 🔄 階段 3: AI 敘事系統 (進行中)
**目標**: 加入 AI 生成的角色背景故事
- [ ] OpenAI GPT 整合
- [ ] 角色故事模板系統
- [ ] 多語言故事生成
- [ ] 故事編輯與客製化功能

**預計交付物**:
- AI 生成的個人化背景故事
- 故事編輯器界面
- 多種故事風格選擇

### 📅 階段 4: 社交分享功能 (規劃中)
**目標**: 增強社交屬性，提升使用者互動
- [ ] 個人 Profile 頁面 (`/profile/[address]`)
- [ ] OpenGraph 圖片動態生成
- [ ] 社交媒體分享優化
- [ ] 角色比較功能
- [ ] 排行榜系統

**預計交付物**:
- 可分享的個人頁面
- 動態 OG 圖片生成
- 社群排行榜功能

### 🎯 階段 5: 進階功能 (未來規劃)
**目標**: 探索遊戲化與社群互動
- [ ] 成就系統與徽章
- [ ] 多平台帳號綁定 (Discord, Telegram)
- [ ] 戰隊與公會系統
- [ ] NFT 角色鑄造功能
- [ ] 遊戲化任務系統

---

## 📊 當前進度追蹤 (Current Progress)

### 🎉 已實現功能
- ✅ **多鏈交易同步**: 支援 9+ 條區塊鏈
- 🔄 **角色生成系統**: 基礎框架已建立，核心邏輯待優化
- ✅ **美觀 UI 設計**: 響應式角色卡片
- ✅ **資料庫優化**: 高效能查詢與索引
- ✅ **API 完整性**: RESTful API 設計

### 🔧 技術債務
- [ ] 錯誤處理優化
- [ ] 效能監控系統
- [ ] 單元測試覆蓋
- [ ] API 文檔完善

### 📈 數據表現
- **交易數據**: 1,485+ 筆已同步
- **支援鏈數**: 9 條區塊鏈
- **角色準確率**: 基於行為模式分析
- **響應時間**: < 3 秒角色生成

---

## 🎯 近期 TODO (Next Actions)

### 高優先級
1. **AI 故事生成整合** - OpenAI API
2. **角色分享功能** - Profile 頁面
3. **效能優化** - 快取與 CDN

### 中優先級
1. **多語言支援** - i18n 系統
2. **移動端優化** - PWA 功能
3. **SEO 優化** - Meta tags

### 低優先級
1. **暗色主題** - Dark mode
2. **角色動畫** - Framer Motion
3. **音效系統** - RPG 氛圍

---

## 📝 備註 (Notes)

- **設計理念**: 在保持簡潔易用的同時，融入 RPG 遊戲元素
- **目標用戶**: Web3 活躍用戶、NFT 收藏家、DeFi 玩家
- **競爭優勢**: 獨特的遊戲化視角 + 深度數據分析
- **商業模式**: 免費使用 + 高級功能訂閱

---

*最後更新: 2025年6月*  
*版本: v1.5 - Character Engine In Progress*