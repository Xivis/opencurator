import React from "react";
import {web3} from '../../utils/getWeb3';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import {connect} from "react-redux";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import {loginRequest} from "../../modules/account/actions";
import {requestBuyToken} from "../../modules/tokens/actions";

import './ExchangeButtons.scss';

const BUY = 'buy';
const SELL = 'sell';



class ExchangeButtons extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			openModal: false,
			tradeAmount: 0,
			action: '',
		}

	}

	buyModal = () => {
		console.log(this.tokenAddress);
		if (this.props.account.loggedIn) {
			this.openModal(BUY);
		} else {
			this.setState({action: BUY, openModal: true}, this.props.onLogin)
		}
	};

	sellModal = () => {
		if (this.props.account.loggedIn) {
			this.openModal(SELL);
		} else {
			this.setState({action: SELL, openModal: true}, this.props.onLogin)
		}	};

	openModal = action => {
		if (!this.state.openModal) {
			this.setState({openModal: true, action: action})
		}
	};

	handleClose = () => {
		if (this.state.openModal) {
			this.setState({
				openModal: false
			})
		}
	};

	renderModalContentText = () => {
		if (this.state.action === BUY) {
			return"Please enter the amount of tokens that you wish to buy";
		}
			return "Please enter the amount of tokens that you wish to sell"
	};

	renderModalTitle = () => {
		if (this.state.action === BUY) {
			return"Buy tokens";
		}
		return "Sell tokens"
	};

	renderModalActionText = () => {
		if (this.state.action === BUY) {
			return"Buy";
		}
		return "Sell"
	};

	getWeiFromTokens = tokens => {
		return web3.utils.toWei(tokens/1000+'', 'ether');

	};

	getTokensfromEth = tokens => {
		return tokens/1000;

	};

	renderModalAction = () => {
		if (this.state.action === BUY) {
			return () => {
				this.props.onBuy({
					tokenAddress: this.props.set.tokenAddress,
					amount: this.getWeiFromTokens(this.state.tradeAmount)
				})
			}
		} else {
			return () => {
				const amountInWei = web3.utils.toWei(this.state.tradeAmount/1000, 'ether');
				this.props.onBuy({tokenAddress: this.props.set.tokenAddress, amount: amountInWei})
			}
		}
	}



	render() {
		let { tokens, set } = this.props
		let buttonsDisabled = false
		if (tokens.data && tokens.data[set.tokenAddress] && tokens.data[set.tokenAddress].loading){
			buttonsDisabled = true
		}
		return (
			<div className={'exchange-buttons'}>
				<Grid container spacing={8} direction="column" justify="center"  alignItems="stretch">
					<Grid item xs={12}>
						<Button onClick={this.buyModal} className={'buy'} variant="outlined">
							Buy Tokens
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Button onClick={this.sellModal} className={'sell'} variant="outlined">
							Sell Tokens
						</Button>
					</Grid>
				</Grid>
				{(this.state.openModal && this.props.account.loggedIn) &&
				<Dialog
					open={true}
					aria-labelledby="alert-dialog-slide-title"
					aria-describedby="alert-dialog-slide-description"
					disableBackdropClick
				>
					<DialogTitle id="alert-dialog-slide-title">
						{this.renderModalTitle()}

				</DialogTitle>
					<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						{this.renderModalContentText()}
					</DialogContentText>
					<Grid container spacing={16}>
						<Grid item xs={12}>
							<TextField
								autoFocus
								margin="dense"
								id="amount"
								label="Amount"
								type="number"
								placeholder="1"
								value={this.state.tradeAmount}
								fullWidth
								// error={!(!this.state.invalidAddress)}
								onChange={e => {this.setState({tradeAmount: e.target.value})}}
								// value={this.state.address}
							/>
						</Grid>
					</Grid>
					<Grid container spacing={0}>
						<Grid item xs={4}>
							Amount (Eth):
						</Grid>
						<Grid item>
							{(this.state.tradeAmount)/1000}
						</Grid>
					</Grid>
				</DialogContent>

					<DialogActions>
						<Button
							disabled={buttonsDisabled}
							onClick={this.handleClose}
							color="primary"
						>
							Cancel
						</Button>
						<Button
							disabled={buttonsDisabled}
							onClick={this.renderModalAction()}
							color="primary"
						>
							{this.renderModalActionText()}
						</Button>
					</DialogActions>
				</Dialog>
				}
			</div>
		)
	}
}

/**
 *
 * 	Pasos:
 * 		0) Conectar a Redux -> state.account && actions loginRequest
 * 		1) Hacer modales maquetados
 * 		2) Check if account.loggedIn -> sino por redux llamar a modules/account/actions > loginRequest
 * 			Cuando se logeo -> abrir modal
 * 		3) Crear nuevo module -> token
 * 				a) Reducer
 * 						{
 * 							data: {
 * 								[tokenAddress]: {
 * 									loading: bool
 * 							}
 * 						}
 * 					}
 * 	  4) Accion de comprar:
 * 	  		a) Crear un nuevo action type -> BUY_TOKENS_REQUEST
 * 	  	  b) Crear una nueva accion que despache el BUY_TOKENS_REQUEST
 * 	  	    i) El reducer escucha BUY_TOKENS_REQUEST y actualiza el loading
 * 	  	  c) Crear sagas que va a escuchar todos los BUY_TOKENS_REQUEST -> funcion xY
 * 	  	  d) Funcion xY:
 * 	  	  	i) Inizializar el contrato con web3
 * 	  	    ii) Invocar a la funcion de BUY del contrato
 * 	  	    iii) OnSuccess -> despachar una nueva accion --> action type BUY_TOKENS_SUCCESS
 * 	  	           				--> Reducer actualiza: loading
 * 	  	           			  --> yield put(addAddress(address))
 * 	  	    iv) OnFail --> despachar una nueva accion --> action type BUY_TOKENS_FAILURE
 * 	  	    					 --> Reducer actualiza: loading
 * 	  	  e) El modal, cuando esta `loading` tiene que bloquear los botones
 * 	  	  d) Cuando cierro el modal? -> cuando this.props.set.balance !== nextProps.set.balance
 *
 * 		5) Repetir con vender
 * 	  6) commit + push
 */

const mapStateToProps = (state) => {
	return {
		account: state.account,
		tokens: state.tokens
	}
};


const mapDispatchToProps = dispatch => ({
	onLogin: () => dispatch(loginRequest()),
	onBuy: (payload) => dispatch(requestBuyToken(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeButtons)