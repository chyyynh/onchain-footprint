// Helper functions for Supabase transaction storage

import { createClient } from '@supabase/supabase-js';
import type { 
  Transaction, 
  TransactionLog, 
  AssetTransfer, 
  TrackedWallet,
  DuneTransaction, 
  AlchemyTransfer,
  TransactionFilters 
} from '@/types/supabase';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service role for admin operations, anon key for regular operations
export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey || supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Transform Dune API data to database format
export function transformDuneTransaction(
  duneTransaction: DuneTransaction,
  walletAddress: string
): Omit<Transaction, 'id' | 'created_at' | 'updated_at'> {
  return {
    hash: duneTransaction.hash,
    chain: duneTransaction.chain,
    chain_id: duneTransaction.chain_id,
    block_number: duneTransaction.block_number,
    block_hash: duneTransaction.block_hash,
    block_time: duneTransaction.block_time,
    transaction_index: duneTransaction.index,
    from_address: duneTransaction.from.toLowerCase(),
    to_address: duneTransaction.to ? duneTransaction.to.toLowerCase() : null,
    wallet_address: walletAddress.toLowerCase(),
    value: duneTransaction.value && duneTransaction.value.startsWith('0x') ? parseInt(duneTransaction.value, 16).toString() : (duneTransaction.value || '0'),
    nonce: duneTransaction.nonce ? parseInt(duneTransaction.nonce, 16) : null,
    transaction_type: duneTransaction.transaction_type,
    gas_price: duneTransaction.gas_price && duneTransaction.gas_price.startsWith('0x') ? parseInt(duneTransaction.gas_price, 16).toString() : duneTransaction.gas_price,
    gas_used: duneTransaction.gas_used && duneTransaction.gas_used.startsWith('0x') ? parseInt(duneTransaction.gas_used, 16).toString() : duneTransaction.gas_used,
    effective_gas_price: duneTransaction.effective_gas_price && duneTransaction.effective_gas_price.startsWith('0x') ? parseInt(duneTransaction.effective_gas_price, 16).toString() : duneTransaction.effective_gas_price,
    gas_limit: null, // Not provided by Dune
    success: duneTransaction.success,
    input_data: duneTransaction.data,
    data_source: 'dune'
  };
}

// Transform Dune transaction logs
export function transformDuneTransactionLogs(
  duneTransaction: DuneTransaction
): Omit<TransactionLog, 'id' | 'created_at'>[] {
  return duneTransaction.logs.map((log, index) => ({
    transaction_hash: duneTransaction.hash,
    log_index: index,
    contract_address: log.address.toLowerCase(),
    data: log.data,
    topics: log.topics,
    block_number: duneTransaction.block_number
  }));
}

// Transform Alchemy transfer data to database format
export function transformAlchemyTransfer(
  alchemyTransfer: AlchemyTransfer,
  walletAddress: string
): Omit<AssetTransfer, 'id' | 'created_at'> {
  const isEth = alchemyTransfer.asset === 'ETH';
  const blockNumber = parseInt(alchemyTransfer.blockNum, 16);
  
  return {
    transaction_hash: alchemyTransfer.hash,
    from_address: alchemyTransfer.from.toLowerCase(),
    to_address: alchemyTransfer.to.toLowerCase(),
    asset_type: isEth ? 'ETH' : 'ERC20', // Simplified, could be enhanced
    contract_address: alchemyTransfer.rawContract?.address?.toLowerCase() || null,
    token_id: null, // Not typically in basic transfers
    raw_amount: (alchemyTransfer.value * Math.pow(10, 18)).toString(), // Convert to wei
    formatted_amount: alchemyTransfer.value,
    decimals: parseInt(alchemyTransfer.rawContract?.decimal || '18'),
    symbol: alchemyTransfer.asset,
    name: null, // Would need additional API call
    block_number: blockNumber,
    block_time: alchemyTransfer.metadata?.blockTimestamp || new Date().toISOString()
  };
}

