// transaction.model.ts
export type TransactionType = 'deposit' | 'withdraw' | 'admin';
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

export interface Transaction {
  hash: string;
  type: TransactionType;
  amount: string;
  timestamp: Date;
  status: TransactionStatus;
  from: string;
}

// wallet.model.ts
export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string | null;
  isAdmin: boolean;
}

export const SUPPORTED_CHAIN_ID = 11155111; // Sepolia testnet
export const SUPPORTED_CHAIN_NAME = 'Sepolia';
