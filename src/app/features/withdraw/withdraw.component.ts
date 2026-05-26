import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContractService } from '../../core/services/contract.service';
import { EtherPipe } from '../../shared/pipes/ether.pipe';
import { ethers } from 'ethers';

@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, EtherPipe],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.scss'
})
export class WithdrawComponent implements OnInit {
  contract = inject(ContractService);

  amount = '';
  success = false;

  ngOnInit(): void {
    this.contract.loadBankState();
  }

  get maxWithdrawable(): string {
    const bal = this.contract.bankState().userBalance;
    if (!bal) return '0';
    return parseFloat(ethers.formatEther(bal)).toFixed(4);
  }

  get isAmountValid(): boolean {
    const val = parseFloat(this.amount);
    return !isNaN(val) && val > 0 && val <= parseFloat(this.maxWithdrawable);
  }

  setMax(): void {
    this.amount = this.maxWithdrawable;
  }

  async withdraw(): Promise<void> {
    if (!this.isAmountValid) return;
    this.success = false;
    await this.contract.withdrawEther(this.amount);
    if (!this.contract.error()) {
      this.success = true;
      this.amount = '';
    }
  }
}
