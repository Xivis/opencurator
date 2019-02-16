import React from "react";

import Button from '@material-ui/core/Button';

import './StatusButton.scss';


class StatusButton extends React.Component {

	getStatusButton = () => {
		switch (this.props.status) {
			case 'challenge':
				return <div className={'status-button challenge'} variant="outlined">CHALLENGE</div>;
			case 'submitted':
				return <div className={'status-button submitted'} variant="outlined">SUBMITTED</div>;
			case 'active':
				return <div className={'status-button active'} variant="outlined">ACTIVE</div>;
			default:
				return <div/>;

		}
	};


	render() {
		return this.getStatusButton();
	}
}

export default StatusButton;