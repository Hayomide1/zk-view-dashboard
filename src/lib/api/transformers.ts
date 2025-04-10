
import { EtherscanTransaction, TransactionData, NetworkData, Transaction } from './types';
import { isZkTransaction } from './fetchers';

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

// Format transactions for UI display
export const formatTransactions = (transactions: EtherscanTransaction[]): Transaction[] => {
  return transactions.slice(0, 10).map(tx => ({
    id: tx.hash,
    hash: tx.hash,
    network: 'Ethereum', // In a real app, determine this from chain ID
    amount: `${parseFloat(tx.value) / 1e18} ETH`,
    timestamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleTimeString(),
    status: parseInt(tx.confirmations) > 12 ? 'confirmed' : 'pending' as 'confirmed' | 'pending',
    type: isZkTransaction(tx) ? 'zk' : 'regular' as 'zk' | 'regular',
  }));
};
