
import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { NetworkList } from '@/components/dashboard/NetworkList';
import { ZKTransactionsChart } from '@/components/dashboard/ZKTransactionsChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { ApiKeyInput } from '@/components/dashboard/ApiKeyInput';
import { ZkSyncToggle } from '@/components/dashboard/ZkSyncToggle';
import { Clock, Zap, Activity, BarChart3, RefreshCw } from 'lucide-react';
import { useTransactionHistory, useNetworksData, useRecentTransactions, useStatsData } from '@/lib/api';
import { 
  useZkSyncTransactionHistory, 
  useZkSyncNetworksData, 
  useZkSyncRecentTransactions, 
  useZkSyncStatsData 
} from '@/lib/zksync-api';
import { useWallet } from '@/lib/wallet-context';
import { 
  generateTransactionHistoryData, 
  getNetworksData, 
  getRecentTransactions, 
  getStatsData 
} from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { walletAddress, etherscanApiKey, useZkSync } = useWallet();
  
  // Etherscan API queries
  const { 
    data: etherscanTransactionHistory, 
    isLoading: isLoadingEthHistory,
    refetch: refetchEthHistory,
    isError: isErrorEthHistory,
  } = useTransactionHistory(walletAddress);
  
  const { 
    data: etherscanNetworksData, 
    isLoading: isLoadingEthNetworks,
    refetch: refetchEthNetworks,
    isError: isErrorEthNetworks,
  } = useNetworksData(walletAddress);
  
  const { 
    data: etherscanRecentTransactions, 
    isLoading: isLoadingEthTransactions,
    refetch: refetchEthTransactions,
    isError: isErrorEthTransactions,
  } = useRecentTransactions(walletAddress);
  
  const { 
    data: etherscanStatsData, 
    isLoading: isLoadingEthStats,
    refetch: refetchEthStats,
    isError: isErrorEthStats,
  } = useStatsData(walletAddress);

  // zkSync API queries
  const { 
    data: zkSyncTransactionHistory, 
    isLoading: isLoadingZkHistory,
    refetch: refetchZkHistory,
    isError: isErrorZkHistory,
  } = useZkSyncTransactionHistory(walletAddress);
  
  const { 
    data: zkSyncNetworksData, 
    isLoading: isLoadingZkNetworks,
    refetch: refetchZkNetworks,
    isError: isErrorZkNetworks,
  } = useZkSyncNetworksData(walletAddress);
  
  const { 
    data: zkSyncRecentTransactions, 
    isLoading: isLoadingZkTransactions,
    refetch: refetchZkTransactions,
    isError: isErrorZkTransactions,
  } = useZkSyncRecentTransactions(walletAddress);
  
  const { 
    data: zkSyncStatsData, 
    isLoading: isLoadingZkStats,
    refetch: refetchZkStats,
    isError: isErrorZkStats,
  } = useZkSyncStatsData(walletAddress);

  const refreshAllData = () => {
    if (useZkSync) {
      toast({
        title: "Refreshing zkSync Data",
        description: "Fetching the latest zkSync blockchain data...",
      });
      refetchZkHistory();
      refetchZkNetworks();
      refetchZkTransactions();
      refetchZkStats();
    } else {
      if (!etherscanApiKey) {
        toast({
          title: "API Key Required",
          description: "Please enter your Etherscan API key to fetch real data",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Refreshing Etherscan Data",
        description: "Fetching the latest blockchain data...",
      });
      refetchEthHistory();
      refetchEthNetworks();
      refetchEthTransactions();
      refetchEthStats();
    }
  };
  
  // Determine which data to display based on the selected API
  const isLoadingHistory = useZkSync ? isLoadingZkHistory : isLoadingEthHistory;
  const isLoadingNetworks = useZkSync ? isLoadingZkNetworks : isLoadingEthNetworks;
  const isLoadingTransactions = useZkSync ? isLoadingZkTransactions : isLoadingEthTransactions;
  const isLoadingStats = useZkSync ? isLoadingZkStats : isLoadingEthStats;
  
  const isErrorHistory = useZkSync ? isErrorZkHistory : isErrorEthHistory;
  const isErrorNetworks = useZkSync ? isErrorZkNetworks : isErrorEthNetworks;
  const isErrorTransactions = useZkSync ? isErrorZkTransactions : isErrorEthTransactions;
  const isErrorStats = useZkSync ? isErrorZkStats : isErrorEthStats;
  
  // Fall back to mock data if API data is loading or there's an error
  const displayTransactionHistory = useZkSync 
    ? (isLoadingZkHistory || isErrorZkHistory ? generateTransactionHistoryData() : zkSyncTransactionHistory || generateTransactionHistoryData())
    : (!etherscanApiKey || isLoadingEthHistory || isErrorEthHistory ? generateTransactionHistoryData() : etherscanTransactionHistory || generateTransactionHistoryData());

  const displayNetworksData = useZkSync
    ? (isLoadingZkNetworks || isErrorZkNetworks ? getNetworksData() : zkSyncNetworksData || getNetworksData())
    : (!etherscanApiKey || isLoadingEthNetworks || isErrorEthNetworks ? getNetworksData() : etherscanNetworksData || getNetworksData());

  const displayRecentTransactions = useZkSync
    ? (isLoadingZkTransactions || isErrorZkTransactions ? getRecentTransactions() : zkSyncRecentTransactions || getRecentTransactions())
    : (!etherscanApiKey || isLoadingEthTransactions || isErrorEthTransactions ? getRecentTransactions() : etherscanRecentTransactions || getRecentTransactions());

  const displayStatsData = useZkSync
    ? (isLoadingZkStats || isErrorZkStats ? getStatsData() : zkSyncStatsData || getStatsData())
    : (!etherscanApiKey || isLoadingEthStats || isErrorEthStats ? getStatsData() : etherscanStatsData || getStatsData());
  
  // Are we showing real or mock data?
  const usingMockData = useZkSync
    ? (isErrorZkHistory || isErrorZkNetworks || isErrorZkTransactions || isErrorZkStats)
    : (!etherscanApiKey || isErrorEthHistory || isErrorEthNetworks || isErrorEthTransactions || isErrorEthStats);
  
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">ZK Transaction Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2" 
              onClick={refreshAllData}
              disabled={(!etherscanApiKey && !useZkSync) || isLoadingHistory || isLoadingNetworks || isLoadingTransactions || isLoadingStats}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">
                Last updated: <span className="text-foreground font-mono">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className={`h-2 w-2 rounded-full animate-pulse-slow ${usingMockData ? "bg-amber-500" : "bg-emerald-500"}`}></div>
            </div>
          </div>
        </div>

        {/* API Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ZkSyncToggle />
          {!useZkSync && <ApiKeyInput />}
        </div>
        
        {usingMockData && (
          <div className="text-sm text-center py-2 bg-amber-500/10 border border-amber-500/30 rounded-md">
            {useZkSync 
              ? "Displaying mock data. zkSync API may be experiencing issues."
              : "Displaying mock data. Enter an Etherscan API key above to view real blockchain data."}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total ZK Transactions" 
            value={displayStatsData?.totalZkTransactions || '0'} 
            icon={Zap}
            trend="up"
            trendValue="12.3% this month"
          />
          <StatCard 
            title="Daily ZK Transactions" 
            value={displayStatsData?.dailyZkTransactions || '0'} 
            icon={Activity}
            trend="up"
            trendValue="8.7% vs yesterday"
          />
          <StatCard 
            title="ZK % of Total" 
            value={displayStatsData?.zkPercentage || '0%'} 
            icon={BarChart3}
            trend="up"
            trendValue="2.1% increase"
          />
          <StatCard 
            title="Avg. Confirmation Time" 
            value={displayStatsData?.avgConfirmationTime || '0s'} 
            icon={Clock}
            trend="down"
            trendValue="0.8s faster"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ZKTransactionsChart data={displayTransactionHistory || []} />
          </div>
          <div>
            <NetworkList networks={displayNetworksData || []} />
          </div>
        </div>
        
        <div>
          <RecentTransactions transactions={displayRecentTransactions || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
