import React from 'react'
import { connect } from 'react-redux'

import './CreateSetPage.scss'


class CreateSetPage extends React.Component {

  render() {
    return (
      <div className={'home-page container'}>
        <h1>Create page</h1>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(CreateSetPage)