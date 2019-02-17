/**
 * @title ERC20Tradable
 * @dev ERC20 trading logic
 */
contract ERC20Tradable is ERC20 {
    
    using SafeMath for uint256;

    function buy() public payable returns (bool){
        
        _mint(msg.sender, msg.value*1000);
        
        return true;
    }
    
    function sell(uint256 value) public payable returns (bool){
        
        uint256 weiAmount =  value.div(1000);
        
        require(address(this).balance >= weiAmount);
        
        _transfer(msg.sender, address(this), value);
        
        msg.sender.transfer(weiAmount);
        
        _burn(address(this), value);
        
        return true;   
    }   
}