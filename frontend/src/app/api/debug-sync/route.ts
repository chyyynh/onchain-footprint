// Debug version of sync to see exact errors
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { wallet } = await req.json();
    
    if (!wallet) {
      return NextResponse.json({ error: "Missing wallet" }, { status: 400 });
    }

    // Check environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!serviceRoleKey,
      hasAnonKey: !!anonKey
    });

    // Use service role if available, otherwise anon
    const supabase = createClient(
      supabaseUrl, 
      serviceRoleKey || anonKey,
      serviceRoleKey ? {
        auth: { autoRefreshToken: false, persistSession: false }
      } : {}
    );

    // Test 1: Try to insert wallet
    console.log('Testing wallet insert...');
    const { data: walletData, error: walletError } = await supabase
      .from('tracked_wallets')
      .upsert({ 
        address: wallet.toLowerCase(), 
        label: "Debug Test",
        sync_status: 'pending',
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'address',
        ignoreDuplicates: false 
      })
      .select();

    if (walletError) {
      console.error('Wallet insert error:', walletError);
      return NextResponse.json({
        error: "Wallet insert failed",
        details: walletError.message,
        code: walletError.code,
        hint: walletError.hint,
        using_service_key: !!serviceRoleKey
      });
    }

    console.log('Wallet inserted successfully:', walletData);

    // Test 2: Fetch 2 transactions from API
    console.log('Fetching transactions from API...');
    const apiResponse = await fetch(`${req.nextUrl.origin}/api/simtxs?wallet=${wallet}&limit=2&offset=0`);
    const apiData = await apiResponse.json();

    if (!apiResponse.ok || !apiData.transactions) {
      return NextResponse.json({
        error: "Failed to fetch from API",
        details: apiData
      });
    }

    console.log('Fetched transactions:', apiData.transactions.length);

    // Test 3: Transform and insert transactions
    const transactions = apiData.transactions.map((tx: any) => ({
      hash: tx.hash,
      chain: tx.chain,
      chain_id: tx.chain_id,
      block_number: tx.block_number,
      block_hash: tx.block_hash,
      block_time: tx.block_time,
      transaction_index: tx.index,
      from_address: tx.from.toLowerCase(),
      to_address: tx.to ? tx.to.toLowerCase() : null,
      wallet_address: wallet.toLowerCase(),
      value: tx.value.startsWith('0x') ? parseInt(tx.value, 16).toString() : tx.value,
      nonce: parseInt(tx.nonce, 16),
      transaction_type: tx.transaction_type,
      gas_price: tx.gas_price.startsWith('0x') ? parseInt(tx.gas_price, 16).toString() : tx.gas_price,
      gas_used: tx.gas_used.startsWith('0x') ? parseInt(tx.gas_used, 16).toString() : tx.gas_used,
      effective_gas_price: tx.effective_gas_price.startsWith('0x') ? parseInt(tx.effective_gas_price, 16).toString() : tx.effective_gas_price,
      gas_limit: null,
      success: tx.success,
      input_data: tx.data,
      data_source: 'dune'
    }));

    console.log('Transformed transactions:', transactions.length);
    console.log('Sample transaction:', transactions[0]);

    // Test 4: Insert transactions
    const { data: txData, error: txError } = await supabase
      .from('transactions')
      .upsert(transactions, { 
        onConflict: 'hash',
        ignoreDuplicates: true 
      })
      .select();

    if (txError) {
      console.error('Transaction insert error:', txError);
      return NextResponse.json({
        error: "Transaction insert failed",
        details: txError.message,
        code: txError.code,
        hint: txError.hint,
        sample_data: transactions[0]
      });
    }

    console.log('Transactions inserted successfully:', txData?.length);

    return NextResponse.json({
      success: true,
      results: {
        wallet_inserted: walletData?.length || 0,
        transactions_fetched: transactions.length,
        transactions_inserted: txData?.length || 0,
        using_service_key: !!serviceRoleKey
      }
    });

  } catch (err) {
    console.error('Debug sync error:', err);
    return NextResponse.json({
      error: "Debug sync failed",
      details: err instanceof Error ? err.message : String(err)
    });
  }
}