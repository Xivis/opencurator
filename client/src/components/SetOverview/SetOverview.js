import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Link } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import ControlPoint from '@material-ui/icons/ControlPoint'

import { removeSet } from '../../modules/sets/actions'
import './SetOverview.scss'


class SetOverview extends React.Component {

  handleRemove = () => {
    let { set, removeSet } = this.props;
    if (set.address) {
      removeSet(set.address)
    }
  }

  render() {
    let { set } = this.props;

    return (
      <div className={"set-overview"}>
        <Link to={`/set/${set.address}`}>
          <Grid container className={'set-overview-container'}>
            <Grid item xs={6}>
              <div className={'set-cell'}>
                <div className={'set-name'}>
                  {set.name}
                </div>
                <div className={'set-description truncate'}>
                  {set.description}
                </div>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className={'set-cell bordered'}>
                <div className={'set-address truncate'}>
                  {set.address}
                </div>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className={'set-cell bordered'}>
                <div className={'set-symbol'}>
                  {set.symbol}
                </div>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className={'set-cell bordered'}>
                <div className={'set-tokens'}>
                  {set.tokens}
                </div>
              </div>
            </Grid>
          </Grid>
        </Link>
        <ControlPoint className={'set-remove'} onClick={this.handleRemove} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({removeSet}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SetOverview);