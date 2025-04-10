
// Types for API responses
export interface EtherscanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  confirmations: string;
}

export interface TransactionData {
  date: string;
  zkTransactions: number;
  regularTransactions: number;
}

export interface NetworkData {
  id: string;
  name: string;
  zkTransactions: number;
  totalTransactions: number;
  color: string;
}

export interface Transaction {
  id: string;
  hash: string;
  network: string;
  amount: string;
  timestamp: string;
  status: 'confirmed' | 'pending';
  type: 'zk' | 'regular';
}
