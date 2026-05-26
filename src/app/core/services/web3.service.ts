import { Injectable, signal } from '@angular/core';
import { ethers } from 'ethers';
import { WalletState, SUPPORTED_CHAIN_ID } from '../../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  walletState = signal<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    balance: null,
    isAdmin: false
  });

  get currentProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }

  get currentSigner(): ethers.Signer | null {
    return this.signer;
  }

  isMetaMaskAvailable(): boolean {
    return typeof window !== 'undefined' && !!(window as any).ethereum;
  }

  async connectWallet(): Promise<string> {
    if (!this.isMetaMaskAvailable()) {
      throw new Error('MetaMask not found. Please install it.');
    }

    const ethereum = (window as any).ethereum;
    this.provider = new ethers.BrowserProvider(ethereum);
    const accounts: string[] = await this.provider.send('eth_requestAccounts', []);

    if (!accounts.length) throw new Error('No accounts found.');

    this.signer = await this.provider.getSigner();
    const network = await this.provider.getNetwork();
    const balance = await this.provider.getBalance(accounts[0]);

    this.walletState.set({
      address: accounts[0],
      isConnected: true,
      chainId: Number(network.chainId),
      balance: ethers.formatEther(balance),
      isAdmin: false
    });

    this.listenToAccountChanges();
    this.listenToChainChanges();

    return accounts[0];
  }

  async disconnectWallet(): Promise<void> {
    this.provider = null;
    this.signer = null;
    this.walletState.set({
      address: null,
      isConnected: false,
      chainId: null,
      balance: null,
      isAdmin: false
    });
  }

  isCorrectNetwork(): boolean {
    return this.walletState().chainId === SUPPORTED_CHAIN_ID;
  }

  async switchToSupportedNetwork(): Promise<void> {
    const ethereum = (window as any).ethereum;
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x' + SUPPORTED_CHAIN_ID.toString(16) }]
    });
  }

  setAdminStatus(isAdmin: boolean): void {
    this.walletState.update(s => ({ ...s, isAdmin }));
  }

  private listenToAccountChanges(): void {
    (window as any).ethereum.on('accountsChanged', async (accounts: string[]) => {
      if (!accounts.length) {
        await this.disconnectWallet();
      } else {
        this.walletState.update(s => ({ ...s, address: accounts[0] }));
      }
    });
  }

  private listenToChainChanges(): void {
    (window as any).ethereum.on('chainChanged', () => window.location.reload());
  }
}
