/* global artifacts */

const SimpleTCR = artifacts.require('./SimpleTCR.sol');

module.exports = async (deployer, network, accounts) => {
  console.log(`>> Deploying Simple TCR: ${network}`);
  console.log(`>> Account: ${accounts[0]}`);

  // Deploy factory contract
  return deployer.deploy(SimpleTCR, 'Awesome Cryptokitties”', 'Really awesome Cryptokitties', {'from': accounts[0]});  
};
