
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type NetworkItem = {
  id: string;
  name: string;
  zkTransactions: number;
  totalTransactions: number;
  color: string;
};

type NetworkListProps = {
  networks: NetworkItem[];
};

export const NetworkList = ({ networks }: NetworkListProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg">Network Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {networks.map((network) => {
          const percentage = (network.zkTransactions / network.totalTransactions) * 100;
          
          return (
            <div key={network.id} className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{network.name}</span>
                <span className="text-sm text-muted-foreground">
                  {network.zkTransactions.toLocaleString()} / {network.totalTransactions.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={percentage} 
                className="h-2"
                indicatorClassName={`bg-${network.color}`}
              />
              <div className="text-xs text-muted-foreground">
                {percentage.toFixed(1)}% ZK Transactions
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
