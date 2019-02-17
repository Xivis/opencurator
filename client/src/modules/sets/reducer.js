import {
  ADD_SET_REQUEST,
  ADD_SET_SUCCESS,
  ADD_SET_FAILURE,
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
      'tokens': '-'
    },
    '0x1235': {
      'name': 'Awesome set',
      'description': 'Lorem ipsum',
      'address': '0x1235',
      'symbol': 'RTK',
      'tokens': '-'
    }
  },
  loading: false,
  failedAddresses: []
}

export function setsReducer(state = null, action) {
  switch (action.type) {

    case ADD_SET_REQUEST: {
      return {
        ...state,
        loading: true
      }
    }

    case ADD_SET_SUCCESS: {
      let newState = {
        ...state,
        data: {
          ...state.data,
          [action.payload.address]: action.payload
        },
        failedAddresses: [],
        loading: false
      }
      localStorage.setItem('sets', JSON.stringify(newState))
      return newState
    }

    case REMOVE_SET_ADDRESS: {
      let newSets = {...state.data}
      newSets = _.omit(newSets, action.payload)
      let reducedState = {
        ...state,
        failedAddresses: [],
        data: newSets
      }
      localStorage.setItem('sets', JSON.stringify(reducedState))
      return reducedState
    }

    case ADD_SET_FAILURE:
      // TODO - Remove duplicates
      let failedAddresses = _.uniq([...state.failedAddresses, action.payload])
      return {
        ...state,
        loading: false,
        failedAddresses
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
