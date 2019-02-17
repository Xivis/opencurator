import {
  TOKEN_ALLOWANCE_REQUEST
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
        ...state.data,
        [action.payload.address]: {
          loading: true
        }
      }
    }

    default:
      break;
  }

  return state;
}
