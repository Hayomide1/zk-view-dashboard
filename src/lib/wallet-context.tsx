
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  walletAddress: string;
  setWalletAddress: (address: string) => void;
}

const WalletContext = createContext<WalletContextType>({
  walletAddress: '',
  setWalletAddress: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  // Default to a known address with many transactions for demo purposes
  // In a real app, this would come from a wallet connection
  const [walletAddress, setWalletAddress] = useState('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'); // Vitalik's address

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};
