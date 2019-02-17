import React from "react";
import {connect} from "react-redux";
import { Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid';
import ArrowBack from '@material-ui/icons/KeyboardArrowLeft';


import SetInfo from "../../components/SetInfo/index";
import ItemDescription from "../../components/ItemDescription";

import './ListingPage.scss'

class ListingPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			set: this.props.sets.data['0xc8c2d8761e63203829372018b978389fb0c3532b'],
			item: this.props.listing['0x0123'].data['0x0123']
		};
	}



	render() {
		return (
			<div className="Page container">
				<SetInfo set={this.state.set}/>
				<Grid container className={'options-container'}>
					<Grid className={'options-side'} item xs={3}>
						<div className={'back'}>
							<Link to={`/set/${this.state.set.address}`}>
								<ArrowBack className={'back-icon'} />
								BACK TO THE LIST
							</Link>
						</div>
					</Grid>
					<Grid className={'items-container'} item xs={9}>
						<ItemDescription item={this.state.item} />
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

export default connect(mapStateToProps)(ListingPage)