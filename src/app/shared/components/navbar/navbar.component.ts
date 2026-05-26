import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Web3Service } from '../../../core/services/web3.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  web3 = inject(Web3Service);

  async connect(): Promise<void> {
    try {
      await this.web3.connectWallet();
    } catch (e: any) {
      console.error('Connection failed:', e.message);
    }
  }

  async disconnect(): Promise<void> {
    await this.web3.disconnectWallet();
  }

  get shortAddress(): string {
    const addr = this.web3.walletState().address;
    if (!addr) return '';
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  }
}
