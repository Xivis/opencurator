import {
  APPLY_FAILURE,
  APPLY_SUCCESS,
  APPLY_REQUEST
} from './actions';

let INITIAL_STATE = {
  loading: false
}

export function newListingReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case APPLY_REQUEST: {
      return {
        loading: true
      }
    }

    case APPLY_SUCCESS:
    case APPLY_FAILURE: {
      return {
        loading: false
      }
    }

    default:
      break;
  }

  return state;
}
