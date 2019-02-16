import React from "react";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import './VoteButtons.scss';

class VoteButtons extends React.Component {


	render() {
		return (
			<div className={'vote-buttons'}>
				<Grid container justify="flex-start"  alignItems="center">
					<Grid item xs={3}>
						<Button className={'kick'} variant="outlined">
							Kick
						</Button>
					</Grid>
					<Grid item xs={3}>
						<Button className={'keep'} variant="outlined">
							Keep
						</Button>
					</Grid>
				</Grid>
			</div>
		)
	}
}

export default VoteButtons;
