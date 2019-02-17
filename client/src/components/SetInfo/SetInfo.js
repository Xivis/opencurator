import React from "react";

import Grid from '@material-ui/core/Grid';

import ExchangeButtons from "../../components/ExchangeButtons/index";
import TokenBoxes from "../../components/TokenBoxes/index";

import './SetInfo.scss';

class SetInfo extends React.Component {

	render() {
		let { set } = this.props
		return (
				<Grid container spacing={8} alignItems='center'>
					<Grid item xs={5}>
						<h1 className={'name-text'}>{set.name}</h1>
						<h4 className={'description-text'}>{set.description}</h4>
					</Grid>
					<Grid item xs={5}>
						<TokenBoxes tokens={set.tokens} symbol={set.symbol} />
					</Grid>
					<Grid item xs={2}>
						<ExchangeButtons set={set} />
					</Grid>
				</Grid>
		)
	}
}

export default SetInfo;