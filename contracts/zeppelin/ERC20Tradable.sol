pragma solidity ^0.4.24;

import "./ERC20.sol";

/**
 * @title ERC20Tradable
 * @dev ERC20 with Trading logic (Buy/Sell)
 */
contract ERC20Tradable is ERC20 {
    
    using SafeMath for uint256;

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    constructor (string memory name, string memory symbol, uint8 decimals) public {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;
    }

    /**
     * @return the name of the token.
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @return the symbol of the token.
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /**
     * @return the number of decimals of the token.
     */

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function buy() external payable returns (bool){
        _mint(msg.sender, msg.value*1000);
        return true;
    }
    
    function sell(uint256 value) external payable returns (bool){
        uint256 weiAmount =  value.div(1000);
        require(address(this).balance >= weiAmount);
        
        _transfer(msg.sender, address(this), value);
        msg.sender.transfer(weiAmount);
        
        _burn(address(this), value);
        return true;
    }   
}