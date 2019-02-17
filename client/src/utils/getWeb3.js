import Portis from '@portis/web3';
import Web3 from "web3";

import { dispatch } from "../store"
import {loginSuccess} from "../modules/account/actions";

export const portis = new Portis('c68194ef-521b-49f7-b12a-43f6862eef52', 'rinkeby', { scope: ['email'] });
export const web3 = new Web3(portis.provider);

const ws_provider = 'wss://rinkeby.infura.io/ws'
export const infuraW3 = new Web3(new Web3.providers.WebsocketProvider(ws_provider))


portis.onLogin((walletAddress, email) => {
  let payload = {
    walletAddress, email
  }
  dispatch(loginSuccess(payload))
});