import React from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import Grid from '@material-ui/core/Grid';

import SetInfo from "../../components/SetInfo/index";
import SetItem from "../../components/SetItem/index";

class SetPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			set: {
				name: 'Adorable CryptoKitties',
				description: 'This is a TCR of Adorable CryptoKitties',
				token: 'MEOW',
			}
		}
	}

  render() {
		return (
				<div className="Page container">
						<SetInfo set={this.state.set}/>
					{[0, 1, 2].map(value => (
						<Grid container>
							<SetItem/>
						</Grid>
					))}
				</div>
		)
	}
}

const mapStateToProps = (state) => {
	console.log(state);
	return {}
};

export default connect(mapStateToProps)(SetPage)