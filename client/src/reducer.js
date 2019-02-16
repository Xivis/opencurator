import {combineReducers} from 'redux'

const fakeReducer = (state = null, action) => {
  return state
}

export const rootReducer = combineReducers({
  fakeReducer
})
