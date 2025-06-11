# 🔗 區塊鏈交易 API 文件

本項目提供多個 API 端點來獲取錢包地址的交易歷史，每個 API 都有不同的特色和用途。

## 📋 API 概覽

| API | 資料來源 | 速度 | 完整性 | 分頁 | 主要用途 |
|-----|---------|------|--------|------|----------|
| `/api/simtxs` | Dune | 慢 | ⭐⭐⭐⭐⭐ | ✅ | UI 分頁顯示 |
| `/api/all-txs` | Dune | 很慢 | ⭐⭐⭐⭐⭐ | ❌ | 完整資料匯出 |
| `/api/getAllTxAlchemy` | Alchemy | 快 | ⭐⭐⭐ | ❌ | 資產轉移分析 |
| `/api/getAllTxAlchemyComplete` | Alchemy | 快 | ⭐⭐⭐⭐ | ❌ | 綜合轉帳資料 |

---

## 🚀 API 詳細說明

### 1. `/api/simtxs` - Dune 分頁交易 API

**最適合**: 前端分頁顯示，用戶體驗最佳

```bash
GET /api/simtxs?wallet=0x...&limit=20&offset=0
```

**參數**:
- `wallet` (必需): 錢包地址
- `limit` (選擇性): 每頁交易數量，預設 20
- `offset` (選擇性): 分頁偏移量，預設 0

**回應範例**:
```json
{
  "next_offset": "QAD4Qik3BgC1CgAA...",
  "transactions": [
    {
      "hash": "0xed4a15...",
      "from": "0x5bb96c...",
      "to": "0xade406...",
      "value": "0x0",
      "block_number": 11400464,
      "block_time": "2025-06-09T20:17:32+00:00",
      "success": false,
      "gas_used": "0x15cca",
      "logs": [...]
    }
  ]
}
```

**特色**:
- ✅ 包含所有交易類型（轉帳、合約互動、失敗交易）
- ✅ 支援無限分頁載入
- ✅ 資料最完整，包含 logs 和詳細資訊
- ❌ 單次請求較慢 (2-5秒)

---

### 2. `/api/all-txs` - Dune 完整交易 API

**最適合**: 資料分析、一次性匯出所有交易

```bash
GET /api/all-txs?wallet=0x...
```

**參數**:
- `wallet` (必需): 錢包地址
- `chain_ids` (選擇性): 指定區塊鏈 ID

**回應範例**:
```json
{
  "transactions": [...],
  "total_count": 9605,
  "message": null
}
```

**特色**:
- ✅ 一次性獲取所有歷史交易
- ✅ 資料最完整 (與 simtxs 相同品質)
- ✅ 自動處理所有分頁
- ❌ 非常慢 (30-60秒)
- ❌ 可能因為資料量大而超時
- ⚠️ 限制: 最多 10,000 筆交易

---

### 3. `/api/getAllTxAlchemy` - Alchemy 資產轉移 API

**最適合**: 資產轉移分析、投資組合追蹤

```bash
GET /api/getAllTxAlchemy?wallet=0x...
```

**參數**:
- `wallet` (必需): 錢包地址
- `fromBlock` (選擇性): 起始區塊
- `toBlock` (選擇性): 結束區塊

**回應範例**:
```json
{
  "transfers": [
    {
      "from": "0x...",
      "to": "0x...",
      "value": 1.5,
      "asset": "ETH",
      "hash": "0x...",
      "blockNum": "0x..."
    }
  ],
  "transfer_count": 901,
  "estimated_total_tx_count": 566
}
```

**特色**:
- ✅ 速度很快 (2-5秒)
- ✅ 包含 ETH、ERC20、ERC721、ERC1155 轉移
- ✅ 資料格式標準化，易於處理
- ❌ 只有資產轉移，缺少純合約呼叫
- ❌ 無法看到失敗的合約互動
- ⚠️ 限制: 最多 50,000 筆轉移

---

### 4. `/api/getAllTxAlchemyComplete` - Alchemy 完整轉帳 API

**最適合**: 綜合轉帳分析，包含進出款

```bash
GET /api/getAllTxAlchemyComplete?wallet=0x...
```

**參數**:
- `wallet` (必需): 錢包地址
- `fromBlock` (選擇性): 起始區塊
- `toBlock` (選擇性): 結束區塊

**回應範例**:
```json
{
  "transfers_from": [...],
  "transfers_to": [...],
  "unique_transfers": [...],
  "transfers_from_count": 901,
  "transfers_to_count": 507,
  "unique_transfer_count": 653,
  "total_estimated_transactions": 566
}
```

**特色**:
- ✅ 速度快 (3-8秒)
- ✅ 同時獲取轉出和轉入交易
- ✅ 自動去重複，避免重複計算
- ✅ 提供詳細的分類統計
- ❌ 仍然缺少純合約互動
- ⚠️ 主要專注於資產轉移

---

## 🎯 使用建議

### 選擇 API 的決策樹:

```
需要完整的合約互動資料？
├─ 是 → 使用 Dune API
│   ├─ 需要分頁顯示？ → `/api/simtxs`
│   └─ 需要完整匯出？ → `/api/all-txs`
└─ 否，只需要資產轉移
    ├─ 只關心轉出交易？ → `/api/getAllTxAlchemy`
    └─ 需要轉入轉出分析？ → `/api/getAllTxAlchemyComplete`
```

### 實際應用場景:

| 場景 | 推薦 API | 原因 |
|------|----------|------|
| 前端交易列表 | `/api/simtxs` | 分頁友好，完整資料 |
| DeFi 互動分析 | `/api/all-txs` | 包含所有合約呼叫 |
| 資產追蹤 | `/api/getAllTxAlchemy` | 速度快，專注轉移 |
| 投資組合分析 | `/api/getAllTxAlchemyComplete` | 完整轉帳資料 |
| 稅務計算 | `/api/all-txs` | 需要所有交易記錄 |

---

## ⚙️ 環境設定

需要在 `.env.local` 設定以下 API 金鑰:

```env
# Dune API (用於 simtxs 和 all-txs)
DUNE_API_KEY=your_dune_api_key

# Alchemy API (用於 Alchemy 相關端點)
ALCHEMY_API_KEY=your_alchemy_api_key
```

---

## 📊 效能比較

測試地址: `0xC79Ead066Ba487398F57f6083A97890d77C55482`

| API | 回應時間 | 交易數量 | 資料類型 |
|-----|----------|----------|----------|
| `/api/simtxs` | ~3秒 | 20 (分頁) | 完整交易 |
| `/api/all-txs` | ~35秒 | 1,484 | 完整交易 |
| `/api/getAllTxAlchemy` | ~2秒 | 3 | 資產轉移 |
| `/api/getAllTxAlchemyComplete` | ~5秒 | 653 | 資產轉移 |

**結論**: Dune 提供最完整的資料但較慢，Alchemy 速度快但主要專注於資產轉移。

---

## 🔧 錯誤處理

所有 API 都包含統一的錯誤格式:

```json
{
  "error": "錯誤訊息",
  "details": "詳細錯誤資訊"
}
```

常見錯誤:
- `400`: 缺少錢包地址
- `500`: API 金鑰未設定或外部 API 錯誤

---

## 📝 開發注意事項

1. **速率限制**: Alchemy 和 Dune 都有 API 呼叫限制
2. **資料新鮮度**: Dune 可能有輕微延遲，Alchemy 較即時
3. **區塊鏈支援**: 目前主要支援 Ethereum 主網
4. **分頁處理**: 只有 `/api/simtxs` 支援分頁，其他都是一次性載入

---

*最後更新: 2025年6月*