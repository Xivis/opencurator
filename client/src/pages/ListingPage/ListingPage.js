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
		const item = {
			name: 'Name 1',
			info: 'Info',
			asset: 'https://i.blogs.es/84638b/kitty1/450_1000.jpg',
			status: 'challenge',
			id: 1
		};

		this.state = {
			set: {
				name: 'Adorable CryptoKitties',
				description: 'This is a TCR of Adorable CryptoKitties',
				token: 'MEOW',
			},
			item: item
		};
	}



	render() {
		return (
			<div className="Page container">
				<SetInfo set={this.state.set}/>
				<Grid container className={'options-container'}>
					<Grid className={'options-side'} item xs={3}>
						<div className={'back'}>
							<Link to={'/set/lala'}>
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
	console.log(state);
	return {}
};

export default connect(mapStateToProps)(ListingPage)