
import { ETHERSCAN_BASE_URL } from './constants';
import { EtherscanTransaction } from './types';

// Function to identify if a transaction is likely a ZK transaction
export const isZkTransaction = (transaction: EtherscanTransaction): boolean => {
  // Check if the input data suggests a ZK proof (simplified check)
  return transaction.input.length > 1000; // ZK proofs tend to have long input data
};

// Fetch transactions from Etherscan API
export const fetchTransactions = async (address: string, apiKey: string, startBlock = '0', endBlock = '99999999') => {
  if (!apiKey) {
    throw new Error('Etherscan API key is required');
  }

  const url = `${ETHERSCAN_BASE_URL}?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=desc&apikey=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.status !== '1') {
      throw new Error(data.message || `Etherscan API error: ${data.result}`);
    }
    
    return data.result as EtherscanTransaction[];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};
