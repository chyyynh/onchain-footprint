鏈上 Avatar: Ghost Genesis (ghost.fog.world)
在這層鏈上的迷霧中，每個人都留下了殘影。
這些殘影，組成了你的幽靈（Ghost）。
歡迎來到 ghost.fog.world —— 鑄造你的鏈上靈魂。

1. 專案概述 (Project Overview)
   Ghost Genesis 是一個創新的 Web3 應用，在將使用者的鏈上活動轉化為獨特的 RPG（角色扮演遊戲）角色。透過分析地址在區塊鏈上的足跡（如 NFT 交易、DeFi 互動、空投領取等），我們將為每個使用者生成一個專屬的 RPG 角色、背景故事、職業、稀有度及屬性傾向。本專案目標是提供一個遊戲化、視覺化的方式，讓使用者能更直觀、有趣地理解並分享自己的鏈上數位身份。
2. 專案拆分模組（Modules）
   Wallet 登入與資料抓取模組 (Web3 Tracker)
   角色生成模組 (RPG Character Engine)
   前端展示模組 (Footprint UI / RPG UI)
   帳號系統與資料儲存模組 (Auth + DB)
   分享與成就模組 (Profile & Social Share)
   CI/CD 與測試模組 (DevOps & QA)

[Web3 Tracker] ─┬─▶ [Character Engine]
│
└─▶ [Frontend UI] ─▶ [Profile Page]
└─▶ [Share / OG Image]

[Frontend UI] ─▶ [Supabase Auth + DB] ◀── [Character Engine]

1. Wallet 登入與資料抓取模組 (Web3 Tracker): 專注於鏈上資料讀取與轉換成任務資料
   功能：
   EVM 錢包登入（wagmi）
   用戶交易歷史查詢（Alchemy SDK、The Graph）
   活動分類器（Mint、Swap、空投、DAO 投票）
   技術棧：wagmi, viem, Alchemy SDK, The Graph
   可拆出為獨立模組或 NPM 套件，例如：
   @ghostgenesis/tracker：傳入 wallet address，回傳鏈上活動分類
2. 角色生成模組 (RPG Character Engine): 將鏈上活動轉化為角色背景、屬性、職業、稀有度
   功能：
   根據足跡分類（e.g. NFT 收藏家、DeFi 玩家）對應職業
   統計稀有程度與等級（如：跨鏈、多協議參與等）
   屬性傾向分析（勇氣、智慧、魅力等）
   利用 OpenAI 生成人設背景故事與描述
   技術棧：OpenAI GPT-4 / GPT-4o, 自定義 Prompt Template 系統
   可抽出為 serverless function 或 microservice，例如：
   POST /api/character：輸入 address，輸出角色資訊 JSON
3. 前端展示模組 (Footprint UI / RPG UI): 將角色、任務、故事以 RPG UI 呈現，兼具視覺吸引與易用性
   功能：
   角色卡片（頭像、能力值、故事）
   地圖(eth & Layer2) / 時間排序風格的鏈上足跡/任務歷程展示（可能為時間軸 + 卡片式 UI）
   輕遊戲化 UI（Hover 動畫、成就系統佈局）
   技術棧：Next.js + Tailwind CSS + Framer Motion
   建議拆分為 Components + Hooks：
   /components/CharacterCard.tsx
   /components/QuestTimeline.tsx
   /hooks/useFootprint.tsx
4. 帳號系統與資料儲存模組 (Auth + DB): 儲存每個 address 的角色紀錄與使用者偏好
   功能：
   Supabase Auth（支援錢包登入）
   儲存角色生成結果 / 使用者設定（偏好故事風格、語言等）
   RLS 設計，確保不同 address 僅能查看自身資料
   技術棧：Supabase Auth, Postgres + Row Level Security
5. 分享與成就模組 (Profile & Social Share): 分享個人角色頁與社交互動功能
   功能：
   profile/[address] 頁面（靜態或動態生成）
   OpenGraph 圖片動態生成（Vercel OG）
   成就徽章展示（如：參與 3 條鏈、持有稀有 NFT）
   計畫中：留言板 / Telegram 連動 / 戰隊
   技術棧：Next.js dynamic route, Vercel OG Image, Supabase Storage
