import { takeEvery, call, put } from 'redux-saga/effects';

import {
  LOGIN_REQUEST,
  loginFailure
} from './actions'

import { portis } from '../../utils/getWeb3'

export function* accountSaga() {
  yield takeEvery(LOGIN_REQUEST, handleLoginRequest)
}

function* handleLoginRequest(action) {

  try{
    yield call(() => portis.provider.enable())
  } catch (e) {
    yield put(loginFailure())
  }

}

