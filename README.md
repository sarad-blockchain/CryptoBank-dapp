<div align="center">

```txt
 ███████╗ ██████╗ ██╗      █████╗ ██████╗ ██╗███████╗
 ██╔════╝██╔═══██╗██║     ██╔══██╗██╔══██╗██║██╔════╝
 ███████╗██║   ██║██║     ███████║██████╔╝██║███████╗
 ╚════██║██║   ██║██║     ██╔══██║██╔══██╗██║╚════██║
 ███████║╚██████╔╝███████╗██║  ██║██║  ██║██║███████║
 ╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝
```

### **Digital Trust Since Tomorrow**

[![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=flat-square&logo=angular)](https://angular.io)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.x-363636?style=flat-square&logo=solidity)](https://soliditylang.org)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?style=flat-square&logo=ethereum)](https://ethereum.org)
[![ethers.js](https://img.shields.io/badge/ethers.js-v6-blue?style=flat-square)](https://ethers.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)

### Full-stack Ethereum Banking dApp  
*Angular · Solidity · Ethers.js · MetaMask · Sepolia Testnet*

</div>

---

## Live Demo

🔗 https://your-demo-url.vercel.app

---

## Smart Contract

🔗 https://sepolia.etherscan.io/address/0x530D75e43753D2bF01b8574446DcC4f7189Da1E9

---

## Overview

**SOLARIS** is a non-custodial Ethereum banking dApp built with Angular 19, Solidity, and ethers.js v6.

The application connects to a `CryptoBank` smart contract deployed on the Ethereum Sepolia testnet, allowing users to securely deposit and withdraw ETH directly through MetaMask while enforcing a per-wallet balance cap entirely on-chain.

The frontend architecture leverages:
- Angular Standalone Components
- Angular Signals API
- Lazy-loaded feature routes
- Functional route guards
- Reactive wallet state management
- Ethers.js smart contract integration

The visual identity combines retro-futuristic banking aesthetics with modern Web3 UX patterns: glowing neon accents, animated SVG coins, scanline textures, and high-contrast typography inspired by 1970s financial advertising.

---

## Features

| Feature | Description |
|---|---|
| **MetaMask Integration** | Connect wallet using EIP-1193 provider |
| **Deposit ETH** | Call `DepositEther()` with real ETH transactions |
| **Withdraw ETH** | Withdraw user balance through smart contract interaction |
| **Admin Dashboard** | Modify global wallet cap via admin-only function |
| **Reactive Wallet State** | Real-time updates using Angular Signals |
| **Network Validation** | Guards app access to Sepolia only |
| **Admin Route Protection** | Restricts `/admin` to contract owner |
| **Session Transaction History** | Local transaction log with Etherscan links |
| **Live Smart Contract Reads** | Reads balances, admin address, and limits directly from chain |
| **Animated UI System** | Floating SVG coins, glow effects, scanlines, neon gradients |

---

## Web3 Features

- EIP-1193 MetaMask provider integration
- Smart contract reads/writes via ethers.js v6
- Ethereum transaction lifecycle handling
- Wallet connection persistence
- Sepolia chain validation
- Non-custodial architecture
- Role-based route protection
- On-chain balance synchronization
- Etherscan transaction linking

---

## Tech Stack

```txt
Frontend   Angular 19 · Standalone Components · Signals API
Language   TypeScript 5.6
Blockchain Solidity · ethers.js v6 · MetaMask
Styling    SCSS · CSS Variables · Responsive Layouts
Fonts      Bebas Neue · DM Sans · Space Mono
Build      Angular CLI 19 · esbuild
Network    Ethereum Sepolia Testnet (11155111)
```

---

## Architecture

```txt
Angular UI
   ↓
Signals State Layer
   ↓
ethers.js v6
   ↓
MetaMask Provider
   ↓
CryptoBank Smart Contract
   ↓
Ethereum Sepolia
```

---

## Project Structure

```txt
src/
├── app/
│   ├── abi/
│   │   └── cryptobank.abi.json
│   │
│   ├── core/
│   │   └── services/
│   │       ├── web3.service.ts
│   │       └── contract.service.ts
│   │
│   ├── features/
│   │   ├── dashboard/
│   │   ├── deposit/
│   │   ├── withdraw/
│   │   └── admin/
│   │
│   ├── guards/
│   │   └── wallet.guard.ts
│   │
│   ├── models/
│   │   ├── bank.model.ts
│   │   └── transaction.model.ts
│   │
│   ├── shared/
│   │   ├── components/navbar/
│   │   └── pipes/ether.pipe.ts
│   │
│   ├── app.routes.ts
│   └── app.component.ts
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
└── styles/
    └── styles.scss
```

---

## Smart Contract Interface

The frontend communicates with a Solidity `CryptoBank` contract through the ABI located at:

```txt
src/app/abi/cryptobank.abi.json
```

### Available Functions

| Function | Type | Description |
|---|---|---|
| `DepositEther()` | payable | Deposits ETH into the bank |
| `WithDrawEther(uint256)` | transaction | Withdraws ETH from user balance |
| `ModifyMaxBalance(uint256)` | admin | Updates global wallet cap |
| `UserBalance(address)` | view | Reads wallet ETH balance |
| `MaxBalance()` | view | Reads current max balance |
| `admin()` | view | Returns contract owner |

---

## Design System

### Color Palette

| Token | Hex |
|---|---|
| `--black` | `#000000` |
| `--violet` | `#7D39EB` |
| `--lime` | `#C6FF33` |
| `--white` | `#FFFFFF` |
| `--violet-light` | `#B07AF5` |

### Typography

| Role | Font |
|---|---|
| Headings | Bebas Neue |
| Body | DM Sans |
| Labels / Addresses | Space Mono |

---

## Angular Architecture Notes

### Standalone Components
The entire application is built without NgModules using Angular Standalone APIs.

### Angular Signals
Reactive state management is handled entirely with Angular Signals for:
- wallet state
- contract state
- loading states
- transactions
- admin detection

### Lazy Loading
Feature routes use `loadComponent()` for optimized code splitting.

### Functional Guards
The application uses functional route guards for:
- wallet connection validation
- admin authorization
- network validation

---

## Environment Configuration

Configure the deployed contract address inside:

```ts
// src/environments/environment.ts

export const environment = {
  production: false,
  contractAddress: '0x530D75e43753D2bF01b8574446DcC4f7189Da1E9',
  supportedChainId: 11155111,
  supportedChainName: 'Sepolia',
  rpcUrl: 'https://rpc.sepolia.org'
};
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Angular CLI 19
- MetaMask browser extension
- Sepolia ETH

---

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/solaris-bank.git

# Enter project directory
cd solaris-bank

# Install dependencies
npm install

# Start development server
npm start
```

Application runs at:

```txt
http://localhost:4200
```

---

## Production Build

```bash
npm run build
```

Build output:

```txt
dist/solaris-bank
```

---

## Future Improvements

- ERC-20 token support
- Transaction persistence
- Multi-network support
- WalletConnect integration
- Account abstraction
- Dark/light dynamic themes
- DeFi staking module
- Smart contract event indexing

---

## License

MIT License

---

<div align="center">

Built on Ethereum with Angular & Solidity

### SOLARIS — Digital Trust Since Tomorrow

</div>