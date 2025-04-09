
import { useQuery } from '@tanstack/react-query';

// Your Etherscan API key would typically come from an environment variable
// For demo purposes, we're using a placeholder
const ETHERSCAN_API_KEY = 'YOUR_ETHERSCAN_API_KEY';
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

interface TransactionData {
  date: string;
  zkTransactions: number;
  regularTransactions: number;
}

interface NetworkData {
  id: string;
  name: string;
  zkTransactions: number;
  totalTransactions: number;
  color: string;
}

// Function to identify if a transaction is likely a ZK transaction
// This is a simplified heuristic - in a real app, you might have a more complex criteria
// or use specific contract addresses known to be ZK rollups
const isZkTransaction = (transaction: EtherscanTransaction): boolean => {
  // Check if the input data suggests a ZK proof (simplified check)
  // In reality, you'd check for specific contract addresses or other properties
  return transaction.input.length > 1000; // ZK proofs tend to have long input data
};

// Fetch transactions from Etherscan API
export const fetchTransactions = async (address: string, startBlock = '0', endBlock = '99999999') => {
  const url = `${ETHERSCAN_BASE_URL}?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    const data = await response.json();
    if (data.status !== '1') {
      throw new Error(data.message || 'Etherscan API error');
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
  // In a real app, you'd determine the network from transaction data or chain ID
  const networks = [
    { id: '1', name: 'Ethereum', color: 'zkpurple', txs: [] },
    { id: '2', name: 'Polygon', color: 'zkteal', txs: [] },
    { id: '3', name: 'Optimism', color: 'rose-500', txs: [] },
    { id: '4', name: 'Arbitrum', color: 'blue-500', txs: [] },
  ];
  
  // In a real app, you'd assign transactions to networks based on chain ID or other criteria
  // For this demo, we're randomly distributing transactions across networks
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

// React Query hooks
export const useTransactionHistory = (address: string) => {
  return useQuery({
    queryKey: ['transactionHistory', address],
    queryFn: async () => {
      const transactions = await fetchTransactions(address);
      return transformTransactionsForChart(transactions);
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useNetworksData = (address: string) => {
  return useQuery({
    queryKey: ['networksData', address],
    queryFn: async () => {
      const transactions = await fetchTransactions(address);
      return getNetworkStats(transactions);
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRecentTransactions = (address: string) => {
  return useQuery({
    queryKey: ['recentTransactions', address],
    queryFn: async () => {
      const txs = await fetchTransactions(address);
      return txs.slice(0, 10).map(tx => ({
        id: tx.hash,
        hash: tx.hash,
        network: 'Ethereum', // In a real app, determine this from chain ID
        amount: `${parseFloat(tx.value) / 1e18} ETH`,
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleTimeString(),
        status: parseInt(tx.confirmations) > 12 ? 'confirmed' : 'pending',
        type: isZkTransaction(tx) ? 'zk' : 'regular',
      }));
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStatsData = (address: string) => {
  return useQuery({
    queryKey: ['statsData', address],
    queryFn: async () => {
      const txs = await fetchTransactions(address);
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
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
