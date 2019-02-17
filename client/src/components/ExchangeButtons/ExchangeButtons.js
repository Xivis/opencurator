import React from "react";

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
			nextAction: ''
		}

	}

	buyModal = () => {
		console.log(this.props.account.loggedIn);
		if (this.props.account.loggedIn) {
			this.openModal(BUY);
		} else {
			this.setState({nextAction: BUY}, this.props.onLogin)
		}
	};

	sellModal = () => {
		if (this.props.account.loggedIn) {
			this.openModal(SELL);
		} else {
			this.setState({nextAction: SELL}, this.props.onLogin)
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

	componentWillUpdate(nextProps) {
		if (!this.props.account.loggedIn && nextProps.account.loggedIn) {
			if (this.state.nextAction === BUY) {
				this.buyModal();
			} else if (this.state.nextAction === SELL ) {
				this.sellModal();
			}
		}
	}


	render() {
		{console.log(this.state)}
		return (
			<div className={'exchange-buttons'}>
				<Grid container spacing={8} direction="column" justify="center"  alignItems="stretch">
					<Grid item xs={6}>
						<Button onClick={this.buyModal} className={'buy'} variant="outlined">
							Buy Tokens
						</Button>
					</Grid>
					<Grid item xs={6}>
						<Button onClick={this.sellModal} className={'sell'} variant="outlined">
							Sell Tokens
						</Button>
					</Grid>
				</Grid>
				{this.state.openModal &&
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
							Amount (Wei):
						</Grid>
						<Grid item>
							{(this.state.tradeAmount)/1000}
						</Grid>
					</Grid>
				</DialogContent>

					<DialogActions>
						<Button
							onClick={this.handleClose}
							color="primary"
						>
							Cancel
						</Button>
						<Button
							onClick={this.handleClose}
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
		//loading: state.loading
	}
};


const mapDispatchToProps = dispatch => ({
	onLogin: () => dispatch(loginRequest()),
	onBuy: (payload) => dispatch(requestBuyToken(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeButtons)