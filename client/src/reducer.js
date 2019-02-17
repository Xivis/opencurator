import {combineReducers} from 'redux'

import { accountReducer as account } from './modules/account/reducer'
import { setsReducer as sets } from './modules/sets/reducer'
import { tokenReducer as tokens } from './modules/tokens/reducer'
import { newListingReducer as newListing } from './modules/newListing/reducer'
import { uiReducer as ui } from './modules/ui/reducer'
import { listingsReducer as listing } from './modules/listings/reducer'

export const rootReducer = combineReducers({
  account,
  sets,
  tokens,
  newListing,
	listing,
  ui
})
