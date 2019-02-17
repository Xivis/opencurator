/* global artifacts */

const ERC20Tradable = artifacts.require('./zeppelin/ERC20Tradable.sol');

module.exports = async (deployer, network, accounts) => {
  console.log(`>> Deploying ERC20Tradable to: ${network}`);

  return deployer.deploy(ERC20Tradable, 'TToken”', 'TTK', 18);
};
