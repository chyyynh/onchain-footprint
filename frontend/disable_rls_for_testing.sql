-- Temporarily disable RLS for testing
-- Run this in Supabase SQL Editor

-- Disable RLS on all tables for testing
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_wallets DISABLE ROW LEVEL SECURITY;
ALTER TABLE asset_transfers DISABLE ROW LEVEL SECURITY;

-- Note: Remember to re-enable RLS after testing:
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transaction_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tracked_wallets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE asset_transfers ENABLE ROW LEVEL SECURITY;