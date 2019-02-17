import { all } from 'redux-saga/effects'

import { accountSaga } from './modules/account/sagas';
import { setsSaga } from './modules/sets/sagas';
import { tokensSaga } from './modules/tokens/sagas';
import { newListingSaga } from './modules/newListing/sagas';
import { listingsSaga } from './modules/listings/sagas';

export function* rootSaga() {
    yield all([
      accountSaga(),
      setsSaga(),
      tokensSaga(),
      newListingSaga(),
			listingsSaga()
    ])
}
