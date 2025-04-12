export type Network = "mainnet" | "testnet";

export const NETWORK_CONFIG: Record<
  Network,
  { baseUrl: string; wsBaseUrl: string }
> = {
  mainnet: {
    baseUrl: "https://api.zksync.io/api/v0.2",
    wsBaseUrl: "wss://api.zksync.io/ws",
  },
  testnet: {
    baseUrl: "https://testnet.era.zksync.io/api/v1",
    wsBaseUrl: "wss://testnet.era.zksync.io/ws",
  },
};

export const API_CONFIG = {
  // REST endpoints
  REST_ENDPOINTS: {
    // Transactions
    TRANSACTIONS: "/transactions",
    TRANSACTION: "/transactions/:hash",
    ACCOUNT_TRANSACTIONS: "/accounts/:address/transactions",
    // Blocks
    BLOCKS: "/blocks",
    BLOCK: "/blocks/:number",
    // Accounts
    ACCOUNTS: "/accounts",
    ACCOUNT: "/accounts/:address",
    ACCOUNT_TRANSFERS: "/accounts/:address/transfers",
    // Tokens
    TOKENS: "/tokens",
    TOKEN: "/tokens/:address",
    // Transfers
    TRANSFERS: "/transfers",
    TRANSFER: "/transfers/:hash",
    // Batches
    BATCHES: "/batches",
    BATCH: "/batches/:number",
    // Proofs
    PROOFS: "/proofs",
    PROOF: "/proofs/:id",
    // Network
    NETWORK_STATS: "/network/stats",
    NETWORK_STATUS: "/network/status",
  },

  // Polling intervals
  POLLING_INTERVALS: {
    transactions: 10000, // 10 seconds
    blocks: 10000, // 10 seconds
    accounts: 15000, // 15 seconds
    tokens: 20000, // 20 seconds
  },
};
