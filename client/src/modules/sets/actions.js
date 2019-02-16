export const ADD_SET_REQUEST = 'Add set address - Request'
export const ADD_SET_SUCCESS = 'Add set address - Success'
export const REMOVE_SET_ADDRESS = 'Remove set address'

export const removeSet = (payload) => {
  return {
    type: REMOVE_SET_ADDRESS,
    payload
  }
}

export const addAddress = (payload) => {
  return {
    type: ADD_SET_REQUEST,
    payload
  }
}

export const addSet = (payload) => {
  return {
    type: ADD_SET_SUCCESS,
    payload
  }
}
