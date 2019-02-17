export const TOKEN_ALLOWANCE_REQUEST = 'Token allowance - Request'
export const TOKEN_ALLOWANCE_SUCCESS = 'Token allowance - Success'
export const TOKEN_ALLOWANCE_FAILURE = 'Token allowance - Failure'

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