
import { useQuery } from '@tanstack/react-query';
import { useWallet } from './wallet-context';
import { toast } from '@/hooks/use-toast';
import { TransactionData, NetworkData, Transaction } from './api';

// zkSync API base URLs
const ZKSYNC_ERA_MAINNET_API = 'https://mainnet.era.zksync.io';
const ZKSYNC_ERA_TESTNET_API = 'https://testnet.era.zksync.io';

// Types for zkSync API responses
interface ZkSyncTransaction {
  hash: string;
  blockNumber: number;
  blockHash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'confirmed' | 'pending';
  fee: string;
  gasLimit: string;
  gasUsed: string;
}

interface ZkSyncBlock {
  number: number;
  hash: string;
  timestamp: number;
  l1BatchNumber: number;
  transactions: string[];
}

// Helper function to determine if a transaction is a zkSync transaction
// All transactions on zkSync network are ZK transactions
const isZkTransaction = () => true;

// Fetch account transactions from zkSync API
export const fetchZkSyncTransactions = async (address: string, network: 'mainnet' | 'testnet' = 'mainnet') => {
  try {
    const baseUrl = network === 'mainnet' ? ZKSYNC_ERA_MAINNET_API : ZKSYNC_ERA_TESTNET_API;
    const response = await fetch(`${baseUrl}/api/v1/accounts/${address}/transactions`);
    
    if (!response.ok) {
      throw new Error(`zkSync API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.result as ZkSyncTransaction[];
  } catch (error) {
    console.error('Error fetching zkSync transactions:', error);
    throw error;
  }
};

// Get the latest block information
export const fetchZkSyncLatestBlock = async (network: 'mainnet' | 'testnet' = 'mainnet') => {
  try {
    const baseUrl = network === 'mainnet' ? ZKSYNC_ERA_MAINNET_API : ZKSYNC_ERA_TESTNET_API;
    const response = await fetch(`${baseUrl}/api/v1/blocks/latest`);
    
    if (!response.ok) {
      throw new Error(`zkSync API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.result as ZkSyncBlock;
  } catch (error) {
    console.error('Error fetching zkSync latest block:', error);
    throw error;
  }
};

// Transform zkSync transactions for chart data
export const transformZkSyncTransactionsForChart = (transactions: ZkSyncTransaction[]): TransactionData[] => {
  // Group transactions by day
  const dateGroups = transactions.reduce((groups: Record<string, ZkSyncTransaction[]>, tx) => {
    const date = new Date(tx.timestamp * 1000);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(tx);
    return groups;
  }, {});
  
  // Convert grouped transactions to chart data format
  return Object.entries(dateGroups).map(([dateKey, txs]) => {
    return {
      date: new Date(dateKey).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      zkTransactions: txs.length, // All transactions on zkSync are ZK
      regularTransactions: 0 // No regular transactions on zkSync
    };
  });
};

// Get network stats from zkSync transactions
export const getZkSyncNetworkStats = (transactions: ZkSyncTransaction[]): NetworkData[] => {
  return [
    {
      id: 'zksync-era',
      name: 'zkSync Era',
      zkTransactions: transactions.length,
      totalTransactions: transactions.length,
      color: 'zkpurple',
    }
  ];
};

// Format zkSync transactions for the recent transactions list
export const formatZkSyncTransactions = (transactions: ZkSyncTransaction[]): Transaction[] => {
  return transactions.slice(0, 10).map(tx => ({
    id: tx.hash,
    hash: tx.hash,
    network: 'zkSync Era',
    amount: `${parseFloat(tx.value) / 1e18} ETH`,
    timestamp: new Date(tx.timestamp * 1000).toLocaleTimeString(),
    status: tx.status,
    type: 'zk', // All zkSync transactions are ZK transactions
  }));
};

// React Query hooks for zkSync data
export const useZkSyncTransactionHistory = (address: string) => {
  const { zkSyncNetwork } = useWallet();

  return useQuery({
    queryKey: ['zkSyncTransactionHistory', address, zkSyncNetwork],
    queryFn: async () => {
      if (!address) return null;
      try {
        const transactions = await fetchZkSyncTransactions(address, zkSyncNetwork);
        return transformZkSyncTransactionsForChart(transactions);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error fetching zkSync transaction history';
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        throw error;
      }
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useZkSyncNetworksData = (address: string) => {
  const { zkSyncNetwork } = useWallet();

  return useQuery({
    queryKey: ['zkSyncNetworksData', address, zkSyncNetwork],
    queryFn: async () => {
      if (!address) return null;
      try {
        const transactions = await fetchZkSyncTransactions(address, zkSyncNetwork);
        return getZkSyncNetworkStats(transactions);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error fetching zkSync network data';
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        throw error;
      }
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useZkSyncRecentTransactions = (address: string) => {
  const { zkSyncNetwork } = useWallet();

  return useQuery({
    queryKey: ['zkSyncRecentTransactions', address, zkSyncNetwork],
    queryFn: async () => {
      if (!address) return null;
      try {
        const transactions = await fetchZkSyncTransactions(address, zkSyncNetwork);
        return formatZkSyncTransactions(transactions);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error fetching zkSync recent transactions';
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        throw error;
      }
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get zkSync stats
export const useZkSyncStatsData = (address: string) => {
  const { zkSyncNetwork } = useWallet();

  return useQuery({
    queryKey: ['zkSyncStatsData', address, zkSyncNetwork],
    queryFn: async () => {
      if (!address) return null;
      try {
        const transactions = await fetchZkSyncTransactions(address, zkSyncNetwork);
        
        // Calculate statistics
        const total = transactions.length;
        const dailyAvg = Math.round(total / 30); // Assuming 30 days of data
        
        // Calculate average confirmation time (simplified for zkSync)
        const avgConfirmationTime = '0.5s'; // zkSync is faster than Ethereum
        
        return {
          totalZkTransactions: total.toLocaleString(),
          dailyZkTransactions: dailyAvg.toLocaleString(),
          zkPercentage: '100%', // All transactions on zkSync are ZK
          avgConfirmationTime: avgConfirmationTime,
        };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error fetching zkSync stats data';
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        throw error;
      }
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
