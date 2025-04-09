
import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { NetworkList } from '@/components/dashboard/NetworkList';
import { ZKTransactionsChart } from '@/components/dashboard/ZKTransactionsChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { ApiKeyInput } from '@/components/dashboard/ApiKeyInput';
import { Clock, Zap, Activity, BarChart3, RefreshCw } from 'lucide-react';
import { useTransactionHistory, useNetworksData, useRecentTransactions, useStatsData } from '@/lib/api';
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
  const { walletAddress, etherscanApiKey } = useWallet();
  
  const { 
    data: transactionHistoryData, 
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
    isError: isErrorHistory,
  } = useTransactionHistory(walletAddress);
  
  const { 
    data: networksData, 
    isLoading: isLoadingNetworks,
    refetch: refetchNetworks,
    isError: isErrorNetworks,
  } = useNetworksData(walletAddress);
  
  const { 
    data: recentTransactions, 
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
    isError: isErrorTransactions,
  } = useRecentTransactions(walletAddress);
  
  const { 
    data: statsData, 
    isLoading: isLoadingStats,
    refetch: refetchStats,
    isError: isErrorStats,
  } = useStatsData(walletAddress);

  const refreshAllData = () => {
    if (!etherscanApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Etherscan API key to fetch real data",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Refreshing Data",
      description: "Fetching the latest blockchain data...",
    });

    refetchHistory();
    refetchNetworks();
    refetchTransactions();
    refetchStats();
  };
  
  // Fall back to mock data if API data is loading or there's an error
  const displayTransactionHistory = !etherscanApiKey || isLoadingHistory || isErrorHistory 
    ? generateTransactionHistoryData() 
    : transactionHistoryData || generateTransactionHistoryData();

  const displayNetworksData = !etherscanApiKey || isLoadingNetworks || isErrorNetworks 
    ? getNetworksData() 
    : networksData || getNetworksData();

  const displayRecentTransactions = !etherscanApiKey || isLoadingTransactions || isErrorTransactions 
    ? getRecentTransactions() 
    : recentTransactions || getRecentTransactions();

  const displayStatsData = !etherscanApiKey || isLoadingStats || isErrorStats 
    ? getStatsData() 
    : statsData || getStatsData();
  
  // Are we showing real or mock data?
  const usingMockData = !etherscanApiKey || isErrorHistory || isErrorNetworks || isErrorTransactions || isErrorStats;
  
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
              disabled={!etherscanApiKey || isLoadingHistory || isLoadingNetworks || isLoadingTransactions || isLoadingStats}
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

        {/* API Key Input */}
        <ApiKeyInput />
        
        {usingMockData && (
          <div className="text-sm text-center py-2 bg-amber-500/10 border border-amber-500/30 rounded-md">
            Displaying mock data. Enter an Etherscan API key above to view real blockchain data.
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
