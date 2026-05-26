import { Routes } from '@angular/router';
import { walletGuard } from './guards/wallet.guard';
import { adminGuard } from './guards/wallet.guard';
import { networkGuard } from './guards/wallet.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [walletGuard, networkGuard]
  },
  {
    path: 'deposit',
    loadComponent: () =>
      import('./features/deposit/deposit.component').then(m => m.DepositComponent),
    canActivate: [walletGuard, networkGuard]
  },
  {
    path: 'withdraw',
    loadComponent: () =>
      import('./features/withdraw/withdraw.component').then(m => m.WithdrawComponent),
    canActivate: [walletGuard, networkGuard]
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [walletGuard, networkGuard, adminGuard]
  },
  { path: '**', redirectTo: '' }
];
