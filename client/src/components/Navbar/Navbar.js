import React from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom'
import { Blockie } from 'rimble-ui'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import TextField from '@material-ui/core/TextField'
import { Grid } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircle from '@material-ui/icons/AccountCircle'

import { loginRequest } from '../../modules/account/actions'
import openCurator from '../../assets/images/open-curator.png'
import './Navbar.scss'

const styles = {
  root: {
    flexGrow: 1,
  },
};

class Navbar extends React.Component {

  handleLogin = () => {
    this.props.onLogin()
  }

  render() {

    let { account } = this.props;

    return (
      <AppBar position="static" color="default" className={"curator-navbar"}>
        <Toolbar>
          <Grid container className={"container"}>
            <Grid item xs={3}>
              <Link to={'/'}>
                <div className={'logo-holder'}>
                  <img src={openCurator} alt={'Open Curator'} />
                </div>
                <div className={'brand-logo'}>
                  Open <br/>
                  Curator
                </div>
              </Link>
            </Grid>
            <Grid item xs={3}>
              <div className={'links-header'}>
                <div className={'link-container'}>
                  <Link to={'/'}>
                    Home
                  </Link>
                </div>
                <div className={'link-container'}>
                  <Link to={'/explore'}>
                    Explore
                  </Link>
                </div>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className={'search-container'}>
                <div className={'input-container'}>
                  <SearchIcon className={'search-icon'} />
                  <TextField
                    placeholder={'Search'}
                    className={'search-input'}
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className={'account'}>
                {!account.loggedIn && !account.loading && (
                  <div className={'login'} onClick={this.handleLogin}>
                    <AccountCircle className={'account-icon'} />
                    Login
                  </div>
                )}
                {account.loggedIn && (
                  <div className={'logged-in'}>
                    <span>{account.email}</span>
                    <Blockie opts={{
                      seed: account.walletAddress,
                      size: 10,
                      scale: 3,
                      bgcolor: "#09BE75"
                    }} />
                  </div>
                )}
                {account.loading && (
                  <span>Loading...</span>
                )}
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    account: state.account
  }
}

const mapDispatchToProps = dispatch => ({
  onLogin: () => dispatch(loginRequest()),
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Navbar));