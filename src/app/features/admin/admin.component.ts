import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContractService } from '../../core/services/contract.service';
import { Web3Service } from '../../core/services/web3.service';
import { EtherPipe } from '../../shared/pipes/ether.pipe';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, EtherPipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  contract = inject(ContractService);
  web3 = inject(Web3Service);

  newMaxBalance = '';
  success = false;

  ngOnInit(): void {
    this.contract.loadBankState();
  }

  get isValid(): boolean {
    const val = parseFloat(this.newMaxBalance);
    return !isNaN(val) && val > 0;
  }

  async updateMaxBalance(): Promise<void> {
    if (!this.isValid) return;
    this.success = false;
    await this.contract.modifyMaxBalance(this.newMaxBalance);
    if (!this.contract.error()) {
      this.success = true;
      this.newMaxBalance = '';
    }
  }
}
