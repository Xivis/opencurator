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

import './SetPage.scss'

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const STEPS = {
  APPLY: 'apply'
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
      nextAction: ''
    };
  }

  componentDidMount() {
    if (!this.state.set) {
      this.props.history.push('/')
    }
  }

  componentWillUpdate(nextProps) {
    if (!this.props.account.loggedIn && nextProps.account.loggedIn) {
      if (this.state.nextAction === STEPS.APPLY) {
        this.checkApply()
      }
    }
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
    if (set.minDeposit > set.tokens){
      // Insufficient funds
      alert('Insufficient funds')
    } else {
      this.openModal()
    }

  }

  openModal = () => {
    if (!this.state.openModal) {
      this.setState({openModal: true})
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

    let { set } = this.state;

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
            {this.renderItems(this.state.items)}

            {(!this.state.items || this.state.items.length === 0) && (
              <EmptyState>
                No items on this set.<br/>
                You can add one buy submitting an application.
              </EmptyState>
            )}
          </Grid>
        </Grid>

        <Dialog
          open={this.state.openModal}
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
                  // error={!(!this.state.invalidAddress)}
                  // onChange={this.handleInput}
                  // value={this.state.address}
                />
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
                  // error={!(!this.state.invalidAddress)}
                  // onChange={this.handleInput}
                  // value={this.state.address}
                />
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
                  // error={!(!this.state.invalidAddress)}
                  // onChange={this.handleInput}
                  // value={this.state.address}
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
              onClick={this.submitAddress}
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
    account: state.account
  }
};


const mapDispatchToProps = dispatch => ({
  onLogin: () => dispatch(loginRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SetPage)
