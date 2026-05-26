import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Web3Service } from '../../core/services/web3.service';
import { ContractService } from '../../core/services/contract.service';
import { EtherPipe } from '../../shared/pipes/ether.pipe';
import { ethers } from 'ethers';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, EtherPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  web3 = inject(Web3Service);
  contract = inject(ContractService);

  ngOnInit(): void {
    if (this.web3.walletState().isConnected) {
      this.contract.loadBankState();
    }
  }

  async connect(): Promise<void> {
    await this.web3.connectWallet();
    await this.contract.loadBankState();
  }

  get utilizationPercent(): number {
    const state = this.contract.bankState();
    if (!state.maxBalance) return 0;
    return Math.min(100, Number(
      (state.userBalance * 100n) / state.maxBalance
    ));
  }

  get utilizationClass(): string {
    const pct = this.utilizationPercent;
    if (pct >= 90) return 'danger';
    if (pct >= 60) return 'warning';
    return '';
  }

  get explorerUrl(): string {
    return `https://sepolia.etherscan.io/address/${this.contract.bankState().contractAddress}`;
  }

  formatEth(wei: bigint): string {
    return parseFloat(ethers.formatEther(wei)).toFixed(4);
  }
}
