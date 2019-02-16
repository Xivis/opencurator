import {combineReducers} from 'redux'

import { accountReducer as account } from './modules/account/reducer'
import { setsReducer as sets } from './modules/sets/reducer'

export const rootReducer = combineReducers({
  account,
  sets
})
