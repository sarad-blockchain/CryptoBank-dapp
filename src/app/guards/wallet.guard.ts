// wallet.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Web3Service } from '../core/services/web3.service';

export const walletGuard = () => {
  const web3 = inject(Web3Service);
  const router = inject(Router);
  if (web3.walletState().isConnected) return true;
  return router.createUrlTree(['/']);
};

// admin.guard.ts
export const adminGuard = () => {
  const web3 = inject(Web3Service);
  const router = inject(Router);
  if (web3.walletState().isAdmin) return true;
  return router.createUrlTree(['/dashboard']);
};

// network.guard.ts
export const networkGuard = () => {
  const web3 = inject(Web3Service);
  const router = inject(Router);
  if (web3.isCorrectNetwork()) return true;
  return router.createUrlTree(['/wrong-network']);
};
