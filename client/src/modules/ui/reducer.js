import { UI_UPDATE } from './actions';

let INITIAL_STATE = {
  value: null
}

export function uiReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UI_UPDATE: {
      return {
        value: action.payload
      }
    }

    default:
      break;
  }

  return state;
}
