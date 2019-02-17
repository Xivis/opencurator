import {takeEvery, put} from 'redux-saga/effects';

import {
  APPLY_REQUEST,
  applySuccess,
  applyFailure
} from './actions'

import {abi as abiTCR} from '../../contracts/ITCR20.json';
import {getState, dispatch} from "../../store";
import { updateUI } from '../ui/actions';
import {web3} from '../../utils/getWeb3';
import {stringEncode} from "../../utils/contracts";

export function* newListingSaga() {
  yield takeEvery(APPLY_REQUEST, handleListingApply)
}

function* handleListingApply(action) {
  console.log('Handle listing')

  let {registryAddress, listingHash, stake, description} = action.payload
  const account = getState().account

  if (!account.loggedIn || !account.walletAddress || !web3.utils.isAddress(registryAddress)) {
    console.log('failing')
    yield put(applyFailure())
    return false
  }

  const registry = new web3.eth.Contract(abiTCR, registryAddress)

  try {
    registry.methods
      .apply(stringEncode(listingHash), stake, JSON.stringify({description}))
      .send({from: account.walletAddress}, (error, result) => {
        console.log(error)
        console.log(result)
        if (error) {
          dispatch(applyFailure())
        } else {
          dispatch(applySuccess())
          dispatch(updateUI('close_modal'))
        }
      })
			.catch(() =>  {
				dispatch(applyFailure())
	})
  } catch (e) {
    yield put(applyFailure())
  }
}

//
// function* handleLoginSuccess(action) {
//   const sets = getState().sets;
//   const addresses = Object.keys(sets.data)
//
//   for (let address of addresses){
//     yield put(addAddress(address))
//   }
// }