pragma solidity ^0.4.24;

import "./ERC20.sol";

/**
 * @title ERC20Tradable
 * @dev ERC20 with Trading logic (Buy/Sell)
 */
contract ERC20Tradable is ERC20 {
    
    using SafeMath for uint256;

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