import {
  CREATE_SET_REQUEST,
  CREATE_SET_SUCCESS,
  CREATE_SET_FAILURE,
  CREATE_SET_RESET
} from './actions'


let INITIAL_STATE = {
  data: {},
  loading: false,
  created: false
}

export function newSetReducer(state = INITIAL_STATE, action) {

  switch (action.type) {
    case CREATE_SET_REQUEST: {
      return {
        ...state,
        loading: true
      }
    }

    case CREATE_SET_SUCCESS:{
      return {
        ...state,
        created: true,
        loading: false
      }
    }

    case CREATE_SET_FAILURE: {
      return {
        ...state,
        loading: false
      }
    }

    case CREATE_SET_RESET: {
      return INITIAL_STATE
    }

    default:
      break;
  }

  return state;
}