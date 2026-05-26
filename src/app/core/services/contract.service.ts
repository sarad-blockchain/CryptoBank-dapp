import { Injectable, inject, signal } from '@angular/core';
import { ethers } from 'ethers';
import { Web3Service } from './web3.service';
import { environment } from '../../../environments/environment';
import { BankState } from '../../models/bank.model';
import { Transaction } from '../../models/transaction.model';
import CRYPTOBANK_ABI from '../../abi/cryptobank.abi.json';

@Injectable({ providedIn: 'root' })
export class ContractService {
  private web3 = inject(Web3Service);
  private contract: ethers.Contract | null = null;

  bankState = signal<BankState>({
    maxBalance: 0n,
    userBalance: 0n,
    adminAddress: '',
    contractAddress: environment.contractAddress
  });

  transactions = signal<Transaction[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  private getContract(withSigner = false): ethers.Contract {
    const provider = withSigner
      ? this.web3.currentSigner
      : this.web3.currentProvider;

    if (!provider) throw new Error('Wallet not connected');

    return new ethers.Contract(
      environment.contractAddress,
      CRYPTOBANK_ABI,
      provider
    );
  }

  async loadBankState(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const contract = this.getContract();
      const address = this.web3.walletState().address;
      if (!address) throw new Error('No wallet address');

      const [maxBalance, userBalance, adminAddress] = await Promise.all([
        contract['MaxBalance'](),
        contract['UserBalance'](address),
        contract['admin']()
      ]);

      this.bankState.set({
        maxBalance,
        userBalance,
        adminAddress,
        contractAddress: environment.contractAddress
      });

      const isAdmin = adminAddress.toLowerCase() === address.toLowerCase();
      this.web3.setAdminStatus(isAdmin);
    } catch (e: any) {
      this.error.set(e.message || 'Error loading bank state');
    } finally {
      this.isLoading.set(false);
    }
  }

  async depositEther(amountEth: string): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const contract = this.getContract(true);
      const value = ethers.parseEther(amountEth);
      const tx = await contract['DepositEther']({ value });
      this.addTransaction(tx.hash, 'deposit', amountEth, 'pending');
      await tx.wait();
      this.updateTransactionStatus(tx.hash, 'confirmed');
      await this.loadBankState();
    } catch (e: any) {
      this.error.set(e.reason || e.message || 'Deposit failed');
    } finally {
      this.isLoading.set(false);
    }
  }

  async withdrawEther(amountEth: string): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const contract = this.getContract(true);
      const amount = ethers.parseEther(amountEth);
      const tx = await contract['WithDrawEther'](amount);
      this.addTransaction(tx.hash, 'withdraw', amountEth, 'pending');
      await tx.wait();
      this.updateTransactionStatus(tx.hash, 'confirmed');
      await this.loadBankState();
    } catch (e: any) {
      this.error.set(e.reason || e.message || 'Withdrawal failed');
    } finally {
      this.isLoading.set(false);
    }
  }

  async modifyMaxBalance(newMaxEth: string): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const contract = this.getContract(true);
      const newMax = ethers.parseEther(newMaxEth);
      const tx = await contract['ModifyMaxBalance'](newMax);
      this.addTransaction(tx.hash, 'admin', newMaxEth, 'pending');
      await tx.wait();
      this.updateTransactionStatus(tx.hash, 'confirmed');
      await this.loadBankState();
    } catch (e: any) {
      this.error.set(e.reason || e.message || 'Admin action failed');
    } finally {
      this.isLoading.set(false);
    }
  }

  private addTransaction(
    hash: string,
    type: Transaction['type'],
    amount: string,
    status: Transaction['status']
  ): void {
    const tx: Transaction = {
      hash,
      type,
      amount,
      timestamp: new Date(),
      status,
      from: this.web3.walletState().address || ''
    };
    this.transactions.update(txs => [tx, ...txs]);
  }

  private updateTransactionStatus(hash: string, status: Transaction['status']): void {
    this.transactions.update(txs =>
      txs.map(tx => tx.hash === hash ? { ...tx, status } : tx)
    );
  }
}
