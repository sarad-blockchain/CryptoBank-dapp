import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContractService } from '../../core/services/contract.service';
import { Web3Service } from '../../core/services/web3.service';
import { EtherPipe } from '../../shared/pipes/ether.pipe';
import { ethers } from 'ethers';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, EtherPipe],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.scss'
})
export class DepositComponent implements OnInit {
  contract = inject(ContractService);
  web3 = inject(Web3Service);

  amount = '';
  success = false;

  ngOnInit(): void {
    this.contract.loadBankState();
  }

  get maxDepositable(): string {
    const state = this.contract.bankState();
    const remaining = state.maxBalance - state.userBalance;
    if (remaining <= 0n) return '0';
    return parseFloat(ethers.formatEther(remaining)).toFixed(4);
  }

  get isAmountValid(): boolean {
    const val = parseFloat(this.amount);
    return !isNaN(val) && val > 0 && val <= parseFloat(this.maxDepositable);
  }

  setMax(): void {
    this.amount = this.maxDepositable;
  }

  async deposit(): Promise<void> {
    if (!this.isAmountValid) return;
    this.success = false;
    await this.contract.depositEther(this.amount);
    if (!this.contract.error()) {
      this.success = true;
      this.amount = '';
    }
  }
}
