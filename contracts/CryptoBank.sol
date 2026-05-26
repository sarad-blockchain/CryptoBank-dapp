// SPDX-License-Identifier: GPL-3.0-only

// Solidity Version
pragma solidity ^0.8.34;

// Functions:
    // 1. Deposit Ether 
    // 2. WithDraw Ether 

// Rules:
    // 1. Multiuser
    // 2. Only can deposit Ether
    // 3. User can only withdraw previusly deposit ether 
    // 4. Max Balance = 5 ether
    // 5. MaxBalance modifiable by owner 
    // UserA - Deposit (5 ether)
    // UserB - Deposit (2 ether)
    // Bank balance = 7 ether
    // UserA - Deposit (1 ether) - Deposit (5 ether) - Withdraw (2 ether) - Deposit (5 ether)

// Smart Contract
contract CryptoBank { 

    // State Variable
    uint256 public MaxBalance;
    address public admin;
    mapping(address => uint256) public UserBalance;

    // Events
    event EtherDeposit (address user_ , uint256 EtherAmount_);
    event EtherWithDraw (address user_ , uint256 EtherAmount_);

    // Modifier
    modifier OnlyAdmin(){
        require(msg.sender == admin , "You are not allow");
        _;
    }

    constructor (uint256 MaxBalance_ , address admin_ ) {
        MaxBalance = MaxBalance_;
        admin = admin_;
    }

    // Functions
    // External Functions

    // 1. Deposit
    function DepositEther() external payable {
        require (UserBalance[msg.sender] + msg.value <= MaxBalance , "MaxBalance reached");
        UserBalance[msg.sender]+= msg.value;
    }
    // 2. WithDraw
    function WithDrawEther(uint256 amount_) external {
        require(UserBalance[msg.sender]>= amount_ , "Not enough ether");
        // update state
        UserBalance[msg.sender]-= amount_;
        // transfer ether
        (bool success, ) = msg.sender.call{value:amount_}("");
        require( success , "Transfer failed");
        emit EtherWithDraw(msg.sender, amount_);
    }

     // 3. MaxBalance
    function ModifyMaxBalance(uint256 NewMaxBalance_) external OnlyAdmin{
        MaxBalance = NewMaxBalance_;
    }

    // Internal Functions
}