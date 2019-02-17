import React from "react";
import { Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid';

import StatusButton from '../../components/StatusButton/index';

import './SetItem.scss';

class SetItem extends React.Component {
	render() {

		let {set, item} = this.props;
		let {key, name, description, status, asset} = item

		return (
			<Link className={'link-item-container'} to={`/set/${set}/listing/${key}`}>
				<div>
				<Grid container className={'item-container'} alignItems={'center'} spacing={24}>
					<Grid item xs={3}>
						<img alt='listing' className={'asset-image'} src={asset} />
					</Grid>
					<Grid item xs={5}>
						<h2 className={'item-name'}>{name}</h2>
						<h3 className={'item-info'}>{description}</h3>
					</Grid>
					<Grid item xs={1}>
						<h4 className={'medium-grey'}>2h</h4>
					</Grid>
					<Grid item xs={3}>
						<StatusButton status={status}/>
					</Grid>
				</Grid>
				</div>
			</Link>
		)
	}
}

export default SetItem;
