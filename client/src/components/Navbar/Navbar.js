import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Grid } from '@material-ui/core';
import openCurator from '../../assets/images/open-curator.png'
import './Navbar.scss'

const styles = {
  root: {
    flexGrow: 1,
  },
};

class Navbar extends React.Component {

  render() {
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Grid container>
            <Grid item xs={6}>
              <img src={openCurator} alt={'Open Curator'} />
            </Grid>
            <Grid item xs={6}>
              Logo
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    )
  }
}

export default withStyles(styles)(Navbar);