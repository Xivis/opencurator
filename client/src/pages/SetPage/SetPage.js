import React from "react";
import {connect} from "react-redux";

import Grid from '@material-ui/core/Grid';

import SetInfo from "../../components/SetInfo/index";
import SetItem from "../../components/SetItem/index";
import EmptyState from "../../components/EmptyState";

import './SetPage.scss'

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
      items: []
    };
  }

  componentDidMount() {
    if (!this.state.set) {
      this.props.history.push('/')
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


  render() {

    let { set } = this.state;

    if (!set) {
      return <div>Loading...</div>
    }

    return (
      <div className="Page container">
        <SetInfo set={set}/>
        <Grid container className={'options-container'}>
          <Grid className={'options-side'} item xs={3}>
            <h4 className={'active-option'}>All (117)</h4>
            <h4>Submited (14)</h4>
            <h4>Challenged (3)</h4>
            <h4>Active (100)</h4>
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
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sets: state.sets
  }
};

export default connect(mapStateToProps)(SetPage)