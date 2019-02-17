import {takeEvery, put, call} from 'redux-saga/effects';

import {
  TOKEN_ALLOWANCE_REQUEST,
  requestAllowanceSuccess,
  requestAllowanceFailure
} from './actions'

import {abi as abiERC} from '../../contracts/ERC20Detailed.json';
import {getState, dispatch} from "../../store";
import {web3} from '../../utils/getWeb3';

const delay = (ms) => new Promise(res => setTimeout(res, ms))

export function* tokensSaga() {
  yield takeEvery(TOKEN_ALLOWANCE_REQUEST, handleAllowanceRequest)
}

function* handleAllowanceRequest(action) {

  let {tokenAddress, amount, registryAddress} = action.payload
  const account = getState().account

  if (!account.loggedIn || !account.walletAddress ||
    !web3.utils.isAddress(tokenAddress) || !web3.utils.isAddress(registryAddress)) {
    return false
  }

  const token = new web3.eth.Contract(abiERC, tokenAddress)

  try {
    yield call(() => token.methods.approve(registryAddress, amount).send({from: account.walletAddress}))
    yield put(requestAllowanceSuccess({tokenAddress}))
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