// Database operations
export class TransactionStore {
  
  // Add or update a tracked wallet
  static async upsertTrackedWallet(address: string, label?: string): Promise<TrackedWallet | null> {
    const { data, error } = await supabaseAdmin
      .from('tracked_wallets')
      .upsert({ 
        address: address.toLowerCase(), 
        label,
        sync_status: 'pending',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'address',
        ignoreDuplicates: false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error upserting tracked wallet:', error);
      return null;
    }
    
    return data;
  }

  // Bulk insert transactions (with conflict handling)
  static async insertTransactions(transactions: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>[]): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('transactions')
      .upsert(transactions, { 
        onConflict: 'hash',
        ignoreDuplicates: true 
      });
    
    if (error) {
      console.error('Error inserting transactions:', error);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      return false;
    }
    
    return true;
  }

  // Bulk insert transaction logs
  static async insertTransactionLogs(logs: Omit<TransactionLog, 'id' | 'created_at'>[]): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('transaction_logs')
      .upsert(logs, { ignoreDuplicates: true });
    
    if (error) {
      console.error('Error inserting transaction logs:', error);
      return false;
    }
    
    return true;
  }

  // Bulk insert asset transfers
  static async insertAssetTransfers(transfers: Omit<AssetTransfer, 'id' | 'created_at'>[]): Promise<boolean> {
    const { error } = await supabase
      .from('asset_transfers')
      .upsert(transfers, { ignoreDuplicates: true });
    
    if (error) {
      console.error('Error inserting asset transfers:', error);
      return false;
    }
    
    return true;
  }

  // Get transactions with filters
  static async getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
    let query = supabase
      .from('transactions')
      .select('*')
      .order('block_time', { ascending: false });

    if (filters.wallet_address) {
      query = query.eq('wallet_address', filters.wallet_address.toLowerCase());
    }
    if (filters.chain) {
      query = query.eq('chain', filters.chain);
    }
    if (filters.from_date) {
      query = query.gte('block_time', filters.from_date);
    }
    if (filters.to_date) {
      query = query.lte('block_time', filters.to_date);
    }
    if (filters.success !== undefined) {
      query = query.eq('success', filters.success);
    }
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    
    return data || [];
  }

  // Get wallet statistics
  static async getWalletStats(walletAddress: string): Promise<any> {
    const { data, error } = await supabase
      .rpc('get_wallet_balance_changes', { 
        wallet_addr: walletAddress.toLowerCase() 
      });
    
    if (error) {
      console.error('Error fetching wallet stats:', error);
      return null;
    }
    
    return data;
  }

  // Update wallet sync status
  static async updateWalletSyncStatus(
    address: string, 
    status: 'pending' | 'syncing' | 'completed' | 'error',
    lastSyncedBlock?: number
  ): Promise<boolean> {
    const updateData: any = { 
      sync_status: status,
      updated_at: new Date().toISOString()
    };
    
    if (lastSyncedBlock) {
      updateData.last_synced_block = lastSyncedBlock;
      updateData.last_synced_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('tracked_wallets')
      .update(updateData)
      .eq('address', address.toLowerCase());
    
    if (error) {
      console.error('Error updating wallet sync status:', error);
      return false;
    }
    
    return true;
  }

  // Get transaction count for a wallet
  static async getTransactionCount(walletAddress: string): Promise<number> {
    const { count, error } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('wallet_address', walletAddress.toLowerCase());
    
    if (error) {
      console.error('Error getting transaction count:', error);
      return 0;
    }
    
    return count || 0;
  }
}

// Utility functions
export function formatWeiToEth(wei: string): number {
  return parseFloat(wei) / Math.pow(10, 18);
}

export function formatGasPrice(gasPrice: string): number {
  return parseFloat(gasPrice) / Math.pow(10, 9); // Convert to Gwei
}

export function isContractInteraction(transaction: Transaction): boolean {
  return !!transaction.input_data && transaction.input_data !== '0x';
}