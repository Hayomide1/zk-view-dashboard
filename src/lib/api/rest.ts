import { API_CONFIG, NETWORK_CONFIG, Network } from "./config";

// Response Types
interface ApiResponse<T> {
  data: T;
  error?: string;
}

interface PaginationParams {
  limit?: number;
  offset?: number;
}

interface TransactionParams extends PaginationParams {
  from?: string;
  to?: string;
  type?: string;
  status?: string;
}

interface BlockParams extends PaginationParams {
  from?: number;
  to?: number;
}

// Data Types
interface Transaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  value: string;
  fee: string;
  status: string;
  timestamp: number;
  type: string;
}

interface Block {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  transactions: string[];
  status: string;
}

interface Account {
  address: string;
  balance: string;
  nonce: number;
  type: string;
}

interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

interface Transfer {
  hash: string;
  from: string;
  to: string;
  token: string;
  amount: string;
  timestamp: number;
}

interface Batch {
  number: number;
  hash: string;
  transactions: string[];
  timestamp: number;
  status: string;
}

interface Proof {
  id: string;
  batchNumber: number;
  status: string;
  timestamp: number;
}

interface NetworkStats {
  totalTransactions: number;
  totalBlocks: number;
  totalAccounts: number;
  totalContracts: number;
  averageBlockTime: number;
}

interface NetworkStatus {
  status: string;
  lastBlock: number;
  lastBatch: number;
  lastProof: number;
}

export class RestApiService {
  private static instance: RestApiService;
  private network: Network;
  private baseUrl: string;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // 1 second

  private constructor(network: Network = "mainnet") {
    this.network = network;
    this.baseUrl = NETWORK_CONFIG[network].baseUrl;
  }

  public static getInstance(network: Network = "mainnet"): RestApiService {
    if (
      !RestApiService.instance ||
      RestApiService.instance.network !== network
    ) {
      RestApiService.instance = new RestApiService(network);
    }
    return RestApiService.instance;
  }

  public setNetwork(network: Network) {
    if (this.network !== network) {
      this.network = network;
      this.baseUrl = NETWORK_CONFIG[network].baseUrl;
    }
  }

  private async fetchWithRetry<T>(
    endpoint: string,
    params?: Record<string, any>,
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const url = `${this.baseUrl}${endpoint}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      console.log(`[${this.network}] Fetching from URL:`, url);

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );

        // Handle specific error cases
        if (response.status === 404) {
          throw new Error(`Resource not found: ${endpoint}`);
        } else if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        } else if (response.status >= 500) {
          throw new Error("Server error. Please try again later.");
        }

        throw error;
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error(`[${this.network}] API Error:`, {
        error,
        endpoint,
        params,
        retryCount,
        url: `${this.baseUrl}${endpoint}`,
      });

      // Retry logic for specific errors
      if (
        retryCount < this.maxRetries &&
        error instanceof Error &&
        (error.message.includes("Failed to fetch") ||
          error.message.includes("Server error") ||
          error.message.includes("Network error") ||
          error.message.includes("ERR_NAME_NOT_RESOLVED"))
      ) {
        console.log(
          `[${this.network}] Retrying request (${retryCount + 1}/${
            this.maxRetries
          })...`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, this.retryDelay * Math.pow(2, retryCount))
        );
        return this.fetchWithRetry(endpoint, params, retryCount + 1);
      }

      throw error;
    }
  }

  // Transaction methods
  public async getTransactions(
    params?: TransactionParams
  ): Promise<ApiResponse<Transaction[]>> {
    return this.fetchWithRetry(API_CONFIG.REST_ENDPOINTS.TRANSACTIONS, params);
  }

  public async getTransaction(hash: string): Promise<ApiResponse<Transaction>> {
    return this.fetchWithRetry(
      API_CONFIG.REST_ENDPOINTS.TRANSACTION.replace(":hash", hash)
    );
  }

  // Block methods
  public async getBlocks(params?: BlockParams): Promise<ApiResponse<Block[]>> {
    return this.fetchWithRetry(API_CONFIG.REST_ENDPOINTS.BLOCKS, params);
  }

  public async getBlock(number: number): Promise<ApiResponse<Block>> {
    return this.fetchWithRetry(
      API_CONFIG.REST_ENDPOINTS.BLOCK.replace(":number", number.toString())
    );
  }

  // Account methods
  public async getAccount(address: string): Promise<ApiResponse<Account>> {
    return this.fetchWithRetry(
      API_CONFIG.REST_ENDPOINTS.ACCOUNT.replace(":address", address)
    );
  }

  public async getAccountTransactions(
    address: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Transaction[]>> {
    return this.fetchWithRetry(
      API_CONFIG.REST_ENDPOINTS.ACCOUNT_TRANSACTIONS.replace(
        ":address",
        address
      ),
      params
    );
  }

  public async getAccountTransfers(
    address: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Transfer[]>> {
    return this.fetchWithRetry(
      API_CONFIG.REST_ENDPOINTS.ACCOUNT_TRANSFERS.replace(":address", address),
      params
    );
  }

  // Token methods
  public async getTokens(
    params?: PaginationParams
  ): Promise<ApiResponse<Token[]>> {
    return this.fetchWithRetry(API_CONFIG.REST_ENDPOINTS.TOKENS, params);
  }

  public async getToken(address: string): Promise<ApiResponse<Token>> {
    return this.fetchWithRetry(
      API_CONFIG.REST_ENDPOINTS.TOKEN.replace(":address", address)
    );
  }

  // Transfer methods
  public async getTransfers(
    params?: PaginationParams
  ): Promise<ApiResponse<Transfer[]>> {
    return this.fetchWithRetry(API_CONFIG.REST_ENDPOINTS.TRANSFERS, params);
  }

  public async getTransfer(hash: string): Promise<ApiResponse<Transfer>> {
    return this.fetchWithRetry(
      API_CONFIG.REST_ENDPOINTS.TRANSFER.replace(":hash", hash)
    );
  }

  // Batch methods
  public async getBatches(
    params?: PaginationParams
  ): Promise<ApiResponse<Batch[]>> {
    return this.fetchWithRetry(API_CONFIG.REST_ENDPOINTS.BATCHES, params);
  }

  public async getBatch(number: number): Promise<ApiResponse<Batch>> {
    return this.fetchWithRetry(
      API_CONFIG.REST_ENDPOINTS.BATCH.replace(":number", number.toString())
    );
  }

  // Proof methods
  public async getProofs(
    params?: PaginationParams
  ): Promise<ApiResponse<Proof[]>> {
    return this.fetchWithRetry(API_CONFIG.REST_ENDPOINTS.PROOFS, params);
  }

  public async getProof(id: string): Promise<ApiResponse<Proof>> {
    return this.fetchWithRetry(
      API_CONFIG.REST_ENDPOINTS.PROOF.replace(":id", id)
    );
  }

  // Network methods
  public async getNetworkStats(): Promise<ApiResponse<NetworkStats>> {
    return this.fetchWithRetry(API_CONFIG.REST_ENDPOINTS.NETWORK_STATS);
  }

  public async getNetworkStatus(): Promise<ApiResponse<NetworkStatus>> {
    return this.fetchWithRetry(API_CONFIG.REST_ENDPOINTS.NETWORK_STATUS);
  }
}
