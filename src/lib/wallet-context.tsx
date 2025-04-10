
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

interface WalletContextType {
  walletAddress: string;
  setWalletAddress: (address: string) => void;
  etherscanApiKey: string;
  setEtherscanApiKey: (key: string) => void;
  useZkSync: boolean;
  setUseZkSync: (use: boolean) => void;
  zkSyncNetwork: 'mainnet' | 'testnet';
  setZkSyncNetwork: (network: 'mainnet' | 'testnet') => void;
}

const WalletContext = createContext<WalletContextType>({
  walletAddress: '',
  setWalletAddress: () => {},
  etherscanApiKey: '',
  setEtherscanApiKey: () => {},
  useZkSync: false,
  setUseZkSync: () => {},
  zkSyncNetwork: 'mainnet',
  setZkSyncNetwork: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  // Default to a known address with many transactions for demo purposes
  const [walletAddress, setWalletAddress] = useState('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'); // Vitalik's address
  
  // API key state - will be empty by default and need to be set by the user
  const [etherscanApiKey, setEtherscanApiKey] = useState(() => {
    // Try to load from localStorage if available
    const savedKey = localStorage.getItem('etherscanApiKey');
    return savedKey || '';
  });

  // zkSync integration settings
  const [useZkSync, setUseZkSync] = useState(() => {
    const savedPreference = localStorage.getItem('useZkSync');
    return savedPreference ? JSON.parse(savedPreference) : false;
  });
  
  const [zkSyncNetwork, setZkSyncNetwork] = useState<'mainnet' | 'testnet'>(() => {
    const savedNetwork = localStorage.getItem('zkSyncNetwork');
    return (savedNetwork as 'mainnet' | 'testnet') || 'mainnet';
  });

  // Persist API key to localStorage when it changes
  React.useEffect(() => {
    if (etherscanApiKey) {
      localStorage.setItem('etherscanApiKey', etherscanApiKey);
    }
  }, [etherscanApiKey]);

  // Persist zkSync settings to localStorage
  React.useEffect(() => {
    localStorage.setItem('useZkSync', JSON.stringify(useZkSync));
  }, [useZkSync]);

  React.useEffect(() => {
    localStorage.setItem('zkSyncNetwork', zkSyncNetwork);
  }, [zkSyncNetwork]);

  return (
    <WalletContext.Provider value={{ 
      walletAddress, 
      setWalletAddress, 
      etherscanApiKey, 
      setEtherscanApiKey,
      useZkSync,
      setUseZkSync,
      zkSyncNetwork,
      setZkSyncNetwork
    }}>
      {children}
    </WalletContext.Provider>
  );
};
