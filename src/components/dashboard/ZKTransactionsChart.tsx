
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TransactionData = {
  date: string;
  zkTransactions: number;
  regularTransactions: number;
};

type ZKTransactionsChartProps = {
  data: TransactionData[];
};

export const ZKTransactionsChart = ({ data }: ZKTransactionsChartProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg">Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="zkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9B87F5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9B87F5" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5EEAD4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#5EEAD4" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#9CA3AF' }}
              tickLine={{ stroke: '#4B5563' }}
              axisLine={{ stroke: '#4B5563' }}
            />
            <YAxis 
              tick={{ fill: '#9CA3AF' }}
              tickLine={{ stroke: '#4B5563' }}
              axisLine={{ stroke: '#4B5563' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1e293b',
                borderColor: '#374151',
                borderRadius: '0.375rem'
              }}
              labelStyle={{ color: '#E5E7EB' }}
              itemStyle={{ color: '#E5E7EB' }}
            />
            <Area 
              type="monotone" 
              dataKey="zkTransactions" 
              name="ZK Transactions"
              stroke="#9B87F5" 
              fillOpacity={1} 
              fill="url(#zkGradient)" 
            />
            <Area 
              type="monotone" 
              dataKey="regularTransactions"
              name="Regular Transactions" 
              stroke="#5EEAD4" 
              fillOpacity={1} 
              fill="url(#regGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
