import {takeEvery, put, call} from 'redux-saga/effects';


import {
	VOTE,
	CHALLENGED,
	REFRESH_LISTINGS_REQUEST,
	REFRESH_LISTINGS_SUCCESS
  newListingFetched
} from './actions'
import {dispatch, getState} from "../../store";
import {web3, infuraW3} from "../../utils/getWeb3";
import {abi as abiTCR } from '../../contracts/ITCR20';
import {abi as abiERCT} from "../../contracts/ERC20Tradable";
import {failureSellToken, successSellToken} from "../tokens/actions";


export function* listingsSaga() {
	yield takeEvery(CHALLENGED, handleChallengeRequest)
	yield takeEvery(REFRESH_LISTINGS_REQUEST, handleListingRefreshRequest)
	yield takeEvery(REFRESH_LISTINGS_SUCCESS, handleListingFound)
	yield takeEvery(VOTE, handleVoteRequest)
}

function* handleVoteRequest(action) {

	let {listingHash, amount, vote, registryAddress } = action.payload

	const account = getState().account

	if (!account.loggedIn || !account.walletAddress){
		return false;
	}

	const registry = new web3.eth.Contract(abiERCT, registryAddress);
	try{
		registry.methods.vote(listingHash ,amount, vote+'').send({
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

function* handleChallengeRequest(action) {

	let {listingHash, amount, description, registryAddress} = action.payload

	console.log(action.payload)

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


function* handleListingRefreshRequest(action) {
  const registry = new infuraW3.eth.Contract(abiTCR, action.payload)

	console.log(action.payload)
	console.log(registry)
	console.log('REQUEST :)')


  registry.events._Application({
    fromBlock: 0,
		to: 'latest'
  }, (error, result) => {
    if (!error) {
    	console.log(result)
      dispatch(newListingFetched(result))
    }else{
    	console.log('Error event')
		}
  })

  const name = yield call(() => registry.methods.name().call())
  console.log(name)

}

function* handleListingFound(action) {
	console.log(action)
}