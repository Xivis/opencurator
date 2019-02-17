import {takeEvery, put, call} from 'redux-saga/effects';


import {VOTE, CHALLENGED} from './actions'
import {dispatch, getState} from "../../store";
import {web3} from "../../utils/getWeb3";
import {abi as abiERCT} from "../../contracts/ERC20Tradable";
import {failureSellToken, successSellToken} from "../tokens/actions";
import {updateUI} from "../ui/actions";
import {addAddress} from "../sets/actions";


export function* listingsSaga() {
	yield takeEvery(CHALLENGED, handleChallengeRequest)
//	yield takeEvery(VOTE, handleVoteRequest)
}

// function* handleVoteRequest(action) {
//
// 	let {vote} = action.payload
//
// 	const account = getState().account
//
// 	if (!account.loggedIn || !account.walletAddress){
// 		return false;
// 	}
//
// 	const registry = new web3.eth.Contract(abiERCT, registryAddress);
// 	try{
// 		registry.methods.vote(listingHash ,amount, description).send({
// 			from: account.walletAddress,
// 		}, (err, result) => {
// 			if (err) {
// 				//dispatch(failureSellToken(action.payload))
// 			} else {
// 				// dispatch(successSellToken(action.payload))
// 				// dispatch(updateUI('close_modal'))
// 				// dispatch(updateUI('close_modal'))
// 				// setTimeout(() => {
// 				// 	dispatch(addAddress(registryAddress))
// 				// }, 10000)
// 			}
// 		})
// 	}catch (e){
// 		yield put(failureSellToken(action.payload))
// 	}
//
// }

function* handleChallengeRequest(action) {

	let {listingHash, amount, description, registryAddress} = action.payload

	const account = getState().account

	if (!account.loggedIn || !account.walletAddress){
		return false;
	}

	const registry = new web3.eth.Contract(abiERCT, registryAddress);
	try{
		registry.methods.challenge(listingHash ,amount, description).send({
			from: account.walletAddress,
		}, (err, result) => {
			if (err) {
				//dispatch(failureSellToken(action.payload))
			} else {
				// dispatch(successSellToken(action.payload))
				// dispatch(updateUI('close_modal'))
				// dispatch(updateUI('close_modal'))
				// setTimeout(() => {
				// 	dispatch(addAddress(registryAddress))
				// }, 10000)
			}
		})
	}catch (e){
		yield put(failureSellToken(action.payload))
	}

}
