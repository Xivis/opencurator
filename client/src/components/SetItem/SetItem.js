import React from "react";
import { Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid';

import StatusButton from '../../components/StatusButton/index';

import './SetItem.scss';

class SetItem extends React.Component {

	state = {
		itemName: this.props.item.name,
		itemInfo: this.props.item.info,
		itemAsset: this.props.item.asset,
		itemStatus: this.props.item.status
	};


	render() {
		return (
			<Link className={'link-item-container'} to={'/set/lala/listing/lalal'}>
				<div>
				<Grid container className={'item-container'} alignItems={'center'} spacing={24}>
					<Grid item xs={3}>
						<img alt='listing' className={'asset-image'} src={this.state.itemAsset} />
					</Grid>
					<Grid item xs={5}>
						<h2 className={'item-name'}>{this.state.itemName}</h2>
						<h3 className={'item-info'}>{this.state.itemInfo}</h3>
					</Grid>
					<Grid item xs={1}>
						<h4 className={'medium-grey'}>2h</h4>
					</Grid>
					<Grid item xs={3}>
						<StatusButton status={this.state.itemStatus}/>
					</Grid>
				</Grid>
				</div>
			</Link>
		)
	}
}

export default SetItem;
