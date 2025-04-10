
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '../wallet-context';
import { toast } from '@/hooks/use-toast';
import { fetchTransactions } from './fetchers';
import { transformTransactionsForChart, getNetworkStats, formatTransactions } from './transformers';

// React Query hooks for fetching transaction data
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
        return formatTransactions(txs);
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
