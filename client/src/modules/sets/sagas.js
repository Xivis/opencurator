import { takeEvery, put, call } from 'redux-saga/effects';

import {
  ADD_SET_REQUEST,
  addSet,
  addSetFailure
} from './actions'

// import { web3 } from '../../utils/getWeb3'
import { contractHasMethods } from '../../utils/contracts'

export function* setsSaga() {
  yield takeEvery(ADD_SET_REQUEST, handleAddSetRequest)
}

function* handleAddSetRequest(action){
  let result = yield call(() => contractHasMethods(action.payload))

  if (!result) {
    yield put(addSetFailure(action.payload))
    return false
  }

  // If everything goes well
  let set = {
    address: action.payload,
    name: 'Added via sagas',
    description: 'Lorem ipsum',
    symbol: 'RTK',
    tokens: 40
  }
  yield put(addSet(set))
}
