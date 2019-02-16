import { all } from 'redux-saga/effects'

import { accountSaga } from './modules/account/sagas';

export function* rootSaga() {
    yield all([
      accountSaga()
    ])
}
