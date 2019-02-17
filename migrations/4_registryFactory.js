/* global artifacts */

const RegistryFactory = artifacts.require('./RegistryFactory.sol');
const SimpleTCR = artifacts.require('./SimpleTCR.sol');

module.exports = async (deployer, network) => {
  console.log(`>> Deploying Registry Factory in network: ${network}`);

  // Link all needed contracts
  deployer.link(SimpleTCR, RegistryFactory);

  // Deploy factory contract
  return deployer.deploy(RegistryFactory, SimpleTCR.address);
};
