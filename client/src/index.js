import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {Provider} from 'react-redux'

import './styles/index.scss'

import {store} from './store'
import Routes from './Routes'

// import './contracts'

ReactDOM.render(
  <Provider store={store}>
    <Routes/>
  </Provider>,
  document.getElementById('root')
)
