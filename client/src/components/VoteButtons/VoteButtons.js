import React from "react";
import {withRouter} from "react-router-dom";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import './VoteButtons.scss';
import {loginRequest} from "../../modules/account/actions";
import {requestChallenge} from "../../modules/listings/actions";
import {connect} from "react-redux";
import Dialog from "../ChallengedButton/ChallengeButton";
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
			alert('');
			this.setState({vote: -1})
		} else {
			this.setState({vote: vote}, this.props.onLogin)
		}
	}

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
	onVote: (payload) => dispatch(requestChallenge(payload)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VoteButtons))
