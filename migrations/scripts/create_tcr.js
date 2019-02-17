/* global artifacts web3 */
const fs = require('fs');

const RegistryFactory = artifacts.require('RegistryFactory.sol');
const Registry = artifacts.require('SimpleTCR.sol');
const Token = artifacts.require('ERC20Tradable.sol');

/* Load default Bonded TCR parameters */
let config = JSON.parse(fs.readFileSync('../conf/config.json'));
const path = require('path');

module.exports = (done) => {
  async function createTokenCuratedRegistry(networkID) {
    let registryFactoryAddress;
    if (networkID === '1') {
      // Mainnet registry factory address
      registryFactoryAddress = 'Put here Mainnet address of factory contract';
    } else if (networkID === '3') {
      // Ropsten registry factory address
      registryFactoryAddress = 'Put here Ropsten address of factory contract';
    } else if (networkID === '4') {
      // Rinkeby registry factory address
      registryFactoryAddress = 'Put here Rinkeby address of factory contract';
    } else {
      // Any other network, take Registry Factory address from local artifact
      registryFactoryAddress = RegistryFactory.address;
    }

    /* eslint-disable no-console */
    console.log('*---- Deploying Simple TCR (start) ----------');
    console.log('*');
    console.log('*  Using RegistryFactory at:');
    console.log(`*     ${registryFactoryAddress}`);
    console.log('*');
    console.log(`*  Network Id: ${networkID}`);
    console.log('*');
    console.log('*  Deploying TCR contract...');
    console.log('*');

    const paramConfig = config.paramDefaults;

    const registryFactory = await RegistryFactory.at(registryFactoryAddress);

    const registryReceipt = await registryFactory.newSimpleTCR(
      config.token.name,
      config.token.decimals,
      config.token.symbol,
      [
        paramConfig.minDeposit,
        paramConfig.applyStageLength,
        paramConfig.voteStageLength,
        paramConfig.dispensationPct,
      ],
      config.name,
      config.description,
      config.acceptedDataType,
    );

    const {token, registry} = registryReceipt.logs[0].args;

    const registryInstance = await Registry.at(registry);
    const tokenInstace = await Token.at(token);
    const registryName = await registryInstance.name();
    const tokenSymbol = await tokenInstace.symbol();

    /* eslint-disable no-console */
    console.log(`*  Name: ${registryName}`);
    console.log(`*  Token: ${tokenSymbol}`);
    console.log(`*  Apply deposit: ${paramConfig.minDeposit}`);
    console.log(`*  Dispensation: ${paramConfig.dispensationPct}%`);
    console.log('*');
    console.log('*  Registry:');
    console.log(`*     ${registry}`);
    console.log(`*  Token: (${tokenSymbol}):`);
    console.log(`*     ${token}`);
    console.log('*');
    console.log('*  All contracts deployed successfully.');
    console.log('*  TCR Created! (ready to buy tokens)');
    console.log('*');
    console.log('*---- Deploying New Bonded TCR (end) ------------');
    /* eslint-enable no-console */
    return true;
  }

  // web3 requires callback syntax. silly!
  web3.version.getNetwork((err, network) => {
    if (err) {
      console.log('Error detected!');
      return done(err); // truffle exec exits if an error gets returned
    }
    return createTokenCuratedRegistry(network).then(() => done());
  });
};
