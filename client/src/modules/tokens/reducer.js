import {
  TOKEN_ALLOWANCE_REQUEST,
  TOKEN_ALLOWANCE_SUCCESS,
  TOKEN_ALLOWANCE_FAILURE
} from './actions';

let INITIAL_STATE = {
  data: {
    '0x1234': {
      loading: false
    }
  }
}

export function tokenReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TOKEN_ALLOWANCE_REQUEST: {
      return {
        data: {
          ...state.data,
          [action.payload.tokenAddress]: {
            loading: true
          }
        }
      }
    }

    case TOKEN_ALLOWANCE_SUCCESS:
    case TOKEN_ALLOWANCE_FAILURE:{
      return {
        data: {
          ...state.data,
          [action.payload.tokenAddress]: {
            loading: false
          }
        }
      }
    }

    default:
      break;
  }

  return state;
}
