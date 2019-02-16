import * as React from 'react'
import {
  BrowserRouter as Router,
  Switch, Route, Redirect
} from 'react-router-dom'

import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SetPage from './pages/SetPage'
import ListingPage from './pages/ListingPage'
import CreateSetPage from './pages/CreateSetPage'

export default class Routes extends React.Component {
  renderRoutes = () => {
    return (
      <Router>
        <div>
          <Navbar/>
          <Switch>

            {/*Home*/}
            <Route exact path={'/'} component={HomePage}/>

            {/*Set*/}
            <Route exact path={'/set/:address'} component={SetPage}/>

            {/*Listing*/}
            {<Route exact path={'/set/:address/listing/:listingHash'} component={ListingPage}/>}

            {/*Listing*/}
            <Route exact path={'/create-set'} component={CreateSetPage}/>

            {/*Everything else*/}
            <Redirect to={'/'}/>
          </Switch>
        </div>
      </Router>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div>
          {this.renderRoutes()}
        </div>
      </React.Fragment>
    )
  }
}