6. CI/CD 與測試模組 (DevOps & QA): 確保開發流程穩定可靠
   功能：
   GitHub Actions：測試、打包、自動部署
   Jest + Testing Library：前端單元測試
   MSW（Mock Service Worker）：模擬 API 回傳
7. 專案路線圖 (Project Roadmap)
   以下是 Ghost Genesis 專案的階段性開發計畫，每個階段都包含明確的目標、主要功能與預計時程。
   🧩 階段 1：最小可行產品 (MVP) - (預計 1 週)
   目標： 建立核心功能，實現錢包登入並顯示使用者基礎鏈上活動。
   主要功能：
   錢包連接： 支援主流錢包（如 MetaMask）登入。
   地址查詢： 根據用戶輸入的 EVM 地址，查詢其最近的鏈上交易活動。
   交易詳情顯示： 展示持有代幣、錢包活動時間、事件時間、互動合約名稱、交易摘要（例如「Mint NFT」、「Swap Token」）。
   RPG 任務文字轉換： 將原始交易數據轉換為更具遊戲感的「RPG 任務文字」列表。
   技術棧： Next.js, TypeScript, App Router, wagmi, viem, Alchemy SDK / The Graph / Zora API。
   可放履歷亮點： 應用 wagmi 完成登入與鏈上資料拉取；整合 Alchemy API / RPC，完成 onchain footprint 基礎展示。
   🎮 階段 2：RPG 敘事 + 遊戲化 UI (預計 1–2 週)
   目標： 視覺化用戶鏈上歷程，融入 RPG 世界觀與初步遊戲化元素。
   主要功能：
   角色背景故事生成： 利用 AI (OpenAI GPT) 根據鏈上事件摘要，自動生成一段個性化的角色背景故事。
   RPG 地圖風格 UI： 設計具備 RPG 視覺風格的介面，可能包含可選的互動場景。
   角色頭像與成就： 提供角色頭像選擇或生成功能；支援領取基於鏈上行為的成就（例如「完成首次交易」）。
   用戶進度儲存： 將用戶的生成角色、故事、成就等數據儲存至資料庫。
   技術棧： Tailwind CSS, Framer Motion, Supabase, OpenAI API。
   可放履歷亮點： AI 整合（自動產出鏈上足跡故事）；地圖式 UI + 遊戲成就展示（UI/UX 能力展現）；Supabase 資料儲存與用戶狀態管理。
   🔐 階段 3：登入機制 + CI/CD (預計 1 週)
   目標： 完善用戶帳戶系統，並建立自動化部署流程。
   主要功能：
   錢包綁定帳戶： 實現錢包登入後與 Supabase 帳戶的綁定，確保用戶數據持久化。
   自動化測試： 導入單元測試與整合測試，確保核心功能穩定性。
   CI/CD 流程： 設定 GitHub Actions，實現程式碼提交後的自動測試與部署。
   技術棧： Supabase Auth (Magic Link / Wallet 登入), GitHub Actions, Jest, React Testing Library, MSW。
   可放履歷亮點： 具備 CI/CD 經驗（自動部署）；使用 Supabase Auth 管理 Web3 登入帳戶；有基本的自動化測試流程。
   🌐 階段 4：社交分享 + 自訂 RPG 故事 (預計 1 週)
   目標： 強化專案的社交屬性，允許用戶分享並個性化其 RPG 故事。
   主要功能：
   個人分享頁面： 用戶可建立專屬的「我的 Web3 冒險歷程」分享頁面。
   OpenGraph 預覽： 支援連結分享時顯示精美的預覽圖 (OG Image)。
   故事編輯器： 提供 AI 輔助的編輯器，允許用戶微調或改寫其生成的 RPG 故事。
   技術棧： Next.js API Routes / Vercel OG Image, OpenAI GPT, Public profile route (/profile/[address])。
   可放履歷亮點： 建立分享式個人頁面；OG Image 動態生成；使用 GPT 作為內容微編輯工具（生成式 AI 整合能力）。
   🚀 階段 5：進階成就系統 + 社群互動 (Optional)
   目標： 探索將平台發展為具備「RPG 社群化潛力」的願景。
   主要功能：
   任務系統： 設計更複雜、可互動的 RPG 章節或任務。
   多平台綁定： 支援 Discord / Telegram 帳戶與錢包綁定。
   社群互動： 允許用戶之間留言、互送徽章等遊戲化互動。
   技術棧： Supabase Row-Level Security, Telegram Bot API, Tailwind UI, Zustand。
   可放履歷亮點： Web3 社交功能設計；Bot + Web 的跨平台整合經驗；深入 Supabase 安全性設計 (RLS)。
