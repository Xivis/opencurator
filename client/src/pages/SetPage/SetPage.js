import React from "react";
import {connect} from "react-redux";

import Grid from '@material-ui/core/Grid';

import SetInfo from "../../components/SetInfo/index";
import SetItem from "../../components/SetItem/index";

import './SetPage.scss'
class SetPage extends React.Component {

	constructor(props) {
		super(props);
		const item = {
			name: 'Name 1',
			info: 'Info',
			asset: 'https://i.blogs.es/84638b/kitty1/450_1000.jpg',
			status: 'challenge',
			id: 1

		};
		const item2 = {
			name: 'Name 2',
			info: 'Info',
			asset: 'https://i.blogs.es/84638b/kitty1/450_1000.jpg',
			status: 'active',
			id: 2
		};
		const item3 = {
			name: 'Name 3',
			info: 'Info',
			asset: 'https://i.blogs.es/84638b/kitty1/450_1000.jpg',
			status: 'submitted',
			id: 3
		};

		let items = [];
		items.push(item);
		items.push(item2);
		items.push(item3);

			this.state = {
			set: {
				name: 'Adorable CryptoKitties',
				description: 'This is a TCR of Adorable CryptoKitties',
				token: 'MEOW',
			},
			items: items
		};
	}

	renderItems = items => {
		return items.map(item => {
			return (
				<Grid key={item.id} container>
					<SetItem item={item} />
				</Grid>
				)
		});
	};


  render() {
		return (
				<div className="Page container">
						<SetInfo set={this.state.set}/>
					<Grid container className={'list-container'}>
						<Grid className={'options-container'} item xs={3}>
							<h4 className={'active-option'}>All (117)</h4>
							<h4>Submited (14)</h4>
							<h4>Challenged (3)</h4>
							<h4>Active (100)</h4>
						</Grid>
						<Grid className={'items-container'} item xs={9}>
							{this.renderItems(this.state.items)}
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

export default connect(mapStateToProps)(SetPage)