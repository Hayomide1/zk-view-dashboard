
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Transaction = {
  id: string;
  hash: string;
  network: string;
  amount: string;
  timestamp: string;
  status: 'confirmed' | 'pending';
  type: 'zk' | 'regular';
};

type RecentTransactionsProps = {
  transactions: Transaction[];
};

export const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  tx.type === 'zk' ? "bg-zkpurple/20" : "bg-zkteal/20"
                )}>
                  {tx.type === 'zk' ? (
                    <Zap className="h-4 w-4 text-zkpurple" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-zkteal" />
                  )}
                </div>
                <div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {tx.hash.substring(0, 6)}...{tx.hash.substring(tx.hash.length - 4)}
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <span>{tx.network}</span>
                    <span className="text-muted-foreground">{tx.amount}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Badge variant={tx.status === 'confirmed' ? 'outline' : 'secondary'} className="text-xs">
                  {tx.status}
                </Badge>
                <span className="text-xs text-muted-foreground mt-1">{tx.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
