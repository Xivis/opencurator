import { all } from 'redux-saga/effects'

import { accountSaga } from './modules/account/sagas';
import { setsSaga } from './modules/sets/sagas';

export function* rootSaga() {
    yield all([
      accountSaga(),
      setsSaga()
    ])
}
