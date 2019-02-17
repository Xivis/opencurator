
import {LISTING_STATUS} from './utils'

let INITIAL_STATE = {
  "0x6b0df44e51047f713bd2a66484034d1f8f4076c2": {
  	data: {
      "0x1236172": {
        name: "Maker DAO Ether price",
        asset: "https://pbs.twimg.com/profile_images/1084788308595617793/DOnqq1OM_400x400.jpg",
        description: "Maker DAO oracle for getting ETH Price",
        status: LISTING_STATUS.ACTIVE, //|PROPOSED|CHALLENGE
        challengeID: "0"
      },
      "0x1236173": {
        name: "Rhombus weather",
        asset: "https://pbs.twimg.com/profile_images/1084788308595617793/DOnqq1OM_400x400.jpg",
        description: "Rhombus weather oracle for Denver",
        status: LISTING_STATUS.PROPOSED, //|PROPOSED|CHALLENGE
        challengeID: "0"
      },
      "0x1236175": {
        name: "Maker DAO 2",
        asset: "https://pbs.twimg.com/profile_images/1084788308595617793/DOnqq1OM_400x400.jpg",
        description: "Maker DAO oracle for getting DAI price",
        status: LISTING_STATUS.ACTIVE, //|PROPOSED|CHALLENGE
        challengeID: "0"
      }
		}
  },
  "0xeEF5F236e3c5a9B0B53A64b343D490CFb3F44849": {
    data: {
      "0x1236172": {
        name: "Happy robot",
        asset: "https://image.freepik.com/vector-gratis/diseno-robot-color_1148-9.jpg",
        description: "Look how cute it is",
        status: LISTING_STATUS.CHALLENGED, //|PROPOSED|CHALLENGE
        challengeID: "0"
      },
      "0x1236173": {
        name: "Terminator",
        asset: "https://www.sideshow.com/storage/product-images/300157/terminator-t-800-endoskeleton_terminator_silo.png",
        description: "He will be back",
        status: LISTING_STATUS.ACTIVE, //|PROPOSED|CHALLENGE
        challengeID: "0"
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