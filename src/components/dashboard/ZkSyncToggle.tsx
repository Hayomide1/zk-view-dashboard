
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Zap, CircleDot } from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';
import { toast } from '@/hooks/use-toast';

export const ZkSyncToggle = () => {
  const { useZkSync, setUseZkSync, zkSyncNetwork, setZkSyncNetwork } = useWallet();

  const handleToggleChange = (checked: boolean) => {
    setUseZkSync(checked);
    toast({
      title: checked ? "zkSync API Enabled" : "Etherscan API Enabled",
      description: checked 
        ? "Viewing zkSync transactions only" 
        : "Viewing all Ethereum transactions with ZK detection",
    });
  };

  const handleNetworkChange = (value: string) => {
    setZkSyncNetwork(value as 'mainnet' | 'testnet');
    toast({
      title: `zkSync ${value.charAt(0).toUpperCase() + value.slice(1)} Selected`,
      description: `Switched to zkSync ${value} network`,
    });
  };

  return (
    <Card className="glass-card mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" /> 
          zkSync Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="zksync-toggle" className="flex items-center gap-2">
            <CircleDot className="h-4 w-4 text-zkpurple" />
            Use zkSync API
          </Label>
          <Switch
            id="zksync-toggle"
            checked={useZkSync}
            onCheckedChange={handleToggleChange}
          />
        </div>
        
        {useZkSync && (
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="zksync-network">zkSync Network</Label>
            <Select 
              value={zkSyncNetwork} 
              onValueChange={handleNetworkChange}
            >
              <SelectTrigger id="zksync-network" className="w-40">
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mainnet">Mainnet</SelectItem>
                <SelectItem value="testnet">Testnet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          zkSync is a Layer 2 scaling solution that uses zero-knowledge proofs. By toggling this on, you'll see only zkSync transactions.
        </p>
      </CardContent>
    </Card>
  );
};
