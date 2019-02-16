/* global artifacts web3 */

const Registry = artifacts.require('Registry.sol');
const Token = artifacts.require('BondedToken.sol');
const IERC20 = artifacts.require('./zeppelin/IERC20.sol');

module.exports = (done) => {
  async function tokenCuratedRegistryStats(networkID) {
    /* eslint-disable no-console */
    console.log('*---------- TCR Stats (start) ----------');
    console.log('*');
    console.log(`*  Network Id: ${networkID}`);
    console.log('*');
    console.log('*  Sending transactions...');
    console.log('*');
    /* eslint-enable no-console */

    const registryAdress = process.argv[6];
    if (!registryAdress) {
      console.log('*');
      console.log('* Registry contract address needed');
      console.log('*');
      console.log('*---------- TCR Stats (end) ----------');
      return true;
    }

    const registry = await Registry.at(registryAdress);
    const token = await registry.token();
    const voting = await registry.voting();

    const minDeposit = await registry.get('minDeposit');
    const applyStageLength = await registry.get('applyStageLen');
    const commitStageLength = await registry.get('commitStageLen');
    const dispensationPct = await registry.get('dispensationPct');
    const voteQuorum = await registry.get('voteQuorum');
    const exitTimeDelay = await registry.get('exitTimeDelay');
    const exitPeriodLen = await registry.get('exitPeriodLen');

    const tokenAdress = await registry.token();
    const tokenInstace = await Token.at(tokenAdress);

    const registryName = await registry.name();
    const tokenSymbol = await tokenInstace.symbol();
    const tokenShape = await tokenInstace.shape();
    const tokenMultiplier = await tokenInstace.multiplier();
    const tokenPrecision = await tokenInstace.PRECISION();
    const reserveTokenAddress = await tokenInstace.reserveToken();

    /* eslint-disable no-console */
    console.log(`*  Name: ${registryName}`);
    console.log(`*  Token: ${tokenSymbol}`);
    console.log(`*    Shape: ${tokenShape}`);
    console.log(`*    Multiplier: ${tokenMultiplier}`);
    console.log(`*    Precision: ${tokenPrecision}`);
    console.log(`*  Apply/Challenge deposit: ${minDeposit}`);
    console.log(`*  Apply period: ${applyStageLength} (${applyStageLength / 3600} hs)`);
    console.log(`*  Commit period: ${commitStageLength} (${commitStageLength / 3600} hs)`);
    console.log(`*  Dispensation: ${dispensationPct}% (${100 - dispensationPct}% voters reward)`);
    console.log(`*  Quorum: ${voteQuorum}%`);
    console.log(`*  Exit Time Delay period: ${exitTimeDelay} (${exitTimeDelay / 3600} hs)`);
    console.log(`*  Exit period: ${exitPeriodLen} (${exitPeriodLen / 3600} hs)`);
    console.log('*');
    console.log('*  Registry:');
    console.log(`*     ${registryAdress}`);
    console.log(`*  Token (${tokenSymbol}):`);
    console.log(`*     ${token}`);
    console.log('*  Voting:');
    console.log(`*     ${voting}`);
    console.log('*  Reserve Token:');
    console.log(`*     ${reserveTokenAddress}`);
    console.log('*');
    console.log('*---------- TCR Stats (end) ----------');
    /* eslint-enable no-console */
    return true;
  }

  // web3 requires callback syntax. silly!
  web3.version.getNetwork((err, network) => {
    if (err) {
      console.log('Error detected!');
      return done(err); // truffle exec exits if an error gets returned
    }
    return tokenCuratedRegistryStats(network).then(() => done());
  });
};
