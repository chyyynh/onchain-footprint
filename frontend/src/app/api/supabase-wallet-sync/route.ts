// API endpoint to sync wallet transactions to Supabase
import { NextRequest, NextResponse } from "next/server";
import { 
  upsertTrackedWallet, 
  insertTransactions, 
  insertTransactionLogs, 
  updateWalletSyncStatus, 
  getTransactionCount, 
  getWalletStats,
  transformDuneTransaction, 
  transformDuneTransactionLogs 
} from "@/lib/supabase-helpers";
import type { DuneTransaction } from "@/types/supabase";

export async function POST(req: NextRequest) {
  try {
    const { wallet, source = 'dune', label } = await req.json();
    
    if (!wallet) {
      return NextResponse.json(
        { error: "Missing wallet address" },
        { status: 400 }
      );
    }

    // Step 1: Register the wallet for tracking
    console.log(`Starting sync for wallet: ${wallet}`);
    await upsertTrackedWallet(wallet, label);
    await updateWalletSyncStatus(wallet, 'syncing');

    let totalSynced = 0;
    let hasMore = true;
    let nextOffset: string | null = null;
    const batchSize = 100;

    try {
      // Step 2: Fetch and sync all transactions
      while (hasMore) {
        console.log(`Fetching batch with offset: ${nextOffset || '0'}`);
        
        // Fetch from your existing API
        const apiUrl: string = nextOffset 
          ? `/api/dune-transactions?wallet=${wallet}&limit=${batchSize}&offset=${nextOffset}`
          : `/api/dune-transactions?wallet=${wallet}&limit=${batchSize}&offset=0`;
          
        const response = await fetch(`${req.nextUrl.origin}${apiUrl}`);
        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.error || 'Failed to fetch transactions');
        }

        const transactions = data.transactions || [];
        
        if (transactions.length === 0) {
          hasMore = false;
          break;
        }

        // Step 3: Transform and insert transactions
        const transformedTransactions = transactions.map((tx: DuneTransaction) => 
          transformDuneTransaction(tx, wallet)
        );

        const insertSuccess = await insertTransactions(transformedTransactions);
        
        if (!insertSuccess) {
          throw new Error('Failed to insert transactions to database');
        }

        // Step 4: Insert transaction logs
        const allLogs = transactions.flatMap((tx: DuneTransaction) => 
          transformDuneTransactionLogs(tx)
        );
        
        if (allLogs.length > 0) {
          await insertTransactionLogs(allLogs);
        }

        totalSynced += transactions.length;
        nextOffset = data.next_offset;
        hasMore = !!nextOffset;

        // Log progress
        console.log(`Synced ${totalSynced} transactions so far...`);

        // Prevent infinite loops and timeouts
        if (totalSynced >= 10000) {
          console.log('Reached maximum sync limit (10,000 transactions)');
          hasMore = false;
        }
      }

      // Step 5: Update wallet sync completion
      await updateWalletSyncStatus(wallet, 'completed');
      
      // Get final stats
      const finalCount = await getTransactionCount(wallet);

      console.log(`Sync completed for ${wallet}: ${finalCount} transactions`);

      return NextResponse.json({
        success: true,
        wallet,
        transactions_synced: totalSynced,
        total_in_database: finalCount,
        message: `Successfully synced ${totalSynced} transactions for wallet ${wallet}`
      });

    } catch (syncError) {
      // Mark wallet sync as failed
      await updateWalletSyncStatus(wallet, 'error');
      throw syncError;
    }

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { 
        error: "Sync failed", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check sync status
export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  
  if (!wallet) {
    return NextResponse.json(
      { error: "Missing wallet address" },
      { status: 400 }
    );
  }

  try {
    const transactionCount = await getTransactionCount(wallet);
    const walletStats = await getWalletStats(wallet);

    return NextResponse.json({
      wallet,
      transaction_count: transactionCount,
      stats: walletStats,
      synced: transactionCount > 0
    });

  } catch (error) {
    console.error('Error getting sync status:', error);
    return NextResponse.json(
      { error: "Failed to get sync status" },
      { status: 500 }
    );
  }
}