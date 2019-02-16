export const LOGIN_REQUEST = 'Login request'
export const LOGIN_SUCCESS = 'Login success'
export const LOGIN_FAILURE = 'Login failure'

export const loginRequest = (payload) => {
  return {
    type: LOGIN_REQUEST,
    payload
  }
}

export const loginSuccess = (payload) => {
  return {
    type: LOGIN_SUCCESS,
    payload
  }
}

export const loginFailure = (payload) => {
  return {
    type: LOGIN_FAILURE,
    payload
  }
}