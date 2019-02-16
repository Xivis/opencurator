import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import './HomePage.scss'

class HomePage extends React.PureComponent {

  render() {
    return (
      <React.Fragment>
        <div className="Page">
          <h1>Home Page</h1>
          <Link to={'/tokens'}>Tokens</Link>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(HomePage)