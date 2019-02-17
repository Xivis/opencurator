/* global artifacts */

const ITCR20 = artifacts.require('./ITCR20.sol');
const ERC20Tradable = artifacts.require('./zeppelin/ERC20Tradable.sol');
const SimpleTCR = artifacts.require('./SimpleTCR.sol');

module.exports = async (deployer, network, accounts) => {
  console.log(`>> Deploying Simple TCR: ${network}`);
  console.log('');
  console.log(`>> Deployed Tradable Token: ${ERC20Tradable.address}`);
  console.log(`>> Account: ${accounts[0]}`);

  //deployer.link(ITCR20, SimpleTCR);
  deployer.link(ERC20Tradable, SimpleTCR);

  return deployer.deploy(
      SimpleTCR,
      'Awesome Cryptokitties"',
      'Really awesome Cryptokitties',
      'ERC721',
      ERC20Tradable.address,
      [1000, 172800, 172800, 80]
  );
};
