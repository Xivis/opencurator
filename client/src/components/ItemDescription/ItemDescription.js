import React from "react";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Swal from 'sweetalert2'

import StatusButton from "../../components/StatusButton/StatusButton";

import './ItemDescription.scss';
import VoteButtons from "../VoteButtons";
import ChallengedButton from "../ChallengedButton";
import {LISTING_STATUS} from '../../modules/listings/utils'

class ItemDescription extends React.Component {

	state = {
		item: this.props.item
	};

	renderAction = ()=> {
		if(this.state.item.status === LISTING_STATUS.CHALLENGED){
			return <VoteButtons/>
		} else {
			return <ChallengedButton/>
		}
	}

	comingSoon = () => {
		Swal.fire({
			type: 'error',
			title: 'Oops...',
			text: 'This feature is coming soon!',
		})
	}

	render() {
		return (
			<div>
			<Grid container alignItems='center' >
				<Grid item className={'asset-image-container'} xs={5}>
					<img src={this.state.item.asset} className={'asset-image'}/>
				</Grid>
				<Grid item xs={7}>

					<Grid container justify="center" direction="column">

						<Grid item>
							<Grid container spacing={16} justify="flex-start" alignItems="center">
								<Grid item><StatusButton status={this.state.item.status}/></Grid>
								<Grid item><h3 className={'medium-grey'}>2h Left</h3></Grid>
							</Grid>
						<Grid/>

					</Grid>
					<Grid item>
						<h2 className={'main-text'}>{this.state.item.name}</h2>
					</Grid>
					<Grid item>
						<h3 className={'item-info-text'}>Item info</h3>
					</Grid>
					<Grid item>
						<h4 className={'item-info'}>{this.state.item.info}</h4>
					</Grid>
					<Grid item>
						{this.renderAction()}
					</Grid>
				</Grid>
			</Grid>
			</Grid>
			<hr className={'hr'}/>
			<Grid container spacing={8} className={'market-buttons'}>
				<Grid item><Button onClick={this.comingSoon} variant="outlined">Buy</Button></Grid>
				<Grid item><Button onClick={this.comingSoon} variant="outlined">Bid</Button></Grid>
				<Grid item><Button onClick={this.comingSoon} variant="outlined">Sell</Button></Grid>

			</Grid>
			</div>
		)
	}
}

export default ItemDescription;