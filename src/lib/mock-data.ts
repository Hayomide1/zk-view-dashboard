
// Mock data for the ZK Dashboard
import { subHours, format } from 'date-fns';

// Generate transaction history data
export const generateTransactionHistoryData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = subHours(now, i * 8);
    data.push({
      date: format(date, 'MMM dd HH:mm'),
      zkTransactions: Math.floor(Math.random() * 2000) + 1000,
      regularTransactions: Math.floor(Math.random() * 5000) + 3000,
    });
  }
  
  return data;
};

// Networks data
export const getNetworksData = () => [
  {
    id: '1',
    name: 'Ethereum',
    zkTransactions: 25647,
    totalTransactions: 152034,
    color: 'zkpurple',
  },
  {
    id: '2',
    name: 'Polygon',
    zkTransactions: 43210,
    totalTransactions: 178542,
    color: 'zkteal',
  },
  {
    id: '3',
    name: 'Optimism',
    zkTransactions: 18327,
    totalTransactions: 67293,
    color: 'rose-500',
  },
  {
    id: '4',
    name: 'Arbitrum',
    zkTransactions: 31895,
    totalTransactions: 89745,
    color: 'blue-500',
  },
];

// Recent transactions
export const getRecentTransactions = () => {
  const networks = ['Ethereum', 'Polygon', 'Optimism', 'Arbitrum'];
  const statuses = ['confirmed', 'pending'] as const;
  const types = ['zk', 'regular'] as const;
  
  return Array.from({ length: 10 }).map((_, i) => {
    const now = new Date();
    const timestamp = subHours(now, Math.floor(Math.random() * 24));
    
    return {
      id: `tx-${i}`,
      hash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      network: networks[Math.floor(Math.random() * networks.length)],
      amount: `${(Math.random() * 10).toFixed(4)} ETH`,
      timestamp: format(timestamp, 'HH:mm:ss'),
      status: statuses[Math.random() > 0.8 ? 1 : 0],
      type: types[Math.random() > 0.4 ? 0 : 1],
    };
  });
};

// Stats data
export const getStatsData = () => {
  return {
    totalZkTransactions: '289,547',
    dailyZkTransactions: '12,483',
    zkPercentage: '37.2%',
    avgConfirmationTime: '2.4s',
  };
};
