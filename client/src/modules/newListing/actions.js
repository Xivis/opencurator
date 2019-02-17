export const APPLY_REQUEST = 'Apply - Request'
export const APPLY_SUCCESS = 'Apply - Success'
export const APPLY_FAILURE = 'Apply - Failure'


export const applyRequest = (payload) => {
  console.log(payload)
  return {
    type: APPLY_REQUEST,
    payload
  }
}

export const applySuccess = () => {
  return {
    type: APPLY_SUCCESS
  }
}

export const applyFailure = () => {
  return {
    type: APPLY_FAILURE
  }
}