// import {
//   ADD_SET_REQUEST,
//   ADD_SET_SUCCESS,
//   ADD_SET_FAILURE,
//   REMOVE_SET_ADDRESS
// } from './actions'
import {LISTING_STATUS} from './utils'

let INITIAL_STATE = {
	"0x0123": { // registry
		data: {
			"0x0123": { // Listing hash
				name: "Name",
				asset: "https://techcrunch.com/wp-content/uploads/2017/12/screen-shot-2017-12-03-at-5-20-32-pm.png?w=764",
				description: "Description",
				status: LISTING_STATUS.PROPOSED, //|PROPOSED|CHALLENGE
				challengeID: "int"
			}
		}
	}
}


export function listingsReducer(state = INITIAL_STATE, action) {

	switch (action.type) {
		default:
			break;
	}

	return state;
}