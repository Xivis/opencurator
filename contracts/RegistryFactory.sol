pragma solidity ^0.4.24;

import "./zeppelin/ERC20Tradable.sol";
import "./zeppelin/Ownable.sol";
import "./SimpleTCR.sol";

contract RegistryFactory is Ownable {

    event _RegistryCreated(address creator, IERC20 token, ITCR20 registry, string name, string description);
    event _BasicParameterUpdated(string parameter, address newAddress);

    // Registry factory libs and base registry
    SimpleTCR public baseRegistry;
    IERC20 public reserveToken;

    /// @dev constructor deploys a new proxyFactory.
    constructor(SimpleTCR _baseRegistry) public {
        baseRegistry = _baseRegistry;
    }

    /**
     * Create a new SimpleTCR (with the associated Bonded Token and Voting contracts)
     * @dev ~ 2850000 gas
     * @param _tokenName The name of the associated Token (usually the same name of the Registry)
     * @param _decimals The number of decimals (eg: 18) of the associated Token
     * @param _symbol The symbol (eg: DT-RBT) of the associated Token
     * @param _parameters Initial parameters: [minDeposit, applyStageLength, voteStageLength, dispensationPct]
     * @param _registryName Main name of the registry
     * @param _description description of the registry
     * @param _acceptedDataType accepted data type of the registry
     * @return The created Registry
     */
    function newSimpleTCR(
        string _tokenName,
        uint8 _decimals,
        string _symbol,
        uint[] _parameters,
        string _registryName,
        string _description,
        string _acceptedDataType
    ) public returns (ITCR20) {
        // Creates a new IERC20
        ERC20Tradable tradableToken = new ERC20Tradable(_tokenName, _symbol, _decimals);

        // Create new registry
        SimpleTCR registry = new SimpleTCR(_registryName, _description, _acceptedDataType, tradableToken, _parameters);
        //SimpleTCR registry = SimpleTCR(deployNewRegistry(baseRegistry));

        emit _RegistryCreated(msg.sender, tradableToken, registry, _registryName, _description);
        return registry;
    }


    /**
     * Set the base Registry to be use in all future Registry creations
     * @param _newRegistry Any Registry implementation
     */
    function setBaseRegistry(SimpleTCR _newRegistry) onlyOwner external {
        baseRegistry = _newRegistry;
        emit _BasicParameterUpdated('baseRegistry', address(_newRegistry));
    }

    /**
     * Deploy a Copy of a contract supplied
     * @dev THIS COULD BE REPLACED WITH A "new Target()" BUT FOR SOME REASON CONSUMES A LOT OF MORE GAS IN DEPLOYMENT
     * @param _target The base contract to me copy
     * @return newContract address of the new deployed contract
     */
    function deployNewRegistry(address _target) private returns (address newContract){
        assembly {
        // Find empty storage location using "free memory pointer"
            let contractCode := mload(0x40)

        // Add target address, with a 11 bytes [i.e. 23 - (32 - 20)] offset to later accomodate first part of the bytecode
            mstore(add(contractCode, 0x0b), _target)

        // First part of the bytecode, shifted left by 9 bytes, overwrites left padding of target address
            mstore(sub(contractCode, 0x09), 0x000000000000000000603160008181600b9039f3600080808080368092803773)

        // Final part of bytecode, offset by 43 bytes
            mstore(add(contractCode, 0x2b), 0x5af43d828181803e808314602f57f35bfd000000000000000000000000000000)

        // total length 60 bytes
            newContract := create(0, contractCode, 60)

            if iszero(extcodesize(newContract)) {
                revert(0, 0)
            }
        }
    }
}


