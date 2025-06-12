-- Supabase Table Schema for Blockchain Transaction Storage
-- Optimized for multi-chain transaction data with efficient querying

-- Main transactions table
CREATE TABLE transactions (
    -- Primary identifiers
    id BIGSERIAL PRIMARY KEY,
    hash VARCHAR(66) NOT NULL UNIQUE, -- Transaction hash with 0x prefix
    
    -- Network information
    chain VARCHAR(50) NOT NULL, -- e.g., 'ethereum', 'polygon', 'abstract'
    chain_id INTEGER NOT NULL,
    
    -- Block information
    block_number BIGINT NOT NULL,
    block_hash VARCHAR(66) NOT NULL,
    block_time TIMESTAMPTZ NOT NULL,
    transaction_index INTEGER NOT NULL,
    
    -- Transaction participants
    from_address VARCHAR(42) NOT NULL, -- Sender address
    to_address VARCHAR(42), -- Receiver address (nullable for contract creation)
    wallet_address VARCHAR(42) NOT NULL, -- The wallet we're tracking
    
    -- Transaction details
    value NUMERIC(78, 0) DEFAULT 0, -- Wei amount (supports very large numbers)
    nonce INTEGER,
    transaction_type VARCHAR(20), -- 'Sender', 'Receiver', 'Internal'
    
    -- Gas information
    gas_price NUMERIC(78, 0),
    gas_used NUMERIC(78, 0),
    effective_gas_price NUMERIC(78, 0),
    gas_limit NUMERIC(78, 0),
    
    -- Execution status
    success BOOLEAN NOT NULL DEFAULT true,
    
    -- Transaction data
    input_data TEXT, -- Contract call data
    
    -- API source tracking
    data_source VARCHAR(20) NOT NULL, -- 'dune', 'alchemy', 'etherscan'
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction logs table (for events/logs within transactions)
CREATE TABLE transaction_logs (
    id BIGSERIAL PRIMARY KEY,
    transaction_hash VARCHAR(66) NOT NULL REFERENCES transactions(hash) ON DELETE CASCADE,
    
    -- Log details
    log_index INTEGER NOT NULL,
    contract_address VARCHAR(42) NOT NULL,
    data TEXT,
    topics JSONB, -- Array of topics
    
    -- Block information (denormalized for performance)
    block_number BIGINT NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallet tracking table (for managing which wallets we're monitoring)
CREATE TABLE tracked_wallets (
    id BIGSERIAL PRIMARY KEY,
    address VARCHAR(42) NOT NULL UNIQUE,
    
    -- Sync status
    last_synced_at TIMESTAMPTZ,
    last_synced_block BIGINT,
    sync_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'syncing', 'completed', 'error'
    
    -- Statistics
    total_transactions INTEGER DEFAULT 0,
    first_transaction_at TIMESTAMPTZ,
    last_transaction_at TIMESTAMPTZ,
    
    -- Metadata
    label VARCHAR(100), -- Optional wallet label
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset transfers table (optimized for transfer analysis)
CREATE TABLE asset_transfers (
    id BIGSERIAL PRIMARY KEY,
    transaction_hash VARCHAR(66) NOT NULL REFERENCES transactions(hash) ON DELETE CASCADE,
    
    -- Transfer details
    from_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42) NOT NULL,
    
    -- Asset information
    asset_type VARCHAR(20) NOT NULL, -- 'ETH', 'ERC20', 'ERC721', 'ERC1155'
    contract_address VARCHAR(42), -- NULL for ETH transfers
    token_id NUMERIC(78, 0), -- For NFTs
    
    -- Amount (use string for display, numeric for calculations)
    raw_amount NUMERIC(78, 0) NOT NULL, -- Raw amount in smallest unit
    formatted_amount DECIMAL(36, 18), -- Formatted amount (for ERC20s)
    decimals INTEGER DEFAULT 18,
    
    -- Token metadata
    symbol VARCHAR(50),
    name VARCHAR(100),
    
    -- Block information (denormalized)
    block_number BIGINT NOT NULL,
    block_time TIMESTAMPTZ NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for optimal query performance
-- Transaction queries
CREATE INDEX idx_transactions_hash ON transactions(hash);
CREATE INDEX idx_transactions_wallet_address ON transactions(wallet_address);
CREATE INDEX idx_transactions_from_address ON transactions(from_address);
CREATE INDEX idx_transactions_to_address ON transactions(to_address);
CREATE INDEX idx_transactions_block_time ON transactions(block_time DESC);
CREATE INDEX idx_transactions_chain_block ON transactions(chain, block_number DESC);
CREATE INDEX idx_transactions_wallet_time ON transactions(wallet_address, block_time DESC);

-- Log queries
CREATE INDEX idx_transaction_logs_hash ON transaction_logs(transaction_hash);
CREATE INDEX idx_transaction_logs_contract ON transaction_logs(contract_address);
CREATE INDEX idx_transaction_logs_block ON transaction_logs(block_number DESC);

-- Wallet queries
CREATE INDEX idx_tracked_wallets_address ON tracked_wallets(address);
CREATE INDEX idx_tracked_wallets_status ON tracked_wallets(sync_status);

-- Transfer queries
CREATE INDEX idx_asset_transfers_hash ON asset_transfers(transaction_hash);
CREATE INDEX idx_asset_transfers_from ON asset_transfers(from_address);
CREATE INDEX idx_asset_transfers_to ON asset_transfers(to_address);
CREATE INDEX idx_asset_transfers_contract ON asset_transfers(contract_address);
CREATE INDEX idx_asset_transfers_type ON asset_transfers(asset_type);
CREATE INDEX idx_asset_transfers_time ON asset_transfers(block_time DESC);

-- Composite indexes for common queries
CREATE INDEX idx_transactions_wallet_chain_time ON transactions(wallet_address, chain, block_time DESC);
CREATE INDEX idx_asset_transfers_address_type ON asset_transfers(from_address, asset_type);

-- RLS (Row Level Security) policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_transfers ENABLE ROW LEVEL SECURITY;

-- Example RLS policy (adjust based on your auth requirements)
-- CREATE POLICY "Users can view their own wallet transactions" ON transactions
--     FOR SELECT USING (wallet_address = ANY(get_user_wallets()));

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracked_wallets_updated_at 
    BEFORE UPDATE ON tracked_wallets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Useful views for common queries
CREATE VIEW v_recent_transactions AS
SELECT 
    t.*,
    tw.label as wallet_label
FROM transactions t
LEFT JOIN tracked_wallets tw ON t.wallet_address = tw.address
ORDER BY t.block_time DESC;

CREATE VIEW v_transfer_summary AS
SELECT 
    t.wallet_address,
    at.asset_type,
    at.symbol,
    COUNT(*) as transfer_count,
    SUM(CASE WHEN at.from_address = t.wallet_address THEN -at.formatted_amount ELSE at.formatted_amount END) as net_amount
FROM asset_transfers at
JOIN transactions t ON at.transaction_hash = t.hash
WHERE t.success = true
GROUP BY t.wallet_address, at.asset_type, at.symbol;

-- Functions for data analysis
CREATE OR REPLACE FUNCTION get_wallet_transaction_count(wallet_addr VARCHAR(42))
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM transactions WHERE wallet_address = wallet_addr);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_wallet_balance_changes(
    wallet_addr VARCHAR(42), 
    start_date TIMESTAMPTZ DEFAULT NULL,
    end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE(
    asset_type VARCHAR(20),
    symbol VARCHAR(50),
    net_change DECIMAL(36, 18),
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        at.asset_type,
        at.symbol,
        SUM(CASE 
            WHEN at.from_address = wallet_addr THEN -at.formatted_amount 
            ELSE at.formatted_amount 
        END) as net_change,
        COUNT(*) as transaction_count
    FROM asset_transfers at
    JOIN transactions t ON at.transaction_hash = t.hash
    WHERE (at.from_address = wallet_addr OR at.to_address = wallet_addr)
        AND t.success = true
        AND (start_date IS NULL OR t.block_time >= start_date)
        AND (end_date IS NULL OR t.block_time <= end_date)
    GROUP BY at.asset_type, at.symbol
    ORDER BY transaction_count DESC;
END;
$$ LANGUAGE plpgsql;