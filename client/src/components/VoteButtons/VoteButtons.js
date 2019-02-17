import React from "react";
import {withRouter} from "react-router-dom";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import './VoteButtons.scss';
import {loginRequest} from "../../modules/account/actions";
import {requestVote} from "../../modules/listings/actions";
import {connect} from "react-redux";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import {web3} from '../../utils/getWeb3'

const yes = 1;
const no = 0;

class VoteButtons extends React.Component {

	state = {
		openModal: false,
		voteAmount: 0,
		vote: -1,
		invalidInput: '',
		description: '',
		set: this.props.sets.data[this.props.match.params.address],
		listingHash: this.props.match.params.listingHash
	}

	handleVote = (vote) => {
		if (this.props.account.loggedIn) {
			this.openModal();
			this.setState({vote})
		} else {
			this.setState({openModal: true, vote: vote}, this.props.onLogin)
		}
	}

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

		this.setState({voteAmount: value, invalidInput: ''})
	}

	handleSubmit = () => {
		// if (this.state.challengeAmount > this.state.set.tokens) {
		// 	this.setState({invalidInput: 'You do not have enough tokens'});
		// } else {
		this.props.onVote({
			listingHash: this.state.listingHash,
			amount: web3.utils.toWei(this.state.voteAmount+'', 'ether'),
			vote: this.state.vote,
			registryAddress: this.state.set.address,
		})//}
	}

	handleClose = () => {
		if (this.state.openModal) {
			this.setState({
				openModal: false,
				invalidInput: ''
			})
		}
	};


	render() {
		return (
			<div className={'vote-buttons'}>
				<Grid container justify="flex-start"  alignItems="center">
					<Grid item xs={3}>
						<Button onClick={() => {this.handleVote(yes)}} className={'kick'} variant="outlined">
							Kick
						</Button>
					</Grid>
					<Grid item xs={3}>
						<Button onClick={() => {this.handleVote(no)}} className={'keep'} variant="outlined">
							Keep
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
						Stake
					</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-slide-description">
							Set the stake for the voting
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
									value={this.state.voteAmount}
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
	onVote: (payload) => dispatch(requestVote(payload)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VoteButtons))
