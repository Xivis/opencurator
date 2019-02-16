import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from './actions'

let INITIAL_STATE = {
  email: '',
  walletAddress: '',
  loggedIn: false,
  loading: false
}

export function accountReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN_REQUEST: {
      return {
        ...state,
        loading: true
      }
    }
    case LOGIN_SUCCESS: {
      return {
        loggedIn: true,
        email: action.payload.email,
        walletAddress: action.payload.walletAddress,
        loading: false
      }
    }
    case LOGIN_FAILURE: {
      return {
        ...state,
        loading: false
      }
    }
    default:
      return state
  }
}
