import React from "react";
import {withRouter} from "react-router-dom";

import Button from '@material-ui/core/Button';
import {LISTING_STATUS} from '../../modules/listings/utils'
import './ChallengeButton.scss';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {web3} from '../../utils/getWeb3'

import {loginRequest} from "../../modules/account/actions";
import {requestChallenge} from "../../modules/listings/actions";
import {connect} from "react-redux";


class ChallengeButton extends React.Component {

	state = {
		openModal: false,
		challengeAmount: 0,
		invalidInput: '',
		description: '',
		set: this.props.sets.data[this.props.match.params.address],
		listingHash: this.props.match.params.listingHash
	}

	challengeModal = () => {
		if (this.props.account.loggedIn) {
			this.openModal();
		} else {
			this.setState({openModal: true}, this.props.onLogin)
		}
	};

	openModal = () => {
		if (!this.state.openModal) {
			this.setState({openModal: true})
		}
	};

	handleInput = (value) => {

		value = value.replace(/-/g, '');

		if (value < 0 || isNaN(value)) {
			value = 0;
		}

		this.setState({challengeAmount: value, invalidInput: ''})
	}

	handleClose = () => {
		if (this.state.openModal) {
			this.setState({
				openModal: false,
				invalidInput: ''
			})
		}
	};

	handleSubmit = () => {
		// if (this.state.challengeAmount > this.state.set.tokens) {
		// 	this.setState({invalidInput: 'You do not have enough tokens'});
		// } else {
		this.props.onChallenge({
				listingHash: this.state.listingHash,
				amount: web3.utils.toWei(this.state.challengeAmount+'', 'ether'),
				description: this.state.description,
				registryAddress: this.state.set.address,
			})//}
		}


	render() {
		return (
			<div>
			<Button onClick={this.challengeModal} className={'challenged-button'} variant="outlined"> CHALLENGE </Button>
		{(this.state.openModal && this.props.account.loggedIn) &&
		<Dialog
			open={true}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
			disableBackdropClick
		>
			<DialogTitle id="alert-dialog-slide-title">
					Challenge
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-slide-description">
					Set the amount of the challenge
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
							value={this.state.challengeAmount}
							fullWidth
							error={!(!this.state.invalidInput)}
							onChange={(ev) => this.handleInput(ev.target.value)}
						/>
						{this.state.invalidInput && (
							<span className={'input-error'}>
                {this.state.invalidInput}
              </span>
						)}
						<TextField
							autoFocus
							margin="dense"
							id="Description"
							label="Description"
							type="string"
							placeholder="Description"
							value={this.state.description}
							fullWidth
							error={!(!this.state.invalidInput)}
							onChange={(ev) => {this.setState({description: ev.target.value})}}
						/>
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
					onClick={this.handleSubmit}
					color="primary"
				> Submit
				</Button>
			</DialogActions>
		</Dialog>}
		</div>
		)
	}
}
const mapStateToProps = (state) => {
	return {
		sets: state.sets,
		account: state.account,
		tokens: state.tokens,
		ui: state.ui.value,
		listing: state.listing
	}
};


const mapDispatchToProps = dispatch => ({
	onLogin: () => dispatch(loginRequest()),
	onChallenge: (payload) => dispatch(requestChallenge(payload)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChallengeButton))