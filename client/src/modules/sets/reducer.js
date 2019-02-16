import {
  ADD_SET_ADDRESS,
  REMOVE_SET_ADDRESS
} from './actions'

import _ from 'lodash';

let INITIAL_STATE = {
  data: {
    '0x1234': {
      'name': 'Awesome set',
      'description': 'Lorem ipsum',
      'address': '0x1234',
      'symbol': 'RTK',
      'tokens': 40
    },
    '0x1235': {
      'name': 'Awesome set',
      'description': 'Lorem ipsum',
      'address': '0x1235',
      'symbol': 'RTK',
      'tokens': 40
    },
    '0x1236': {
      'name': 'Awesome set',
      'description': 'Lorem ipsum',
      'address': '0x1236',
      'symbol': 'RTK',
      'tokens': 40
    },
    '0x1237': {
      'name': 'Awesome set',
      'description': 'Lorem ipsum',
      'address': '0x1237',
      'symbol': 'RTK',
      'tokens': 40
    },
    '0x1238': {
      'name': 'Awesome set',
      'description': 'Lorem ipsum',
      'address': '0x1238',
      'symbol': 'RTK',
      'tokens': 40
    }
  }
}

export function setsReducer(state = null, action) {
  console.log(action)

  switch (action.type) {
    case ADD_SET_ADDRESS: {
      let newState = {
        ...state,
        data: {
          ...state.data,
          [action.payload.address]: action.payload
        }
      }
      localStorage.setItem('sets', JSON.stringify(newState))
      return newState
    }
    case REMOVE_SET_ADDRESS: {
      let newSets = {...state.data}
      newSets = _.omit(newSets, action.payload)
      let reducedState = {
        ...state,
        data: newSets
      }
      localStorage.setItem('sets', JSON.stringify(reducedState))
      return reducedState
    }
    default:
      break;
  }

  if (state === null){
    const data = localStorage.getItem('sets');
    if (data) {
      return JSON.parse(data);
    } else {
      return INITIAL_STATE
    }
  }

  return state;
}