export const CREATE_SET_REQUEST = 'Create set - Request'
export const CREATE_SET_SUCCESS = 'Create set - Success'
export const CREATE_SET_FAILURE = 'Create set - Failure'
export const CREATE_SET_RESET = 'Create set - Reset'
export const FETCH_LAST_SET = 'Fetch last set'
export const CREATED_EVENT_FETCHED = 'Fetch event'


export const createSetRequest = payload => {
  return {
    type: CREATE_SET_REQUEST,
    payload
  }
}

export const createSetSuccess = payload => {
  return {
    type: CREATE_SET_SUCCESS,
    payload
  }
}

export const createSetFailure = payload => {
  return {
    type: CREATE_SET_FAILURE,
    payload
  }
}

export const createSetReset = payload => {
  return {
    type: CREATE_SET_RESET,
    payload
  }
}

export const fetchNewestSet = payload => {
  return {
    type: FETCH_LAST_SET,
    payload
  }
}

export const newCreatedEvent = payload => {
  return {
    type: CREATED_EVENT_FETCHED,
    payload
  }
}