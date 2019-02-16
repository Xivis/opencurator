import React from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import './TokenBoxes.scss';

class TokenBoxes extends React.Component {

	state = {
 		tokenName: 'MEOW',
	  tokenAmount: '40'
 	};



	render() {
		return (
				<Grid container justify="center" alignItems='center' spacing={24}>
					<Grid item xs={5}>
						<Card>
							<CardContent className={'tokenBox'}>
								<h4 className={'text grey'}>Token</h4>
								<h3 className={'text'}>{ this.state.tokenName }</h3>
							</CardContent>
						</Card>
					</Grid>
					<Grid  item xs={5}>
						<Card>
							<CardContent className={'tokenBox'}>
								<h4 className={'text grey'}>Your Tokens</h4>
								<h2 className={'text green'}>{ this.state.tokenAmount }</h2>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
		)
	}
}

export default TokenBoxes;
