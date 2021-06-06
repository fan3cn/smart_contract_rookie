// import web3
var web3 = require('web3')
// import sub module web3-eth
var Eth = require('web3-eth');
// set provider
var eth = new Eth(Eth.givenProvider || 'https://kovan.infura.io/v3/fc403b6d9af24a0091c5e96413214d16');
// send transaction
var Tx = require('ethereumjs-tx').Transaction;
// file system
const fs = require('fs')
// contract address
const contractAddr = '0x4706babbE302232e4EBf9f4D087bddecB98AC720'
// load ABI
const abi = JSON.parse(fs.readFileSync('./abi.json', 'utf-8'));
// contract
const contract = new eth.Contract(abi, contractAddr);
// account number
const ACCOUNT_NUM = 12
// kovan test net
eth.defaultChain = 'kovan';


/**
 * Load existing accounts from accounts.json file
 */
function loadAccounts() {
	var data = null;
	try{
		data = fs.readFileSync('accounts.json', 'utf-8')
	}catch(err) {
		// console.log("accounts.json not exits")
	}
	var accounts = []
	var num = 0;
	if (data) {
		// not null
		accounts = JSON.parse(data.toString());
		num = accounts.length; 
	}
	// create new accounts
	if (num < ACCOUNT_NUM) {
		accounts.push.apply(accounts, createAccounts(ACCOUNT_NUM - num))
		fs.writeFileSync('accounts.json', JSON.stringify(accounts))
	}
	return accounts;
}

/**
 * Create a certain number of accounts
 * @param {Number} 
 */
function createAccounts(num) {
	// loop for creating accounts
	var accounts = []
	for (i=0; i<num; i++) {
    	accounts.push(eth.accounts.create());
	}
	// keep necessary keys for a neat json file
    var necessary_keys = ["address", "privateKey"];
    // remove unnecessary keys
    accounts.forEach(function(obj) {
      Object.keys(obj).forEach(function(key){
        if(necessary_keys.indexOf(key) === -1) {
            delete obj[key];
          }
      });
    });
	// console.log(accounts);
	return accounts;
}

// async function
const sendTRX = async (fromAcct, toAcct, amount) => {
	// Invalid param
	if (!fromAcct) {
		console.log("Transaction failed, missing fromAcct.")
		return
	}
	if (!fromAcct) {
		console.log("Transaction failed, missing toAcct.")
	}
	// From and To address
	const fromAddr = fromAcct['address']
	const fromAddrPriKey = Buffer.from(fromAcct['privateKey'].slice(2), 'hex')

	const toAddr = toAcct['address']
	const toAddrPriKey = Buffer.from(toAcct['privateKey'].slice(2), 'hex')

	console.log("Start executing transaction: transfer %d from %s to %s.", amount, fromAddr, toAddr)

	// Balance
	var balanceFromAddr = await contract.methods.balanceOf(fromAddr).call();
	var balanceToAddr = await contract.methods.balanceOf(toAddr).call();
	console.log("Before transfer, fromAddr: " + fromAddr + ",balance:" + balanceFromAddr + ";" + "toAddr:" + toAddr +  ",balance:" + balanceToAddr)

	if (balanceFromAddr < amount) {
		console.log("Transaction failed, no enough balance.")
		return
	}

	// TransactionCount
	var count = await eth.getTransactionCount(fromAddr);
	console.log('Transaction count: ' + count)


	// Get current gas
	var gas = await eth.getGasPrice()
	console.log("Last block gas: " + gas)

	// Raw Transaction
	var rawTransaction = {
		// From address
		"from":fromAddr,
		// Gas Price
		"gasPrice":web3.utils.toHex(gas),
		// Gas Limit
		"gasLimit":web3.utils.toHex(210000),
		// Contract address where the transaction will be sent to.
		"to":contractAddr,
		// value
		"value":"0x0",
		// Call contract method
		"data":contract.methods.transfer(toAddr, amount).encodeABI(),
		// Nonce
		"nonce":web3.utils.toHex(count),
		// Kovan Testnet
		"chain":"kovan"
	}
	// Transacrion
	var transaction = new Tx(rawTransaction, {'chain':'kovan'})
	// Sign Transacrion with private key of sender.
	transaction.sign(fromAddrPriKey)
	// log
	console.log("Sending transaction...")
	// Wait until the transaction confirmed
	var receipt = await eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
	console.log("Transaction confirmed, receipt:");
	console.log(receipt)
	// Check balance
	var balanceFromAddr = await contract.methods.balanceOf(fromAddr).call();
	var balanceToAddr = await contract.methods.balanceOf(toAddr).call();
	console.log("After transfer, fromAddr: " + fromAddr + ",balance:" + balanceFromAddr + ";" + "toAddr:" + toAddr +  ",balance:" + balanceToAddr)
}

const randomTransfer = async() => {
	var accounts = loadAccounts()
	// console.log(accounts[0])
	// console.log(accounts[1])
	for (i=0; i<10000; i++) {
		console.log("doing loop:" + i);
		var x = 0
		// parseInt(Math.random() * ACCOUNT_NUM)
		var y = parseInt(Math.random() * ACCOUNT_NUM)
		if (x == y) {
			console.log("two randoms equal, skipped.");
			continue;
		}
		var amount = parseInt(Math.random() * 1000000)
		console.log('%d, %d, %d', x, y, amount)
		// Let's do it!
		try {
			await sendTRX(accounts[x] , accounts[y], amount);
		} catch (err) {
			console.log('Exception occurred while sending transaction:' + err)			
		}
	}
}

randomTransfer()

// createAccounts()

// sendTRX()
// console.log(contract.methods.balanceOf(addr2).call())

// var contractAddress = "0x4706babbE302232e4EBf9f4D087bddecB98AC720";
// var contract = new eth.Contract(abiArray, contractAddress, { from: addr });
// // How many tokens do I have before sending?
// var balance = await contract.methods.balanceOf(addr).call();
// console.log(`Balance before send: ${balance}`);
