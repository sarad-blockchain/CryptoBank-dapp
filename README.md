# Solaris Bank — Decentralized Banking DApp

> A full-stack Web3 application integrating a Solidity smart contract with an Angular 17 frontend. Users can deposit and withdraw ETH through MetaMask, with an admin panel for contract governance.

![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=flat&logo=angular)
![Solidity](https://img.shields.io/badge/Solidity-0.8.34-363636?style=flat&logo=solidity)
![Ethers.js](https://img.shields.io/badge/Ethers.js-v6-3C3C3D?style=flat)
![Network](https://img.shields.io/badge/Network-Sepolia_Testnet-6F4CBA?style=flat)
![License](https://img.shields.io/badge/License-GPL--3.0-blue?style=flat)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Smart Contract](#smart-contract)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Project Structure](#project-structure)
- [Key Design Decisions](#key-design-decisions)
- [Roadmap](#roadmap)

---

## Overview

**Solaris Bank** is a decentralized banking application deployed on the **Sepolia testnet**. The smart contract (`CryptoBank.sol`) manages ETH balances per user with a configurable maximum deposit cap. The Angular frontend connects to the contract via **ethers.js v6**, with wallet detection, network validation, and real-time transaction tracking.

This project demonstrates a complete Web3 frontend–contract integration: ABI binding, MetaMask wallet lifecycle, route guards, and reactive state management using Angular Signals.

---

## Features

### User
- 🦊 **MetaMask wallet connection** with auto-detection and account change listeners
- 💰 **Deposit ETH** — enforces per-user `MaxBalance` limit set in the contract
- 💸 **Withdraw ETH** — checks on-chain balance before sending the transaction
- 📊 **Live dashboard** — displays wallet balance, user balance, and contract state
- 🔔 **Transaction history** — tracks pending / confirmed status per tx hash

### Admin
- 🔐 **Admin panel** protected by route guard (`adminGuard`)
- ⚙️ **Modify MaxBalance** — update the deposit cap for all users in real time

### UX / DX
- 🌐 **Network guard** — redirects users on the wrong chain before any tx
- ⚡ **Angular Signals** for reactive, zero-boilerplate state management
- 🔄 **Lazy-loaded routes** for optimized bundle size
- 📱 **Responsive layout** with custom SCSS design system

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart Contract | Solidity `^0.8.34` |
| Frontend Framework | Angular 17 (Standalone Components) |
| Web3 Library | ethers.js v6 |
| Wallet | MetaMask (EIP-1193) |
| Network | Ethereum Sepolia Testnet |
| State Management | Angular Signals |
| Styling | SCSS (custom design system) |

---

## Smart Contract

**File:** `contracts/CryptoBank/CryptoBank.sol`

```solidity
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.34;

contract CryptoBank {
    uint256 public MaxBalance;
    address public admin;
    mapping(address => uint256) public UserBalance;

    event EtherDeposit(address user_, uint256 EtherAmount_);
    event EtherWithDraw(address user_, uint256 EtherAmount_);

    modifier OnlyAdmin() {
        require(msg.sender == admin, "You are not allow");
        _;
    }

    constructor(uint256 MaxBalance_, address admin_) {
        MaxBalance = MaxBalance_;
        admin = admin_;
    }

    function DepositEther() external payable { ... }
    function WithDrawEther(uint256 amount_) external { ... }
    function ModifyMaxBalance(uint256 NewMaxBalance_) external OnlyAdmin { ... }
}
```

### Contract Rules

| Rule | Description |
|---|---|
| Multi-user | Each address has an independent balance via `mapping(address => uint256)` |
| Deposit cap | `UserBalance[sender] + msg.value <= MaxBalance` enforced on every deposit |
| Safe withdrawal | State updated **before** ETH transfer (checks-effects-interactions pattern) |
| Admin only | `ModifyMaxBalance` restricted to the deployer address via `OnlyAdmin` modifier |

### Deployment

The contract is deployed on **Sepolia testnet**. Update `contractAddress` in `src/environments/environment.ts` after deploying your own instance.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                Angular Frontend              │
│                                             │
│  Dashboard → Deposit → Withdraw → Admin     │
│       ↓           ↓        ↓        ↓       │
│         ContractService (ethers.js)          │
│                    ↓                         │
│            Web3Service (MetaMask)            │
└──────────────────────┬──────────────────────┘
                       │ JSON-RPC
              ┌────────▼────────┐
              │  CryptoBank.sol │
              │  Sepolia Testnet│
              └─────────────────┘
```

### Services

**`Web3Service`** — handles all wallet interactions:
- MetaMask detection and connection (`eth_requestAccounts`)
- Account and chain change event listeners
- Network validation against `SUPPORTED_CHAIN_ID` (Sepolia: `11155111`)

**`ContractService`** — handles all contract interactions:
- Reads `MaxBalance`, `UserBalance`, and `admin` from the contract
- Sends `DepositEther` and `WithDrawEther` transactions with the user's signer
- Tracks transaction lifecycle (pending → confirmed)
- Exposes reactive state via Angular Signals

### Route Guards

| Guard | Condition | Redirect |
|---|---|---|
| `walletGuard` | Wallet must be connected | `/` (home) |
| `networkGuard` | Must be on Sepolia | `/wrong-network` |
| `adminGuard` | Must be the contract admin | `/dashboard` |

---

## Getting Started

### Prerequisites

- Node.js `>=18`
- Angular CLI `>=17`
- MetaMask browser extension
- Sepolia testnet ETH (from a faucet)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/solaris-bank.git
cd solaris-bank

# 2. Install dependencies
npm install

# 3. Configure environment (see next section)

# 4. Run the development server
ng serve
```

Open `http://localhost:4200` in your browser.

### Deploy the Smart Contract (optional)

If you want to deploy your own instance using Remix or Hardhat:

1. Deploy `contracts/CryptoBank/CryptoBank.sol` to Sepolia
2. Pass your desired `MaxBalance` (in wei) and `admin` address to the constructor
3. Copy the deployed contract address into `src/environments/environment.ts`

---

## Environment Configuration

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  contractAddress: '0xYOUR_CONTRACT_ADDRESS_HERE', // ← replace this
  supportedChainId: 11155111,                        // Sepolia
  supportedChainName: 'Sepolia',
  rpcUrl: 'https://rpc.sepolia.org'
};
```

> ⚠️ Never commit a private key or funded mainnet address to this file.

---

## Project Structure

```
solaris-bank/
├── src/
│   ├── app/
│   │   ├── abi/
│   │   │   └── cryptobank.abi.json       # Contract ABI
│   │   ├── core/
│   │   │   └── services/
│   │   │       ├── contract.service.ts   # On-chain interactions
│   │   │       └── web3.service.ts       # Wallet connection
│   │   ├── features/
│   │   │   ├── dashboard/                # Main view
│   │   │   ├── deposit/                  # Deposit flow
│   │   │   ├── withdraw/                 # Withdraw flow
│   │   │   └── admin/                    # Admin panel
│   │   ├── guards/
│   │   │   └── wallet.guard.ts           # walletGuard, networkGuard, adminGuard
│   │   ├── models/
│   │   │   ├── bank.model.ts             # BankState, BankStats interfaces
│   │   │   └── transaction.model.ts      # Transaction, WalletState interfaces
│   │   ├── shared/
│   │   │   ├── components/navbar/
│   │   │   └── pipes/ether.pipe.ts       # Wei → ETH formatting
│   │   └── app.routes.ts                 # Lazy-loaded route config
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── styles/
│       └── styles.scss                   # Global design system
├── contracts/
│   └── CryptoBank/
│       └── CryptoBank.sol
└── angular.json
```

---

## Key Design Decisions

**Angular Signals over RxJS** — The app uses Angular 17 Signals (`signal`, `computed`) for all reactive state instead of Observables. This reduces boilerplate and aligns with Angular's current recommended approach for component-level state.

**Checks-Effects-Interactions pattern** — The `WithDrawEther` function updates `UserBalance` before calling `msg.sender.call{value}(...)`, preventing reentrancy attacks.

**Signer vs Provider separation** — Read-only calls (view functions) use a plain `BrowserProvider`. Write operations request a `Signer` from MetaMask, ensuring only the user can sign transactions.

**Lazy loading** — All feature routes use dynamic `import()` so each page is a separate chunk, keeping the initial bundle small.

---

## Roadmap

- [ ] Deploy to Sepolia and add verified contract link (Etherscan)
- [ ] Add unit tests for ContractService with mock provider
- [ ] Support WalletConnect in addition to MetaMask
- [ ] Add Hardhat scripts for local development and testing
- [ ] Emit `EtherDeposit` event in the contract and listen from the frontend

---

## License

Distributed under the **GPL-3.0-only** license. See `LICENSE` for more information.
