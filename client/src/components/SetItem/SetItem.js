import React from "react";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import './SetItem.scss';

class SetItem extends React.Component {

	state = {
		itemName: this.props.item.name,
		itemInfo: this.props.item.info,
		itemAsset: this.props.item.asset,
		itemStatus: this.props.item.status
	};

	 getStatusButton = status => {
		switch (status) {
			case 'challenge':
				return <Button className={'status-button challenge'} variant="outlined">CHALLENGE</Button>;
			case 'submitted':
				return <Button className={'status-button submitted'} variant="outlined">SUBMITTED</Button>;
			case 'active':
				return <Button className={'status-button active'} variant="outlined">ACTIVE</Button>;
			default:
				return <div/>;

		}
	};

	render() {
		return (
				<Grid container className={'item-container'} alignItems={'center'} spacing={24}>
					<Grid item xs={3}>
						<img alt='listing' width={'150px'} src={this.state.itemAsset} />
					</Grid>
					<Grid item xs={5}>
						<h2 className={'item-name'}>{this.state.itemName}</h2>
						<h3 className={'item-info'}>{this.state.itemInfo}</h3>
					</Grid>
					<Grid item xs={1}>
						2h
					</Grid>
					<Grid item xs={3}>
						{this.getStatusButton(this.state.itemStatus)}
					</Grid>
				</Grid>
		)
	}
}

export default SetItem;
