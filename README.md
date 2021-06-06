# smart_contract_rookie
For beginners to quickly get started with smart contract.

# Task
- Q1.Create your own first ERC20 token with Solidity and deploy it on [kovan](https://kovan.etherscan.io/) test net.
- Q2.Write a script to randomly transfer tokens between different accounts.
- Q3.Aanlyze transaction data in last step:
 - 1.Top five accounts with the most balances.
 - 2.Approve records: involved parties and appeoved amount.
 - 3.Transfer amount per hour.

# Solution
## Q1
### Introduction
Please go to directory /contracts/my_first_contract.sol to checkout the smart contract written in Solidity. This is a very simple ERC20 standard token contract with only two basic functions: balanceOf and transfer. balanceOf is used for querying the balance of a given address. transfer is used for transfering tokens between accounts.
### Instruction
- Go to [remix-a-online-ETH-dev-IDE](https://remix.ethereum.org/), compile and deploy the contract.
- Before you delpoy the contract, make sure the blew is ready:
 - Install metamask on Chrome as a plugin and apply an address account.
 - Select the correct network, in this case, we choose kovan testnet.
 - Authorize remix to connect metamask(This is done automatically when you deploy the contract on remix).
 - Deploying contract costs gas fees, get some free ETH from [kovan](https://kovan.etherscan.io/) before you deploy the contract.
- Once the contract is deployed, copy the contract address and go to [kovan-etherscan](https://kovan.etherscan.io/) to check the contract creation transaction. Of course, you can also transfer tokens between accounts and transactions can also be found on [kovan-etherscan](https://kovan.etherscan.io/).

## Q2
### Introduction
We use the popular [web3.js](https://web3js.readthedocs.io/en/v1.3.4/) to interact with Ethereum. [web3.js](https://web3js.readthedocs.io/en/v1.3.4/) is a collection of libraries that allow you to interact with a local or remote ethereum node using HTTP, IPC or WebSocket.

Codes are put in the folder /script, it has the blew structure:
.
├── abi.json
├── accounts.json
└── randomTranscation.js

- "abi.json" is ABI file which can be obtained from remix after you successfully compiled the contract.
- accounts.json keeps the account info, if no file is found, script will create up to ACCOUNT_NUM accounts for you. 
- randomTranscation.js is the main program which does the blew things:
 - Account management: create in blockchain and load accounts from your local file system.  
 - Get balance of a address on a given contract address.
 - Send transaction between addresses on a given contract address.
 - Do random transfer.

### PREREQUISITES
- OS: MacOS BigSur V11.1
- install node and web3
```sh
brew update
brew install node
npm install web3
npm install web3 ethereumjs-tx
node app
```
- [**IMPORTANT**]Please go to [infura.io](https://infura.io/) to register an account thus to get an ETH provider. 
- [**IMPORTANT**]Make sure your accounts have enough ETHs to pay the transaction gas fee.

### RUN
```sh
node randomTranscation.js
```