8. 技術棧 (Technology Stack)
   本專案將採用以下核心技術與工具：
   類別
   工具
   說明
   前端框架
   Next.js
   React 框架，支援 SSR/SSG，利於 SEO 與效能
   語言
   TypeScript
   靜態型別檢查，提升開發品質
   UI 框架
   Tailwind CSS
   公用程式優先 CSS 框架，快速客製化 UI
   動畫
   Framer Motion
   高效動畫函式庫，用於 UI 流暢互動
   Web3 函式庫
   wagmi
   React Hooks 寫法的 Web3 工具，用於錢包登入與合約互動
   RPC 工具
   viem
   輕量級 RPC 請求工具，處理鏈上互動
   資料庫
   Supabase
   Firebase 替代品，支援即時資料與用戶認證，開源且支援 RLS
   AI 生成
   OpenAI API
   GPT 模型用於背景故事與內容編輯
   CI/CD
   GitHub Actions
   自動測試與部署流程整合
   測試工具
   Jest, Testing Library, MSW
   單元測試、UI 測試與 API 模擬

9. Footprint Quest 屬性雷達圖設計 v0.1
   一、屬性分類（建議使用 5 ～ 6 個維度）
   以下是建議的六大屬性，可以涵蓋大多數鏈上玩家行為，並保持直觀易懂：
   屬性
   Emoji
   說明
   行為例子
   🧠 智慧 (Wisdom)
   wisdom
   是否善用合約與 DeFi 工具、資產管理效率
   DeFi 協議互動、利率管理、合約批次交易
   🧭 冒險 (Adventure)
   adventure
   是否探索新鏈、新協議與鏈上活動
   用過 L2、測試網、Zora mint、空投參與
   🎨 美感 (Aesthetic)
   aesthetic
   對 NFT、PFP、鏈上藝術的參與程度
   收藏 NFT、使用 ENS、參與藝術協議
   👥 社交 (Social)
   social
   參與 DAO、發送 POAP、使用社交協議
   Snapshot 投票、Lens、Gitcoin Passport
   🪙 貪婪 (Greed)
   greed
   空投狩獵、搶新項目、套利行為
   鏈上活動集中在空投、mint、交互農空投
   🔒 安全感 (Stability)
   stability
   使用主流協議、少亂交互，偏好長期持有
   使用主流 DeFi、持有 ETH/USDC、不頻繁交易

二、如何算出每個維度的分數？
每個屬性 0 ～ 5 分，從用戶行為加總得出。以下是簡化版邏輯：
type Attributes = {
wisdom: number; // DeFi 互動深度、鏈上資產管理
adventure: number; // 鏈上協議數量、L2 數量、早期交互
aesthetic: number; // NFT 購買次數、ENS、有無 Zorb 等
social: number; // Snapshot 投票、Gitcoin、POAP 數量
greed: number; // 空投互動數、交互新項目數
stability: number; // 長期持有資產筆數、未頻繁轉帳
}

範例轉換邏輯（簡化）：
if (使用過 DeFi 協議數 > 5) attributes.wisdom += 2;
if (持有 NFT > 10 個) attributes.aesthetic += 3;
if (參與 Snapshot 投票 > 3 次) attributes.social += 2;
if (zkSync / Arbitrum / Starknet 皆有交互) attributes.adventure += 3;
if (每月交易次數 > 50) attributes.greed += 2;
if (超過 2 年沒換主資產) attributes.stability += 2;

