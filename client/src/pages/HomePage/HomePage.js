import React from 'react'
import { connect } from 'react-redux'

import { Grid } from '@material-ui/core'

import SetOverview from "../../components/SetOverview/SetOverview";
import './HomePage.scss'

class HomePage extends React.PureComponent {

  render() {
    let { sets } = this.props;
    if (!sets) {
      return <div>Loading...</div>
    }

    let setsMap = Object.keys(sets.data).map(key => sets.data[key])

    return (
      <div className={'home-page container'}>
        <Grid container>
          <Grid item xs={6}>
            <h1>Participate</h1>
          </Grid>
          <Grid item xs={6} className={'create-set'}>
            Create set
          </Grid>
        </Grid>
        <Grid container className={'table-page'}>
          <Grid item xs={6}>
            <div className={'th'}>Name of the set</div>
          </Grid>
          <Grid item xs={2}>
            <div className={'th'}>Set address</div>
          </Grid>
          <Grid item xs={2}>
            <div className={'th'}>Token</div>
          </Grid>
          <Grid item xs={2}>
            <div className={'th'}>Your tokens</div>
          </Grid>
        </Grid>
        {setsMap.map(set => {
          return <SetOverview key={set.address} set={set} />
        })}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sets: state.sets
  }
}

export default connect(mapStateToProps)(HomePage)