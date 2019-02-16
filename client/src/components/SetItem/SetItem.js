import React from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import './SetItem.scss';

class SetItem extends React.Component {

	state = {
 		tokenName: 'MEOW',
	  tokenAmount: '40'
 	};



	render() {
		return (
			<div>
				<Grid container justify="center" spacing={26}>
					<Grid item sx={2}>
						Hola
					</Grid>
					<Grid item sx={6}>
						Hola
					</Grid>
					<Grid item sx={1}>
						Hola
					</Grid>
					<Grid item sx={3}>
						Hola
					</Grid>
				</Grid>
			</div>
		)
	}
}

export default SetItem;
