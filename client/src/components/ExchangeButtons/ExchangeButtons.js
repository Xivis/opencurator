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
import {requestBuyToken, requestSellToken} from "../../modules/tokens/actions";

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
			invalidInput: ''
		}

	}

  componentWillReceiveProps(nextProps) {

    if (!this.props.ui && nextProps.ui === 'close_modal') {
      this.handleClose()
    }

    if (!this.props.ui && nextProps.ui === 'open_buy_modal') {
      this.buyModal()
    }

  }

	buyModal = () => {
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
			if (this.props.ui === 'open_buy_modal') {
				return "To participate in the set, you first need to get tokens "
			}
			return "Please enter the amount of tokens that you wish to buy";
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

	toWeiTokens = tokens => {
		return web3.utils.toWei(tokens+'', 'ether');
	}

	renderModalAction = () => {
		if (this.state.action === BUY) {

			return () => {
				if(this.getWeiFromTokens(this.state.tradeAmount) > web3.eth.getBalance(this.props.account.walletAddress)){
					this.setState({invalidInput: 'You do not have enough ether'});
				} else {
				this.props.onBuy({
          registryAddress: this.props.set.address,
					tokenAddress: this.props.set.tokenAddress,
					amount: this.getWeiFromTokens(this.state.tradeAmount)
				})}
			}
		} else {
			return () => {
				if(this.state.tradeAmount > this.props.set.tokens){
					this.setState({invalidInput: 'You do not have enough tokens'});
				} else {
				this.props.onSell({
          registryAddress: this.props.set.address,
					tokenAddress: this.props.set.tokenAddress,
					amount: this.toWeiTokens(this.state.tradeAmount)
				})}
			}
		}
	}

	handleInput = (value) => {

		value = value.replace(/-/g, '');

		if (value < 0 || isNaN(value)) {
			value = 0;
		}

		this.setState({tradeAmount: value, invalidInput: ''})
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
								label="Tokens"
								type="string"
								placeholder="1"
								value={this.state.tradeAmount}
								fullWidth
								error={!(!this.state.invalidInput)}
								onChange={(ev) => this.handleInput(ev.target.value)}
							/>
							{this.state.invalidInput && (
								<span className={'input-error'}>
                {this.state.invalidInput}
              </span>
							)}
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

const mapStateToProps = (state) => {
	return {
		account: state.account,
		tokens: state.tokens,
    ui: state.ui.value
	}
};


const mapDispatchToProps = dispatch => ({
	onLogin: () => dispatch(loginRequest()),
	onBuy: (payload) => dispatch(requestBuyToken(payload)),
	onSell: (payload) => dispatch(requestSellToken(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeButtons)