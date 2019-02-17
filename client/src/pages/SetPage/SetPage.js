import React from "react";
import {connect} from "react-redux";

import { Grid, Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';

import SetInfo from "../../components/SetInfo/index";
import SetItem from "../../components/SetItem/index";
import EmptyState from "../../components/EmptyState";

import { loginRequest } from '../../modules/account/actions'
import { requestAllowanceRequest } from '../../modules/tokens/actions'
import { applyRequest } from '../../modules/newListing/actions'
import { updateUI } from '../../modules/ui/actions'

import { web3 } from '../../utils/getWeb3'
import './SetPage.scss'

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const STEPS = {
  APPLY: 'apply',
  ALLOWANCE: 'allowance'
}

class SetPage extends React.Component {

  constructor(props) {
    super(props);
    /**
     const item = {
			name: 'Name 1',
			info: 'Info',
			asset: 'https://i.blogs.es/84638b/kitty1/450_1000.jpg',
			status: 'challenge',
			id: 1
		};
    */

    let set = null;

    if (props.match && props.match.params && props.match.params.address) {
      let { address } = props.match.params
      set = props.sets.data[address]
    }

    this.state = {
      set,
      items: [],
      openModal: false,
      nextAction: '',

      allowance: 0,
      allowanceError: null,

      listing: '',
      listingError: null,
      stake: 0,
      stakeError: null,
      description: '',
      descriptionError: null
    };
  }

  componentDidMount() {
    if (!this.state.set) {
      this.props.history.push('/')
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('Will Receive Props')
    console.log(nextProps)
    let { set } = this.state
    if (nextProps.sets && nextProps.sets.data[set.address]) {
      if (set.tokens !== nextProps.sets.data[set.address].tokens){
        this.setState({set: nextProps.sets.data[set.address]})
      }
    }

    if (!this.props.ui && nextProps.ui === 'close_modal') {
      this.handleClose()
    }
  }

  handleInput = (value, prop) => {

    if (['stake', 'allowance'].indexOf(prop) > -1 && value < 0) {
      value = 0;
    }

    this.setState({[prop]: value})
  }

  renderItems = items => {
    return items.map(item => {
      return (
        <Grid key={item.id} container>
          <SetItem item={item}/>
        </Grid>
      )
    });
  };

  proposeNew = () => {
    if (this.props.account.loggedIn) {
      this.checkApply()
    } else {
      this.setState({nextAction: STEPS.APPLY}, this.props.onLogin)
    }
  }

  checkApply = () => {
    let { set } = this.state;

    if (isNaN(set.tokens)) {
      return false
    }

    if (set.minDeposit <= set.tokens) {
      if (set.allowance > set.minDeposit){
        this.openModal(STEPS.APPLY)
      } else {
        this.openModal(STEPS.ALLOWANCE)
      }
    } else {
      this.props.updateUI('open_buy_modal')
    }

  }

  submitAllowance = () => {
    let { set, allowance } = this.state;
    if (set.minDeposit > allowance) {
      this.setState({allowanceError: `The min amount of tokens to be authorized is ${set.minDeposit}`})
      return false
    }

    this.props.requestAllowance({
      tokenAddress: set.tokenAddress,
      amount: allowance,
      registryAddress: set.address
    })
  }

  applyListing = () => {
    let { listing, stake, description, set } = this.state
    let errors = []
    if (listing.trim() === '' || !web3.utils.isAddress(listing)){
      errors.push({
        type: 'listingError', text: 'Please input a valid entry'
      })
    }
    if (parseInt(stake) <= 0 || parseInt(stake) > set.tokens ){
      errors.push({
        type: 'stakeError', text: `Please set a value between 1 and ${set.tokens}`
      })
    }
    if (description.trim() === ''){
      errors.push({
        type: 'descriptionError', text: 'Description is required'
      })
    }

    if (errors.length > 0) {
      let newState = {}
      for (let error of errors) {
        newState[error.type] = error.text
      }
      this.setState(newState)
    } else {
      this.props.applyRequest({
        registryAddress: set.address,
        listingHash: listing,
        stake,
        description
      })
    }
  }

  openModal = (value) => {
    if (!this.state.openModal) {
      this.setState({openModal: value})
    }
  }

  handleClose = () => {
    if (this.state.openModal) {
      this.setState({
        openModal: false
      })
    }
  }

  render() {

    let {
      set, openModal, items, allowance, allowanceError,
      listing, listingError, stake, stakeError, description, descriptionError
    } = this.state;

    let { tokens } = this.props
    let allowanceDisabled = false
    if (tokens.data && tokens.data[set.tokenAddress] && tokens.data[set.tokenAddress].loading){
      allowanceDisabled = true
    }

    if (!set) {
      return <div>Loading...</div>
    }

    return (
      <div className="set-page container">
        <SetInfo set={set}/>
        <Grid container className={'options-container'}>
          <Grid className={'options-side'} item xs={3}>
            <h4 className={'active-option'}>All (x)</h4>
            <h4>Proposed (x)</h4>
            <h4>Active (x)</h4>
            <h4>Challenged (x)</h4>
            <div className={'apply-button'}>
              <Button onClick={this.proposeNew}>
                Propose new
              </Button>
            </div>
          </Grid>
          <Grid className={'items-container'} item xs={9}>
            {this.renderItems(items)}

            {(!items || items.length === 0) && (
              <EmptyState>
                No items on this set.<br/>
                You can add one buy submitting an application.
              </EmptyState>
            )}
          </Grid>
        </Grid>

        {/* Approve Modal */}
        <Dialog
          open={openModal === STEPS.ALLOWANCE}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          disableBackdropClick
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Approve token's set"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Before applying, you need to authorize the set to hold your tokens
            </DialogContentText>
            <Grid container justify={'center'}>
              <Grid item xs={8}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="address"
                  label="Tokens authorized"
                  type="number"
                  placeholder=""
                  fullWidth
                  value={allowance}
                  error={!(!allowanceError)}
                  onChange={(ev) => this.handleInput(ev.target.value, 'allowance')}
                />
                {allowanceError && (
                  <span className={'input-error'}>
                    {allowanceError}
                  </span>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              color="primary"
              disabled={allowanceDisabled}
            >
              Cancel
            </Button>
            <Button
              onClick={this.submitAllowance}
              color="primary"
              disabled={allowanceDisabled}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Apply Modal */}
        <Dialog
          open={openModal === STEPS.APPLY}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          disableBackdropClick
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Propose new item"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Paste below the address of the TCR that you want to add to the dashboard
            </DialogContentText>
            <Grid container spacing={16}>
              <Grid item xs={8}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="address"
                  label="Cryptokitty"
                  type="text"
                  placeholder="0x00000"
                  fullWidth
                  error={!(!listingError)}
                  onChange={(ev) => this.handleInput(ev.target.value, 'listing')}
                  value={listing}
                />
                {listingError && (
                  <span className={'input-error'}>
                    {listingError}
                  </span>
                )}
              </Grid>
              <Grid item xs={4}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="amount"
                  label="Tokens"
                  type="number"
                  placeholder="Amount to stake"
                  fullWidth
                  error={!(!stakeError)}
                  onChange={(ev) => this.handleInput(ev.target.value, 'stake')}
                  value={stake}
                />
                {stakeError && (
                  <span className={'input-error'}>
                    {stakeError}
                  </span>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  multiline
                  margin="dense"
                  id="description"
                  label="Description"
                  type="number"
                  placeholder="Why it should be included on the set"
                  fullWidth
                  error={!(!descriptionError)}
                  onChange={(ev) => this.handleInput(ev.target.value, 'description')}
                  value={description}
                />
                {descriptionError && (
                  <span className={'input-error'}>
                    {descriptionError}
                  </span>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={this.props.newListing.loading}
              onClick={this.handleClose}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              disabled={this.props.newListing.loading}
              onClick={this.applyListing}
              color="primary"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sets: state.sets,
    account: state.account,
    tokens: state.tokens,
    newListing: state.newListing,
    ui: state.ui.value
  }
};

const mapDispatchToProps = dispatch => ({
  onLogin: () => dispatch(loginRequest()),
  requestAllowance: (payload) => dispatch(requestAllowanceRequest(payload)),
  applyRequest: (payload) => dispatch(applyRequest(payload)),
  updateUI: (payload) => dispatch(updateUI(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SetPage)
