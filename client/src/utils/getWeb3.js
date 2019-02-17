import Portis from '@portis/web3';
import Web3 from "web3";

import { dispatch } from "../store"
import {loginSuccess} from "../modules/account/actions";

const myLocalBlockchain = {
  nodeUrl: 'http://localhost:8545',
  chainId: 2,
  nodeProtocol: 'rpc',
};

export const portis = new Portis('c68194ef-521b-49f7-b12a-43f6862eef52', 'rinkeby', { scope: ['email'] });
export const web3 = new Web3(portis.provider);

const ws_provider = 'wss://rinkeby.infura.io/ws'

let provider = new Web3.providers.WebsocketProvider(ws_provider)
provider.on('error', e => {
  console.error('WS Infura Error', e);
});

provider.on('end', e => {
  console.log('WS closed');
  console.log('Attempting to reconnect...');
  provider = new Web3.providers.WebsocketProvider(ws_provider);
  provider.on('connect', function () {
    console.log('WSS Reconnected');
  });
  web3.setProvider(provider);
});

export const infuraW3 = new Web3(provider)


portis.onLogin((walletAddress, email) => {
  let payload = {
    walletAddress, email
  }
  dispatch(loginSuccess(payload))
});