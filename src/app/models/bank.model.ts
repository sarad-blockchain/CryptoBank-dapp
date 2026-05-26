// bank.model.ts
export interface BankState {
  maxBalance: bigint;
  userBalance: bigint;
  adminAddress: string;
  contractAddress: string;
}

export interface BankStats {
  maxBalanceEth: string;
  userBalanceEth: string;
  remainingCapacity: string;
  utilizationPercent: number;
}
