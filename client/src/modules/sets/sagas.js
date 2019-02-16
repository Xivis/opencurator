import { takeEvery, put } from 'redux-saga/effects';

import {
  ADD_SET_REQUEST,
  addSet
} from './actions'

// import { web3 } from '../../utils/getWeb3'
const delay = (ms) => new Promise(res => setTimeout(res, ms))

export function* setsSaga() {
  yield takeEvery(ADD_SET_REQUEST, handleAddSetRequest)
}

function* handleAddSetRequest(action){
  //TODO - Should go to the contract and get basic information
  console.log(action)

  yield delay(1000)

  console.log('POST DELAY')

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
