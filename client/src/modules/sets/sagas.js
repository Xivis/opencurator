import {takeEvery, put, call} from 'redux-saga/effects';

import {
  ADD_SET_REQUEST,
  addSet,
  addSetFailure
} from './actions'

import {contractHasMethods} from '../../utils/contracts';
import {abi as abiTCR} from '../../contracts/ITCR20.json';
import {abi as abiERC} from '../../contracts/ERC20Detailed.json';
import {getState} from "../../store";
import {web3} from '../../utils/getWeb3';

export function* setsSaga() {
  yield takeEvery(ADD_SET_REQUEST, handleAddSetRequest)
}

function* handleAddSetRequest(action) {
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
  let balance = '-'
  if (account.loggedIn) {
    balance = yield call(() => token.methods.balanceOf(account.walletAddress).call())
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
    tokens: balance
  }
  yield put(addSet(set))
}
