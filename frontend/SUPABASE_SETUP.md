# 🗄️ Supabase Database Setup for Transaction Storage

This guide will help you set up a Supabase database to store blockchain transaction data efficiently.

## 📋 Table of Contents

1. [Database Schema Overview](#database-schema-overview)
2. [Setup Instructions](#setup-instructions)
3. [Environment Configuration](#environment-configuration)
4. [Usage Examples](#usage-examples)
5. [Performance Considerations](#performance-considerations)

---

## 🏗️ Database Schema Overview

### **Core Tables:**

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `transactions` | Main transaction data | Hash-indexed, multi-chain support |
| `transaction_logs` | Event logs within transactions | Foreign key to transactions |
| `tracked_wallets` | Wallet sync management | Sync status tracking |
| `asset_transfers` | Optimized transfer data | Fast portfolio queries |

### **Key Features:**
- ✅ **Multi-chain support** (Ethereum, Polygon, etc.)
- ✅ **Efficient indexing** for fast queries
- ✅ **Automatic deduplication** via unique constraints
- ✅ **Data source tracking** (Dune, Alchemy, Etherscan)
- ✅ **Built-in analytics functions**

---

## 🚀 Setup Instructions

### **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and anon key

### **Step 2: Run Database Schema**

Execute the SQL schema file in Supabase SQL Editor:

```sql
-- Copy and paste the entire supabase_schema.sql file
-- This creates all tables, indexes, and functions
```

### **Step 3: Install Dependencies**

```bash
npm install @supabase/supabase-js
```

### **Step 4: Environment Configuration**

Add to your `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Service role key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 💾 Usage Examples

### **1. Sync a Wallet (Full Transaction History)**

```bash
# Sync all transactions for a wallet
curl -X POST http://localhost:3000/api/sync-wallet \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "0xC79Ead066Ba487398F57f6083A97890d77C55482",
    "label": "My Main Wallet"
  }'
```

**Response:**
```json
{
  "success": true,
  "wallet": "0xC79Ead066Ba487398F57f6083A97890d77C55482",
  "transactions_synced": 1484,
  "total_in_database": 1484,
  "message": "Successfully synced 1484 transactions"
}
```

### **2. Check Sync Status**

```bash
curl "http://localhost:3000/api/sync-wallet?wallet=0xC79Ead066Ba487398F57f6083A97890d77C55482"
```

### **3. Query Transactions Programmatically**

```typescript
import { TransactionStore } from '@/lib/supabase-helpers';

// Get recent transactions
const transactions = await TransactionStore.getTransactions({
  wallet_address: "0xC79Ead066Ba487398F57f6083A97890d77C55482",
  limit: 50,
  success: true
});

// Get wallet statistics
const stats = await TransactionStore.getWalletStats(
  "0xC79Ead066Ba487398F57f6083A97890d77C55482"
);
```

---

## 📊 Database Schema Details

### **Transactions Table**
```sql
transactions (
  hash VARCHAR(66) PRIMARY KEY,      -- Transaction hash
  chain VARCHAR(50),                 -- blockchain name
  chain_id INTEGER,                  -- Chain ID
  wallet_address VARCHAR(42),        -- Tracked wallet
  from_address VARCHAR(42),          -- Sender
  to_address VARCHAR(42),            -- Receiver
  value NUMERIC(78,0),               -- Wei amount
  gas_used NUMERIC(78,0),            -- Gas consumed
  success BOOLEAN,                   -- Transaction success
  block_time TIMESTAMPTZ,            -- Transaction time
  data_source VARCHAR(20)            -- API source
)
```

### **Key Indexes:**
```sql
-- Fast wallet queries
CREATE INDEX idx_transactions_wallet_time 
ON transactions(wallet_address, block_time DESC);

-- Fast hash lookups
CREATE INDEX idx_transactions_hash 
ON transactions(hash);

-- Chain-specific queries
CREATE INDEX idx_transactions_chain_block 
ON transactions(chain, block_number DESC);
```

---

## ⚡ Performance Considerations

### **Query Optimization:**

1. **Always use indexed columns** in WHERE clauses
2. **Limit results** for large datasets
3. **Use block_time** for time-based queries (indexed)
4. **Filter by wallet_address** first (most selective)

### **Efficient Query Examples:**

```sql
-- ✅ GOOD: Uses indexed columns
SELECT * FROM transactions 
WHERE wallet_address = '0x...' 
AND block_time >= '2025-01-01'
ORDER BY block_time DESC 
LIMIT 100;

-- ❌ AVOID: No indexes on value
SELECT * FROM transactions 
WHERE value > '1000000000000000000'
ORDER BY value DESC;

-- ✅ BETTER: Add wallet filter first
SELECT * FROM transactions 
WHERE wallet_address = '0x...' 
AND value > '1000000000000000000'
ORDER BY block_time DESC;
```

### **Batch Operations:**

```typescript
// ✅ Batch insert for performance
const transactions = [...]; // Array of 1000 transactions
await TransactionStore.insertTransactions(transactions);

// ❌ Avoid single inserts in loops
for (const tx of transactions) {
  await insertSingleTransaction(tx); // Slow!
}
```

---

## 🔍 Useful Queries

### **1. Portfolio Analysis**
```sql
-- Get net asset changes for a wallet
SELECT * FROM get_wallet_balance_changes(
  '0xC79Ead066Ba487398F57f6083A97890d77C55482',
  '2025-01-01'::timestamptz,
  NOW()
);
```

### **2. Gas Usage Analysis**
```sql
-- Total gas spent by wallet
SELECT 
  wallet_address,
  SUM(gas_used::numeric * gas_price::numeric) / 1e18 as total_eth_spent_on_gas,
  COUNT(*) as transaction_count
FROM transactions 
WHERE wallet_address = '0x...' 
AND success = true
GROUP BY wallet_address;
```

### **3. Contract Interaction Summary**
```sql
-- Most interacted contracts
SELECT 
  to_address as contract,
  COUNT(*) as interaction_count,
  MAX(block_time) as last_interaction
FROM transactions 
WHERE wallet_address = '0x...' 
AND to_address IS NOT NULL
AND input_data != '0x'
GROUP BY to_address
ORDER BY interaction_count DESC;
```

---

## 🔐 Security & RLS

### **Row Level Security (RLS):**

The schema includes RLS setup. Configure policies based on your auth:

```sql
-- Example: Users can only see their own wallet data
CREATE POLICY "wallet_access_policy" ON transactions
FOR SELECT USING (
  wallet_address = ANY(get_user_wallet_addresses())
);
```

### **API Key Security:**
- Use service role key for server-side operations
- Use anon key for client-side queries with RLS
- Never expose service role key in frontend

---

## 📈 Monitoring & Maintenance

### **Monitor Storage Usage:**
```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### **Archive Old Data:**
```sql
-- Archive transactions older than 2 years
DELETE FROM transactions 
WHERE block_time < NOW() - INTERVAL '2 years';
```

---

## 🚨 Troubleshooting

### **Common Issues:**

1. **Duplicate key errors:**
   - Solution: Use `upsert` with `ignoreDuplicates: true`

2. **Slow queries:**
   - Check if indexes are being used: `EXPLAIN ANALYZE`
   - Add missing indexes for your query patterns

3. **Large number precision:**
   - Use `NUMERIC(78,0)` for Wei amounts
   - Store as strings in TypeScript, convert when needed

4. **Timeout on large syncs:**
   - Process in smaller batches (100-1000 transactions)
   - Use pagination with `next_offset`

---

*This setup provides a robust foundation for storing and analyzing blockchain transaction data at scale.*