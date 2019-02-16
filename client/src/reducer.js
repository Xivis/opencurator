import {combineReducers} from 'redux'

import { accountReducer as account } from './modules/account/reducer'

export const rootReducer = combineReducers({
  account
})
