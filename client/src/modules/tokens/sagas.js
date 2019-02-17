import {takeEvery, put, call} from 'redux-saga/effects';

import {
  TOKEN_ALLOWANCE_REQUEST,
  requestAllowanceSuccess,
  requestAllowanceFailure,
	BUY_TOKENS_REQUEST,
	failureBuyToken,
	successBuyToken,
	failureSellToken,
	successSellToken,
	SELL_TOKENS_REQUEST
} from './actions'

import {abi as abiERCT} from '../../contracts/ERC20Tradable.json';
import {getState, dispatch} from "../../store";
import {web3} from '../../utils/getWeb3';
import {addAddress} from "../sets/actions";
import { updateUI } from '../ui/actions';


export function* tokensSaga() {
  yield takeEvery(TOKEN_ALLOWANCE_REQUEST, handleAllowanceRequest)
  yield takeEvery(BUY_TOKENS_REQUEST, handleBuyTokenRequest)
  yield takeEvery(SELL_TOKENS_REQUEST, handleSellTokenRequest)
}

function* handleBuyTokenRequest(action) {

	let {tokenAddress, amount, registryAddress} = action.payload

	const account = getState().account

	if (!account.loggedIn || !account.walletAddress){
		return false;
	}

	const token = new web3.eth.Contract(abiERCT, tokenAddress);
	try{
		token.methods.buy().send({
			from: account.walletAddress,
			value: amount
		}, (err, result) => {
			if (err) {
        dispatch(failureBuyToken(action.payload))
      } else {
        dispatch(successBuyToken(action.payload))
        dispatch(updateUI('close_modal'))
        dispatch(addAddress(registryAddress))
			}
		})
	}catch (e){
		yield put(failureBuyToken(action.payload))
	}

}

function* handleSellTokenRequest(action) {

	let {tokenAddress, amount, registryAddress} = action.payload

	const account = getState().account

	if (!account.loggedIn || !account.walletAddress){
		return false;
	}

	const token = new web3.eth.Contract(abiERCT, tokenAddress);
	try{
		token.methods.sell(amount).send({
			from: account.walletAddress,
		}, (err, result) => {
      if (err) {
        dispatch(failureSellToken(action.payload))
      } else {
        dispatch(successSellToken(action.payload))
        dispatch(updateUI('close_modal'))
        dispatch(addAddress(registryAddress))
      }
		})
	}catch (e){
		yield put(failureSellToken(action.payload))
	}

}

function* handleAllowanceRequest(action) {

  let {tokenAddress, amount, registryAddress} = action.payload
  const account = getState().account

  if (!account.loggedIn || !account.walletAddress ||
    !web3.utils.isAddress(tokenAddress) || !web3.utils.isAddress(registryAddress)) {
    return false
  }

  const token = new web3.eth.Contract(abiERCT, tokenAddress)

  try {
    token.methods.approve(registryAddress, amount)
      .send({from: account.walletAddress}, (err, result) => {
        if (err) {
          dispatch(requestAllowanceFailure({tokenAddress}))
        } else {
          dispatch(addAddress(registryAddress))
          dispatch(requestAllowanceSuccess({tokenAddress}))
          dispatch(updateUI('close_modal'))
        }
      })
  } catch (e) {
    yield put(requestAllowanceFailure({tokenAddress}))
  }
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