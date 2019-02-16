export const ADD_SET_ADDRESS = 'Add set address'
export const REMOVE_SET_ADDRESS = 'Remove set address'

export const removeSet = (payload) => {
  return {
    type: REMOVE_SET_ADDRESS,
    payload
  }
}