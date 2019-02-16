import Portis from '@portis/web3';
import Web3 from "web3";

import { dispatch } from "../store"
import {loginSuccess} from "../modules/account/actions";

const myLocalBlockchain = {
  nodeUrl: 'http://localhost:8545',
  chainId: 2,
  nodeProtocol: 'rpc',
};
export const portis = new Portis('c68194ef-521b-49f7-b12a-43f6862eef52', myLocalBlockchain, { scope: ['email'] });
export const web3 = new Web3(portis.provider);


portis.onLogin((walletAddress, email) => {
  let payload = {
    walletAddress, email
  }
  dispatch(loginSuccess(payload))
});