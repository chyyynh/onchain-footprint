// TypeScript types for Supabase transaction schema

export interface Transaction {
  id: number;
  hash: string;
  chain: string;
  chain_id: number;
  block_number: number;
  block_hash: string;
  block_time: string;
  transaction_index: number;
  from_address: string;
  to_address: string | null;
  wallet_address: string;
  value: string; // Stored as string to handle large numbers
  nonce: number | null;
  transaction_type: string | null;
  gas_price: string | null;
  gas_used: string | null;
  effective_gas_price: string | null;
  gas_limit: string | null;
  success: boolean;
  input_data: string | null;
  data_source: 'dune' | 'alchemy' | 'etherscan';
  created_at: string;
  updated_at: string;
}

export interface TransactionLog {
  id: number;
  transaction_hash: string;
  log_index: number;
  contract_address: string;
  data: string | null;
  topics: string[] | null;
  block_number: number;
  created_at: string;
}

export interface TrackedWallet {
  id: number;
  address: string;
  last_synced_at: string | null;
  last_synced_block: number | null;
  sync_status: 'pending' | 'syncing' | 'completed' | 'error';
  total_transactions: number;
  first_transaction_at: string | null;
  last_transaction_at: string | null;
  label: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssetTransfer {
  id: number;
  transaction_hash: string;
  from_address: string;
  to_address: string;
  asset_type: 'ETH' | 'ERC20' | 'ERC721' | 'ERC1155';
  contract_address: string | null;
  token_id: string | null;
  raw_amount: string;
  formatted_amount: number | null;
  decimals: number;
  symbol: string | null;
  name: string | null;
  block_number: number;
  block_time: string;
  created_at: string;
}

// API response types (for transforming to database format)
export interface DuneTransaction {
  chain: string;
  chain_id: number;
  address: string;
  block_time: string;
  block_number: number;
  index: number;
  hash: string;
  block_hash: string;
  value: string;
  transaction_type: string;
  from: string;
  to: string;
  nonce: string;
  gas_price: string;
  gas_used: string;
  effective_gas_price: string;
  success: boolean;
  data: string;
  logs: Array<{
    address: string;
    data: string;
    topics: string[];
  }>;
}

export interface AlchemyTransfer {
  from: string;
  to: string;
  value: number;
  asset: string;
  hash: string;
  blockNum: string;
  category: string;
  rawContract?: {
    address: string;
    decimal: string;
  };
  metadata?: {
    blockTimestamp: string;
  };
}

// Helper types for queries
export interface TransactionFilters {
  wallet_address?: string;
  chain?: string;
  from_date?: string;
  to_date?: string;
  asset_type?: string;
  success?: boolean;
  limit?: number;
  offset?: number;
}

export interface WalletStats {
  total_transactions: number;
  successful_transactions: number;
  failed_transactions: number;
  total_gas_used: string;
  first_transaction: string;
  last_transaction: string;
  unique_contracts_interacted: number;
}

export interface AssetBalance {
  asset_type: string;
  symbol: string;
  net_change: number;
  transaction_count: number;
}