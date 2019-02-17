import {takeEvery, put, call} from 'redux-saga/effects';

import {
  TOKEN_ALLOWANCE_REQUEST,
	BUY_TOKENS_REQUEST
} from './actions'


import {abi as abiERC} from '../../contracts/ERC20Detailed.json';
//import {abi as abiERC} from '../../contracts/E.json';
import {getState} from "../../store";
import {web3} from '../../utils/getWeb3';

export function* tokensSaga() {
  yield takeEvery(TOKEN_ALLOWANCE_REQUEST, handleAllowanceRequest)
  yield takeEvery(BUY_TOKENS_REQUEST, handleBuyTokenRequest)
}

function* handleBuyTokenRequest(action) {
	let {tokenAddress, amount} = action.payload

	const account = getState().account

	if (!account.loggedIn || !account.walletAddress){
		return false;
	}

	const token = new web3.eth.Contract(abiERC, tokenAddress)

	token.methods.buy(registryAddress, amount).send({
		from: account.walletAddress
	}).then(console.log)



}

function* handleAllowanceRequest(action) {

  console.log(action)

  let {tokenAddress, amount, registryAddress} = action.payload
  const account = getState().account

  if (!account.loggedIn || !account.walletAddress ||
      !web3.utils.isAddress(tokenAddress) || !web3.utils.isAddress(registryAddress)) {
    // yield put(removeSet(action.payload))
    return false
  }

  const token = new web3.eth.Contract(abiERC, tokenAddress)
  console.log(token)
  token.methods.approve(registryAddress, amount).send({
    from: account.walletAddress
  }).then(console.log)
}

//
// function* handleLoginSuccess(action) {
//   const sets = getState().sets;
//   const addresses = Object.keys(sets.data)
//
//   for (let address of addresses){
//     yield put(addAddress(address))
//   }
// }