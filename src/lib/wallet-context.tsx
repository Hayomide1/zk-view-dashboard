
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

interface WalletContextType {
  walletAddress: string;
  setWalletAddress: (address: string) => void;
  etherscanApiKey: string;
  setEtherscanApiKey: (key: string) => void;
}

const WalletContext = createContext<WalletContextType>({
  walletAddress: '',
  setWalletAddress: () => {},
  etherscanApiKey: '',
  setEtherscanApiKey: () => {},
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

  // Persist API key to localStorage when it changes
  React.useEffect(() => {
    if (etherscanApiKey) {
      localStorage.setItem('etherscanApiKey', etherscanApiKey);
    }
  }, [etherscanApiKey]);

  return (
    <WalletContext.Provider value={{ 
      walletAddress, 
      setWalletAddress, 
      etherscanApiKey, 
      setEtherscanApiKey 
    }}>
      {children}
    </WalletContext.Provider>
  );
};
