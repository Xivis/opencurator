import { takeEvery, call, put } from 'redux-saga/effects';

import {
  LOGIN_REQUEST,
  loginFailure
} from './actions'

import { web3 } from '../../utils/getWeb3'

export function* accountSaga() {
  yield takeEvery(LOGIN_REQUEST, handleLoginRequest)
}

function* handleLoginRequest(action) {

  const fetchAccounts = () =>
    new Promise((resolve, reject) => {
      web3.eth.getAccounts((error, accounts) => {
        resolve({ error, accounts })
      });
    })

  const { errors } = yield call(fetchAccounts)

  if (errors) {
    yield put(loginFailure())
  }

}