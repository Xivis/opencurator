import React from "react";

import Button from '@material-ui/core/Button';

import './StatusButton.scss';


class StatusButton extends React.Component {

	getStatusButton = () => {
		switch (this.props.status) {
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
		return this.getStatusButton();
	}
}

export default StatusButton;