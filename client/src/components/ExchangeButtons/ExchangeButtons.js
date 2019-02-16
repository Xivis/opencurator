import React from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import './ExchangeButtons.scss';

class ExchangeButtons extends React.Component {


	render() {
		return (
			<div className={'exchange-buttons'}>
				<Grid container spacing={8} direction="column" justify="center"  alignItems="stretch">
					<Grid item xs={6}>
						<Button className={'buy'} variant="outlined">
							Buy Tokens
						</Button>
					</Grid>
					<Grid item xs={6}>
						<Button className={'sell'} variant="outlined">
							Sell Tokens
						</Button>
					</Grid>
				</Grid>
			</div>
		)
	}
}

export default ExchangeButtons;
