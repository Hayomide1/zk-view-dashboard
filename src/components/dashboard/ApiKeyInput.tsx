
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Check, AlertCircle } from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';
import { toast } from '@/hooks/use-toast';

export const ApiKeyInput = () => {
  const { etherscanApiKey, setEtherscanApiKey } = useWallet();
  const [inputKey, setInputKey] = useState(etherscanApiKey);

  const saveApiKey = () => {
    if (!inputKey || inputKey.trim() === '') {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setEtherscanApiKey(inputKey.trim());
    toast({
      title: "API Key Saved",
      description: "Your Etherscan API key has been saved",
    });
  };

  return (
    <Card className="glass-card mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" /> 
          Etherscan API Key
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!etherscanApiKey ? (
          <Alert className="bg-amber-500/10 border-amber-500/50">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription>
              Enter your Etherscan API key to fetch real ZK transaction data
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-green-500/10 border-green-500/50">
            <Check className="h-4 w-4 text-green-500" />
            <AlertDescription>
              API key is set and ready to fetch real data
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Input 
            type="password"
            placeholder="Enter your Etherscan API key" 
            value={inputKey} 
            onChange={(e) => setInputKey(e.target.value)}
            className="flex-1"
          />
          <Button onClick={saveApiKey}>Save</Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Don't have an API key? <a href="https://etherscan.io/myapikey" target="_blank" rel="noopener noreferrer" className="text-zkpurple hover:underline">
            Get one from Etherscan
          </a>
        </p>
      </CardContent>
    </Card>
  );
};
