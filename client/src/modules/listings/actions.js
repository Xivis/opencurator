export const VOTE = 'Vote'
export const CHALLENGED = 'Challenged'

export const requestChallenge = (payload) => {
	return {
		type: CHALLENGED,
		payload
	}
}

export const requestVote = (payload) => {
	return {
		type: VOTE,
		payload
	}
}


export const REFRESH_LISTINGS_REQUEST = 'Refresh listings - Request'
export const REFRESH_LISTINGS_SUCCESS = 'Refresh listings - Success'
export const REFRESH_LISTINGS_FAILURE = 'Refresh listings - Failure'

export const refreshListings = (payload) => {
	return {
		type: REFRESH_LISTINGS_REQUEST,
		payload
	}
}

export const newListingFetched = (payload) => {
  return {
    type: REFRESH_LISTINGS_SUCCESS,
    payload
  }
}