import {
	TOKEN_ALLOWANCE_REQUEST,
	BUY_TOKENS_REQUEST,
	BUY_TOKENS_FAILURE,
	BUY_TOKENS_SUCCESS,
	SELL_TOKENS_REQUEST,
	SELL_TOKENS_FAILURE,
	SELL_TOKENS_SUCCESS
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
		case BUY_TOKENS_REQUEST:
		case SELL_TOKENS_REQUEST: {
			return {
				data:{
					...state.data,
					[action.payload.tokenAddress]: {
						loading: true
					}
				}
			}
		}
		case BUY_TOKENS_FAILURE:
		case SELL_TOKENS_FAILURE:
		case SELL_TOKENS_SUCCESS:
		case BUY_TOKENS_SUCCESS: {
			return {
				data:{
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
