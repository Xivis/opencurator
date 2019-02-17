import React from "react";

import {LISTING_STATUS} from '../../modules/listings/utils'
import './StatusButton.scss';


class StatusButton extends React.Component {

	getStatusButton = () => {
		switch (this.props.status) {
			case LISTING_STATUS.CHALLENGED:
				return <div className={'status-button challenge'} variant="outlined">CHALLENGE</div>;
			case LISTING_STATUS.PROPOSED:
				return <div className={'status-button submitted'} variant="outlined">SUBMITTED</div>;
			case LISTING_STATUS.ACTIVE:
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