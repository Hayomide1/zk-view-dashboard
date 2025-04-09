
import { useQuery } from '@tanstack/react-query';
import { useWallet } from './wallet-context';
import { toast } from '@/hooks/use-toast';

// Base URL for Etherscan API
const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/api';

// Types for API responses
interface EtherscanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  confirmations: string;
}

export interface TransactionData {
  date: string;
  zkTransactions: number;
  regularTransactions: number;
}

export interface NetworkData {
  id: string;
  name: string;
  zkTransactions: number;
  totalTransactions: number;
  color: string;
}

export interface Transaction {
  id: string;
  hash: string;
  network: string;
  amount: string;
  timestamp: string;
  status: 'confirmed' | 'pending';
  type: 'zk' | 'regular';
}

// Function to identify if a transaction is likely a ZK transaction
const isZkTransaction = (transaction: EtherscanTransaction): boolean => {
  // Check if the input data suggests a ZK proof (simplified check)
  return transaction.input.length > 1000; // ZK proofs tend to have long input data
};

// Fetch transactions from Etherscan API
export const fetchTransactions = async (address: string, apiKey: string, startBlock = '0', endBlock = '99999999') => {
  if (!apiKey) {
    throw new Error('Etherscan API key is required');
  }

  const url = `${ETHERSCAN_BASE_URL}?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=desc&apikey=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.status !== '1') {
      throw new Error(data.message || `Etherscan API error: ${data.result}`);
    }
    
    return data.result as EtherscanTransaction[];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Transform raw transactions into chart-compatible data
export const transformTransactionsForChart = (transactions: EtherscanTransaction[]): TransactionData[] => {
  // Group transactions by day
  const dateGroups = transactions.reduce((groups: Record<string, EtherscanTransaction[]>, tx) => {
    const date = new Date(parseInt(tx.timeStamp) * 1000);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(tx);
    return groups;
  }, {});
  
  // Convert grouped transactions to chart data format
  return Object.entries(dateGroups).map(([dateKey, txs]) => {
    const zkTxCount = txs.filter(tx => isZkTransaction(tx)).length;
    
    return {
      date: new Date(dateKey).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      zkTransactions: zkTxCount,
      regularTransactions: txs.length - zkTxCount
    };
  });
};

// Get network stats from transactions
export const getNetworkStats = (transactions: EtherscanTransaction[]): NetworkData[] => {
  // For simplicity, using hardcoded network IDs
  const networks = [
    { id: '1', name: 'Ethereum', color: 'zkpurple', txs: [] },
    { id: '2', name: 'Polygon', color: 'zkteal', txs: [] },
    { id: '3', name: 'Optimism', color: 'rose-500', txs: [] },
    { id: '4', name: 'Arbitrum', color: 'blue-500', txs: [] },
  ];
  
  // Randomly distribute transactions across networks for demo purposes
  transactions.forEach(tx => {
    const networkIndex = Math.floor(Math.random() * networks.length);
    networks[networkIndex].txs.push(tx);
  });
  
  return networks.map(network => ({
    id: network.id,
    name: network.name,
    zkTransactions: network.txs.filter(tx => isZkTransaction(tx)).length,
    totalTransactions: network.txs.length,
    color: network.color
  }));
};

// React Query hooks - now using the API key from context
export const useTransactionHistory = (address: string) => {
  const { etherscanApiKey } = useWallet();

  return useQuery({
    queryKey: ['transactionHistory', address, etherscanApiKey],
    queryFn: async () => {
      if (!etherscanApiKey) return null;
      try {
        const transactions = await fetchTransactions(address, etherscanApiKey);
        return transformTransactionsForChart(transactions);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error fetching transaction history';
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        throw error;
      }
    },
    enabled: !!address && !!etherscanApiKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useNetworksData = (address: string) => {
  const { etherscanApiKey } = useWallet();

  return useQuery({
    queryKey: ['networksData', address, etherscanApiKey],
    queryFn: async () => {
      if (!etherscanApiKey) return null;
      try {
        const transactions = await fetchTransactions(address, etherscanApiKey);
        return getNetworkStats(transactions);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error fetching network data';
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        throw error;
      }
    },
    enabled: !!address && !!etherscanApiKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRecentTransactions = (address: string) => {
  const { etherscanApiKey } = useWallet();

  return useQuery({
    queryKey: ['recentTransactions', address, etherscanApiKey],
    queryFn: async () => {
      if (!etherscanApiKey) return null;
      try {
        const txs = await fetchTransactions(address, etherscanApiKey);
        return txs.slice(0, 10).map(tx => ({
          id: tx.hash,
          hash: tx.hash,
          network: 'Ethereum', // In a real app, determine this from chain ID
          amount: `${parseFloat(tx.value) / 1e18} ETH`,
          timestamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleTimeString(),
          status: parseInt(tx.confirmations) > 12 ? 'confirmed' : 'pending' as 'confirmed' | 'pending', // Fixed type
          type: isZkTransaction(tx) ? 'zk' : 'regular' as 'zk' | 'regular',
        }));
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error fetching recent transactions';
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        throw error;
      }
    },
    enabled: !!address && !!etherscanApiKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStatsData = (address: string) => {
  const { etherscanApiKey } = useWallet();

  return useQuery({
    queryKey: ['statsData', address, etherscanApiKey],
    queryFn: async () => {
      if (!etherscanApiKey) return null;
      try {
        const txs = await fetchTransactions(address, etherscanApiKey);
        const zkTxs = txs.filter(tx => isZkTransaction(tx));
        
        // Calculate statistics
        const total = zkTxs.length;
        const dailyAvg = Math.round(total / 30); // Assuming 30 days of data
        const percentage = ((zkTxs.length / txs.length) * 100).toFixed(1);
        
        // Calculate average confirmation time (simulation)
        const avgConfirmationTime = '2.1s'; // In a real app, calculate from actual data
        
        return {
          totalZkTransactions: total.toLocaleString(),
          dailyZkTransactions: dailyAvg.toLocaleString(),
          zkPercentage: `${percentage}%`,
          avgConfirmationTime: avgConfirmationTime,
        };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error fetching stats data';
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
        throw error;
      }
    },
    enabled: !!address && !!etherscanApiKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
