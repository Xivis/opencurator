import { takeEvery } from 'redux-saga/effects';

import {
  ADD_SET_ADDRESS
} from './actions'

// import { web3 } from '../../utils/getWeb3'

export function* setsSaga() {
  yield takeEvery(ADD_SET_ADDRESS, handleAddSetRequest)
}

function* handleAddSetRequest(action){
  console.log('Hello')
}