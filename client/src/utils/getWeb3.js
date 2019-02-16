import Portis from '@portis/web3';
import Web3 from "web3";
const FALLBACK_WEB3_PROVIDER = process.env.REACT_APP_NETWORK || 'http://0.0.0.0:8545';

const myLocalBlockchain = {
  nodeUrl: 'http://localhost:8545',
  chainId: 2,
  nodeProtocol: 'rpc',
};
const portis = new Portis('c68194ef-521b-49f7-b12a-43f6862eef52', myLocalBlockchain);
export const web3 = new Web3(portis.provider);

const getWeb3 = () => web3;

const getGanacheWeb3 = () => {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    return null;
  }
  return web3;
}

export default getWeb3;
export { getGanacheWeb3 };
