import React from 'react'
import {connect} from 'react-redux'

import {
  Grid,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button
} from '@material-ui/core'

import './CreateSetPage.scss'

const TYPES = ['ERC20', 'ERC721', 'Hash', 'Text']

class CreateSetPage extends React.Component {

  state = {
    name: '',
    description: '',
    type: TYPES[0],
    symbol: ''
  }

  onSubmit = (ev) => {
    ev.preventDefault()
  }

  handleNameInput = (ev) => {
    this.setState({name: ev.target.value})
  }

  handleDescriptionInput = (ev) => {
    this.setState({description: ev.target.value})
  }

  handleSymbolInput = (ev) => {
    this.setState({symbol: ev.target.value});
  }

  handleChange = (ev) => {
    this.setState({type: ev.target.value});
  }

  render() {
    let {name, description, type, symbol} = this.state

    return (
      <div className={'create-page container'}>
        <div className={'create-title'}>
          <h1>Create your own Set</h1>
        </div>
        <Grid container justify="center">
          <Grid item xs={12} md={6}>
            <form className={'create-form'} onSubmit={this.onSubmit}>
              <div className={'set-name-input-container'}>
                <label className={'input-label'}>name</label>
                <TextField
                  id={'set-name'}
                  name={'Name'}
                  placeholder={'Set\'s name'}
                  value={name}
                  fullWidth
                  onChange={this.handleNameInput}
                />
              </div>
              <div className={'set-description-input-container'}>
                <label className={'input-label'}>description</label>
                <TextField
                  id={'set-description'}
                  name={'Description'}
                  placeholder={'What is the set about?'}
                  value={description}
                  fullWidth
                  onChange={this.handleDescriptionInput}
                  multiline
                />
              </div>
              <div className={'set-token-input-container'}>
                <label className={'input-label'}>token symbol</label>
                <TextField
                  id={'set-description'}
                  name={'Token'}
                  placeholder={'How should the token be called?'}
                  value={symbol}
                  fullWidth
                  onChange={this.handleSymbolInput}
                  multiline
                />
              </div>
              <div className={'set-type-input-container'}>
                <FormControl component="fieldset">
                  <label className={'input-label'}>content type</label>
                  <RadioGroup
                    aria-label="Content Type"
                    name="contentType"
                    value={type}
                    onChange={this.handleChange}
                    className={'set-type-group'}
                  >
                    <FormControlLabel value={TYPES[0]} control={<Radio className={'radio-input'} />} label={TYPES[0]}/>
                    <FormControlLabel value={TYPES[1]} control={<Radio className={'radio-input'}/>} label={TYPES[1]}/>
                    <FormControlLabel value={TYPES[2]} control={<Radio className={'radio-input'}/>} label={TYPES[2]}/>
                    <FormControlLabel value={TYPES[3]} control={<Radio className={'radio-input'}/>} label={TYPES[3]}/>
                  </RadioGroup>
                </FormControl>
              </div>
              <div className={'set-confirm-button'}>
                <Button onClick={this.onSubmit}>
                  Create set
                </Button>
              </div>
            </form>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(CreateSetPage)