import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {Provider} from 'react-redux'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import red from '@material-ui/core/colors/red';

import './styles/index.scss'

import {store} from './store'
import Routes from './Routes'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: green,
    secondary: amber,
    error: red,
  },
});

// import './contracts'

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <Routes/>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
