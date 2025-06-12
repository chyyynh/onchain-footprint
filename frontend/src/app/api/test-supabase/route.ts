// Test API to check Supabase connection
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: "Supabase environment variables not configured",
        missing: {
          url: !supabaseUrl,
          key: !supabaseKey
        }
      });
    }

    // Test connection
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try a simple query to test connection
    const { data, error } = await supabase
      .from('tracked_wallets')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        error: "Supabase connection failed",
        details: error.message,
        hint: "Check if tables exist and RLS policies are configured"
      });
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful",
      url: supabaseUrl,
      tables_accessible: true
    });

  } catch (err) {
    return NextResponse.json({
      success: false,
      error: "Test failed",
      details: err instanceof Error ? err.message : String(err)
    });
  }
}