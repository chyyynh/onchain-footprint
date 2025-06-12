// Test API to insert a single transaction
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First, let's add a tracked wallet
    const testWallet = "0xC79Ead066Ba487398F57f6083A97890d77C55482";
    
    const { data: walletData, error: walletError } = await supabase
      .from('tracked_wallets')
      .upsert({ 
        address: testWallet.toLowerCase(), 
        label: "Test Wallet",
        updated_at: new Date().toISOString()
      })
      .select();

    if (walletError) {
      return NextResponse.json({
        success: false,
        step: "wallet_insert",
        error: walletError.message,
        code: walletError.code
      });
    }

    // Now try to insert a simple transaction
    const testTransaction = {
      hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      chain: "ethereum",
      chain_id: 1,
      block_number: 12345678,
      block_hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      block_time: new Date().toISOString(),
      transaction_index: 1,
      from_address: testWallet.toLowerCase(),
      to_address: "0x1234567890123456789012345678901234567890",
      wallet_address: testWallet.toLowerCase(),
      value: "1000000000000000000", // 1 ETH in wei
      nonce: 123,
      transaction_type: "Sender",
      gas_price: "20000000000",
      gas_used: "21000",
      effective_gas_price: "20000000000",
      success: true,
      input_data: "0x",
      data_source: "test" as const
    };

    const { data: txData, error: txError } = await supabase
      .from('transactions')
      .upsert(testTransaction)
      .select();

    if (txError) {
      return NextResponse.json({
        success: false,
        step: "transaction_insert",
        error: txError.message,
        code: txError.code,
        details: txError.details,
        hint: txError.hint
      });
    }

    return NextResponse.json({
      success: true,
      message: "Test insert successful",
      wallet_inserted: walletData,
      transaction_inserted: txData
    });

  } catch (err) {
    return NextResponse.json({
      success: false,
      error: "Test insert failed",
      details: err instanceof Error ? err.message : String(err)
    });
  }
}