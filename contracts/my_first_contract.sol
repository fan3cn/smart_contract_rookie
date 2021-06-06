// Solidity version 0.4.24
pragma solidity ^0.4.24; 

// FYY stands for "Fan Yongyong".
contract FYY {
    // minter/owner who created the contract
    address public minter;
    
    // token name
    string public name;
    
    // token symbol
    string public symbol;
    
    // token decimals
    uint public decimals;
    
    // map from address to unit, it is used to effectively show balance of a certain address.
    mapping (address => uint) public balanceOf;
    
    // This is the constructor whose code is run only when the contract is created
    constructor(uint256 initialSupply,string tokenName, string tokenSymbol, uint8 decimalUnits) public {
        // set minter as your own eth address
        minter = msg.sender;
        
        // set minter balance to initialSupply
        balanceOf[msg.sender] = initialSupply * (10 ** uint256(decimalUnits));
        
        // set decimals
        decimals = decimalUnits;
        
        // set token name
        name = tokenName; 
        
        // set token symbol
        symbol = tokenSymbol;
        
        // set decimals
        decimals = decimalUnits;
    }
    
    // transfer tokens
    function transfer(address _to, uint256 _value) public returns (bool success) {

        // Check if the sender has enough
        require(balanceOf[msg.sender] >= _value);

        // Check for integer overflows
        require(balanceOf[_to] + _value >= balanceOf[_to]);

        // Subtract value from the sender
        balanceOf[msg.sender] -= _value;

        // Add value to recipient
        balanceOf[_to] += _value;

        // Return true if transfer is successful
        return true;
    }

}