三、前端視覺化建議
可以用 recharts 或 nivo 畫出雷達圖（RadarChart）：
🎨 recharts 範例（支援 React）：
<RadarChart outerRadius={90} width={400} height={400} data={attributeData}>
<PolarGrid />
<PolarAngleAxis dataKey="attribute" />
<PolarRadiusAxis angle={30} domain={[0, 5]} />
<Radar name="User" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
</RadarChart>

const attributeData = [
{ attribute: '智慧 🧠', value: 3 },
{ attribute: '冒險 🧭', value: 5 },
{ attribute: '美感 🎨', value: 2 },
{ attribute: '社交 👥', value: 1 },
{ attribute: '貪婪 🪙', value: 4 },
{ attribute: '安全感 🔒', value: 3 },
];

如果你想要偏像遊戲 UI，可以加入角色卡背景、光暈動畫（Framer Motion）。

四、整合在角色卡範例

{
"address": "0x1234...",
"class": "空投獵人 Airdrop Hunter",
"rank": "A",
"attributes": {
"wisdom": 2,
"adventure": 5,
"aesthetic": 1,
"social": 1,
"greed": 4,
"stability": 3
},
"description": "你是一位鍊上旅人，擅長挖掘機會與空投，探索從未踏入的新世界。"
}

6. Footprint Quest 角色生成邏輯 v0.1
   一、資料來源（行為判斷基礎）
   先從這幾類行為資料抓出來（可用 Alchemy SDK / Zora API / The Graph）：
   NFT Mint / Buy / Sell（特定合約互動）

DeFi Protocol 互動（Aave、Compound、Uniswap、Pendle、Lido 等）

領空投（Hop、ZkSync、Arbitrum 等）

DAO 參與（snapshot vote、提案）

ENS 購買

L2 活動數量（zkSync, Optimism, Base…）

交易筆數 & Gas 用量

二、行為 → 職業分類器（可以先手寫邏輯，後續再 AI 自動分類）
行為模式
對應職業
說明
頻繁 NFT Mint / Buy
NFT 收藏家 Collector
擅長探索藝術與早期 NFT
常用 Uniswap / Curve / Pendle
DeFi 鍊金術師 Alchemist
熟悉合成資產與利率魔法
擅長空投捕捉（有多個空投紀錄）
空投獵人 Airdrop Hunter
以空投為生，逐鏈遷徙
DAO 有參與投票紀錄
協議議員 Protocol Diplomat
對治理有貢獻者
L2 活躍（多鏈活躍）
鏈境旅人 Chain Wanderer
穿梭於各鏈的多鏈俠客
ENS 多名 + 自訂頭像
名號使者 Identity Seeker
在鏈上留下真名的信仰者
鏈上行為雜、少量交易
新手旅人 Newcomer
初入鏈上世界的萌新
常跨鏈轉帳 / 使用橋
鍊間使者 Interchain Nomad
鍊間往返的旅商角色

（之後還可以做更細分類，如「PFP 收藏家」、「DeFi 風險玩家」、「LSD 狂熱者」等）

三、稀有度計算（Rank）
根據以下加總邏輯計算稀有度：
指標
加分方式
總交易筆數 > 500
+1
鍊上活躍年數 > 2 年
+1
使用過 10 條以上鏈
+2
領取過 >3 空投
+1
擁有知名 NFT（如 ENS, Zorb, Loot）
+2
曾參與 DAO 提案
+2
擁有 Gitcoin Passport / POAP
+1

總分對應 Rank：
0-1: D（萌新）

2-3: C（入門）

4-5: B（熟手）

6-7: A（高手）

8+: S（傳奇）

四、屬性傾向（可用 emoji 呈現）
屬性
對應行為
🧠 智慧
用過多個 DeFi 協議
🧭 冒險
穿越多鏈 + 用過橋
🎨 美感
收藏 NFT 多 + 參與藝術類專案
👥 社交
DAO 投票、POAP、有參與社群
🪙 貪婪
多空投 + 交易多次搶快專案

每個角色可以有三個主要屬性（或做雷達圖、條狀圖）

五、角色敘述（AI 自動補上）
