import {takeEvery, put, call} from 'redux-saga/effects';

import {
  ADD_SET_REQUEST,
  addSet,
  removeSet,
  addAddress,
  addSetFailure
} from './actions'

import {
  LOGIN_SUCCESS
} from '../account/actions'

import {contractHasMethods} from '../../utils/contracts';
import {abi as abiTCR} from '../../contracts/ITCR20.json';
import {abi as abiERC} from '../../contracts/ERC20Detailed.json';
import {getState} from "../../store";
import {web3} from '../../utils/getWeb3';

export function* setsSaga() {
  yield takeEvery(ADD_SET_REQUEST, handleAddSetRequest)
  yield takeEvery(LOGIN_SUCCESS, handleLoginSuccess)
}

function* handleAddSetRequest(action) {

  if (!web3.utils.isAddress(action.payload)){
    yield put(removeSet(action.payload))
    return false
  }

  let result = yield call(() => contractHasMethods(action.payload))

  if (!result) {
    yield put(addSetFailure(action.payload))
    return false
  }

  const contract = new web3.eth.Contract(abiTCR, action.payload)

  const name = yield call(() => contract.methods.name().call())
  const description = yield call(() => contract.methods.description().call())
  const tokenAddress = yield call(() => contract.methods.token().call())

  const token = new web3.eth.Contract(abiERC, tokenAddress)

  const account = getState().account;
  let balance = 0 // TODO - GO BACK TO '-'
  let allowance = '-'
  if (account.loggedIn) {
    balance = yield call(() => token.methods.balanceOf(account.walletAddress).call())
    balance = web3.utils.fromWei(balance)
    allowance = yield call(() => token.methods.allowance(account.walletAddress, action.payload).call())
  }

  let symbol = '-'
  try{
    symbol = yield call(() => token.methods.decimals().call())
  }catch (e){
    console.log(e)
  }

  let set = {
    address: action.payload,
    name,
    description,
    symbol,
    tokenAddress,
    tokens: 100, // TODO - Remove hardcoded
    allowance,
    minDeposit: 10 // TODO - Calculate
  }
  yield put(addSet(set))
}


function* handleLoginSuccess(action) {
  const sets = getState().sets;
  const addresses = Object.keys(sets.data)

  for (let address of addresses){
    yield put(addAddress(address))
  }
}