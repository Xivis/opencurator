/* global artifacts */

const SimpleTCR = artifacts.require('./SimpleTCR.sol');

module.exports = async (deployer, network) => {
  console.log(`>> Deploying Simple TCR: ${network}`);

  // Deploy factory contract
  return deployer.deploy(SimpleTCR, 'Awesome Cryptokitties”', 'Really awesome Cryptokitties');
};
