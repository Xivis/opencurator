export const TOKEN_ALLOWANCE_REQUEST = 'Token allowance - Request'
export const TOKEN_ALLOWANCE_SUCCESS = 'Token allowance - Success'
export const TOKEN_ALLOWANCE_FAILURE = 'Token allowance - Failure'
export const BUY_TOKENS_REQUEST = 'Buy Token - Request'
export const BUY_TOKENS_SUCCESS = 'Buy Token - Success'
export const BUY_TOKENS_FAILURE = 'Buy Token - Failure'

export const requestAllowance = (payload) => {
  return {
    type: TOKEN_ALLOWANCE_REQUEST,
    payload
  }
}

export const requestBuyToken = (payload) => {
	return {
		type: BUY_TOKENS_REQUEST,
		payload
	}
}

