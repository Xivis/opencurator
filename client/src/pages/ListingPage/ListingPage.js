import React from "react";
import {connect} from "react-redux";
import { Link, withRouter } from 'react-router-dom'

import Grid from '@material-ui/core/Grid';
import ArrowBack from '@material-ui/icons/KeyboardArrowLeft';


import SetInfo from "../../components/SetInfo/index";
import ItemDescription from "../../components/ItemDescription";

import './ListingPage.scss'

class ListingPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
      address: this.props.match.params.address,
			item: this.props.match.params.listingHash
		};
	}



	render() {



		console.log(this.state)
		let set = this.props.sets.data[this.state.address]
		let item = this.props.listing[this.state.address].data[this.state.item]
		return (
			<div className="Page container">
				<SetInfo set={set}/>
				<Grid container className={'options-container'}>
					<Grid className={'options-side'} item xs={3}>
						<div className={'back'}>
							<Link to={`/set/${this.state.address}`}>
								<ArrowBack className={'back-icon'} />
								BACK TO THE LIST
							</Link>
						</div>
					</Grid>
					<Grid className={'items-container'} item xs={9}>
						<ItemDescription item={item} />
					</Grid>
				</Grid>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		listing: state.listing,
		sets: state.sets
	}
};

export default withRouter(connect(mapStateToProps)(ListingPage))