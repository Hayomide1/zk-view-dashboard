
import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { NetworkList } from '@/components/dashboard/NetworkList';
import { ZKTransactionsChart } from '@/components/dashboard/ZKTransactionsChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { Clock, Zap, Activity, BarChart3 } from 'lucide-react';
import { 
  generateTransactionHistoryData, 
  getNetworksData, 
  getRecentTransactions, 
  getStatsData 
} from '@/lib/mock-data';

const Index = () => {
  // In a real app, this would fetch data from an API
  const transactionHistoryData = generateTransactionHistoryData();
  const networksData = getNetworksData();
  const recentTransactions = getRecentTransactions();
  const statsData = getStatsData();
  
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">ZK Transaction Dashboard</h1>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">
              Last updated: <span className="text-foreground font-mono">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="h-2 w-2 rounded-full bg-zkteal animate-pulse-slow"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total ZK Transactions" 
            value={statsData.totalZkTransactions} 
            icon={Zap}
            trend="up"
            trendValue="12.3% this month"
          />
          <StatCard 
            title="Daily ZK Transactions" 
            value={statsData.dailyZkTransactions} 
            icon={Activity}
            trend="up"
            trendValue="8.7% vs yesterday"
          />
          <StatCard 
            title="ZK % of Total" 
            value={statsData.zkPercentage} 
            icon={BarChart3}
            trend="up"
            trendValue="2.1% increase"
          />
          <StatCard 
            title="Avg. Confirmation Time" 
            value={statsData.avgConfirmationTime} 
            icon={Clock}
            trend="down"
            trendValue="0.8s faster"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ZKTransactionsChart data={transactionHistoryData} />
          </div>
          <div>
            <NetworkList networks={networksData} />
          </div>
        </div>
        
        <div>
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
