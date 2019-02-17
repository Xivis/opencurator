export const TOKEN_ALLOWANCE_REQUEST = 'Token allowance - Request'
export const TOKEN_ALLOWANCE_SUCCESS = 'Token allowance - Success'
export const TOKEN_ALLOWANCE_FAILURE = 'Token allowance - Failure'

export const requestAllowance = (payload) => {
  return {
    type: TOKEN_ALLOWANCE_REQUEST,
    payload
  }
}