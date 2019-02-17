export const TOKEN_ALLOWANCE_REQUEST = 'Token allowance - Request'
export const TOKEN_ALLOWANCE_SUCCESS = 'Token allowance - Success'
export const TOKEN_ALLOWANCE_FAILURE = 'Token allowance - Failure'
export const BUY_TOKENS_REQUEST = 'Buy Token - Request'
export const BUY_TOKENS_SUCCESS = 'Buy Token - Success'
export const BUY_TOKENS_FAILURE = 'Buy Token - Failure'
export const SELL_TOKENS_REQUEST = 'Sell Token - Request'
export const SELL_TOKENS_SUCCESS = 'Sell Token - Success'
export const SELL_TOKENS_FAILURE = 'Sell Token - Failure'

export const requestAllowanceRequest = (payload) => {
  console.log(payload)
  return {
    type: TOKEN_ALLOWANCE_REQUEST,
    payload
  }
}

export const requestAllowanceSuccess = (payload) => {
  return {
    type: TOKEN_ALLOWANCE_SUCCESS,
    payload
  }
}

export const requestAllowanceFailure = (payload) => {
  return {
    type: TOKEN_ALLOWANCE_FAILURE,
    payload
  }
}

export const requestBuyToken = (payload) => {
	return {
		type: BUY_TOKENS_REQUEST,
		payload
	}
}

export const successBuyToken = (payload) => {
	return {
		type: BUY_TOKENS_SUCCESS,
		payload
	}
}

export const failureBuyToken = (payload) => {
	return {
		type: BUY_TOKENS_FAILURE,
		payload
	}
}

export const requestSellToken = (payload) => {
	return {
		type: SELL_TOKENS_REQUEST,
		payload
	}
}

export const successSellToken = (payload) => {
	return {
		type: SELL_TOKENS_SUCCESS,
		payload
	}
}

export const failureSellToken = (payload) => {
	return {
		type: SELL_TOKENS_FAILURE,
		payload
	}
}

