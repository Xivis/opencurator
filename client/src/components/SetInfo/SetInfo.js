import React from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import Grid from '@material-ui/core/Grid';


import ExchangeButtons from "../../components/ExchangeButtons/index";
import TokenBoxes from "../../components/TokenBoxes/index";

import './SetInfo.scss';

class SetInfo extends React.Component {

		state = {
			name: this.props.set.name,
			description: this.props.set.description,
			token: this.props.set.tokens,
		};

	render() {
		return (
				<Grid container spacing={8} alignItems='center'>
					<Grid item xs={5}>
						<h1 className={'name-text'}>{this.state.name}</h1>
						<h4 className={'description-text'}>{this.state.description}</h4>
					</Grid>
					<Grid item xs={4}>
						<TokenBoxes/>
					</Grid>
					<Grid item xs={3}>
						<ExchangeButtons/>
					</Grid>
				</Grid>
		)
	}
}

export default SetInfo;