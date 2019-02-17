import {takeEvery, takeLatest, put} from 'redux-saga/effects';

import {
  CREATE_SET_REQUEST,
  FETCH_LAST_SET,
  createSetSuccess,
  createSetFailure,
  fetchNewestSet,
  newCreatedEvent, CREATED_EVENT_FETCHED
} from './actions'

import {abi} from '../../contracts/RegistryFactory';
import {addAddress} from "../sets/actions";
import {getState, dispatch} from '../../store'
import {web3, infuraW3} from '../../utils/getWeb3';
import {FACTORY_ADDRESS} from "../../utils/contracts";

export function* newSetSaga() {
  yield takeEvery(CREATE_SET_REQUEST, handleSetCreate)
  yield takeEvery(CREATED_EVENT_FETCHED, handleEventFetched)
  yield takeLatest(FETCH_LAST_SET, handleFetchRequest)
}

function* handleSetCreate(action) {

  console.log(action.payload)

  let {name, description, type, symbol} = action.payload

  const account = getState().account

  const factory = new web3.eth.Contract(abi, FACTORY_ADDRESS)

  try {
    factory.methods.newSimpleTCR(
      symbol,
      "18",
      symbol,
      [
        1000,
        172800,
        172800,
        80,
      ],
      name,
      description,
      type
    ).send({
      from: account.walletAddress
    }, (err, result) => {
      if(err){
        dispatch(createSetFailure())
      }else{
        dispatch(createSetSuccess())
        setTimeout(() => {
          dispatch(fetchNewestSet())
        }, 1000)
      }
    })

  } catch (e) {
    yield put(createSetFailure())
  }

}

function* handleFetchRequest(action) {
  const factory = new infuraW3.eth.Contract(abi, FACTORY_ADDRESS)

  factory.events._RegistryCreated({
    fromBlock: 0
  }, (error, result) => {
    if (!error) {
      dispatch(newCreatedEvent(result))
    }
  })

  // TODO - Remove
  yield put(createSetFailure())
}

function* handleEventFetched(action) {
  let {returnValues} = action.payload
  console.log(returnValues)
  const account = getState().account
  console.log(account.walletAddress)
  if (returnValues.creator.toLowerCase() === account.walletAddress.toLowerCase()){
    console.log('SHould be added')
    yield put(addAddress(returnValues.registry))
  }

}
