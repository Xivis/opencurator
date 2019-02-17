/* global artifacts */

const ERC20Tradable = artifacts.require('./zeppelin/ERC20Tradable.sol');
const SimpleTCR = artifacts.require('./SimpleTCR.sol');

module.exports = async (deployer, network, accounts) => {
  console.log(`>> Deploying Simple TCR: ${network}`);
  console.log('');
  console.log(`>> Deployed Tradable Token: ${ERC20Tradable.address}`);
  console.log(`>> Account: ${accounts[0]}`);

  deployer.link(ERC20Tradable, SimpleTCR);

  return deployer.deploy(SimpleTCR);
};
