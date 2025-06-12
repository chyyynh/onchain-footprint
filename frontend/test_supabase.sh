#!/bin/bash

echo "🧪 Complete Supabase Testing Suite"
echo "=================================="

echo ""
echo "Step 1: Test Supabase Connection"
echo "--------------------------------"
curl -s "http://localhost:3000/api/test-supabase" | jq .

echo ""
echo "Step 2: Test Simple Insert"
echo "--------------------------"
curl -s -X POST "http://localhost:3000/api/test-insert-admin" | jq .

echo ""
echo "Step 3: Test Wallet Sync (Small Batch)"
echo "---------------------------------------"
curl -s -X POST "http://localhost:3000/api/sync-wallet" \
  -H "Content-Type: application/json" \
  -d '{"wallet": "0xC79Ead066Ba487398F57f6083A97890d77C55482", "label": "Test Wallet"}' \
  --max-time 30 | jq .

echo ""
echo "Step 4: Check Sync Status"
echo "-------------------------"
curl -s "http://localhost:3000/api/sync-wallet?wallet=0xC79Ead066Ba487398F57f6083A97890d77C55482" | jq .

echo ""
echo "✅ Testing complete!"