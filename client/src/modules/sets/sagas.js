import {takeEvery, put, call} from 'redux-saga/effects';

import {
  ADD_SET_REQUEST,
  addSet,
  addSetFailure
} from './actions'

import {contractHasMethods} from '../../utils/contracts';
import {web3} from '../../utils/getWeb3';
import {abi} from '../../contracts/ITCR20.json';

export function* setsSaga() {
  yield takeEvery(ADD_SET_REQUEST, handleAddSetRequest)
}

function* handleAddSetRequest(action) {
  let result = yield call(() => contractHasMethods(action.payload))

  if (!result) {
    yield put(addSetFailure(action.payload))
    return false
  }

  const contract = new web3.eth.Contract(abi, action.payload);

  const name = yield call(() => contract.methods.name().call())
  const description = yield call(() => contract.methods.description().call())

  let set = {
    address: action.payload,
    name,
    description,
    symbol: 'RTK',
    tokens: 40
  }
  yield put(addSet(set))
}
