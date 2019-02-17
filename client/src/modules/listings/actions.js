import {REMOVE_SET_ADDRESS} from "../sets/actions";

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

