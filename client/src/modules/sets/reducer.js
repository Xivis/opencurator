import {
  ADD_SET_REQUEST,
  ADD_SET_SUCCESS,
  ADD_SET_FAILURE,
  REMOVE_SET_ADDRESS
} from './actions'

import _ from 'lodash';

let INITIAL_STATE = {
  data: {
    "0x6b0df44e51047f713bd2a66484034d1f8f4076c2": {
      'name': 'Best Oracles TCR',
      'description': 'A list of best Oracles for ETH Price',
      'address': '0x6b0df44e51047f713bd2a66484034d1f8f4076c2',
      'symbol': 'B-ORA',
      'tokens': '-'
    },
    "0xeEF5F236e3c5a9B0B53A64b343D490CFb3F44849": {
      'name': 'Robots',
      'description': 'Super cool robots',
      'address': '0xeEF5F236e3c5a9B0B53A64b343D490CFb3F44849',
      'symbol': 'ROB',
      'tokens': '-'
    },
    "0x1ddd331c907b63db5c85081d4d138887147e82e9":{
      'name': 'FOAM',
      'description': 'The FOAM Proof of Location protocol empowers a permissionless and autonomous network of radio beacons that can offer secure location services independent of external centralized sources such as GPS through time synchronization.',
      'address': '0xeEF5F236e3c5a9B0B53A64b343D490CFb3F44849',
      'symbol': 'FOAM',
      'tokens': '-'
    },
    "0x88566fccfda47d26b0279644139a8f07db80adc4":{
      'name': 'Adchain',
      'description': 'The FOAM Proof of Location protocol empowers a permissionless and autonomous network of radio beacons that can offer secure location services independent of external centralized sources such as GPS through time synchronization.',
      'address': '0xeEF5F236e3c5a9B0B53A64b343D490CFb3F44849',
      'symbol': 'ADC',
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
      let sets = JSON.parse(data);
      let newData = {}
      for (let key of Object.keys(sets.data)) {
        newData[key] = {
          ...sets.data[key],
          allowance: 0,
          tokens: '-'
        }
      }
      return {
        ...sets,
        data: newData
      }
    } else {
      return INITIAL_STATE
    }
  }

  return state;
}
