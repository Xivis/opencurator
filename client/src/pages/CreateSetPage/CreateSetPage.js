import React from 'react'
import {connect} from 'react-redux'

import {
  Grid,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
	CircularProgress
} from '@material-ui/core'

import './CreateSetPage.scss'
import {createSetReset, createSetRequest} from '../../modules/newSet/actions'
import {loginRequest} from "../../modules/account/actions";

const TYPES = ['ERC20', 'ERC721', 'SHA3-STRING']

class CreateSetPage extends React.Component {

  state = {
    name: '',
    description: '',
    type: TYPES[0],
    symbol: '',
    errors: {}
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.newSet.created && nextProps.newSet.created){
      this.props.setReset()
      this.props.history.push('/')
    }
  }

  onSubmit = (ev) => {
    ev.preventDefault()

    let { name, description, type, symbol } = this.state
    let errors = {}

    if (name.trim() === '') {
      errors['name'] = 'Name field is required'
    }

    if (description.trim() === '') {
      errors['description'] = 'Description field is required'
    }

    if (symbol.trim().length < 2) {
      errors['symbol'] = '3 or 4 chars'
    }

    if (Object.keys(errors).length > 0) {
      console.log('updating: ', errors)
      this.setState({errors})
      return false
    }

    if (!this.props.account.loggedIn){
      this.props.onLogin()
      return false
    }

    this.props.onSetCreate(
      { name, description, type, symbol }
    )

  }

  handleNameInput = (ev) => {
    this.setState({name: ev.target.value})
  }

  handleDescriptionInput = (ev) => {
    this.setState({description: ev.target.value})
  }

  handleSymbolInput = (ev) => {
    let symbol = ev.target.value.toUpperCase()
    if (symbol.length > 4) symbol = symbol.substring(0, 4)
    this.setState({symbol});
  }

  handleChange = (ev) => {
    this.setState({type: ev.target.value});
  }

  render() {
    let {name, description, type, symbol, errors} = this.state
    let {newSet} = this.props

    let buttonDisabled = (newSet && newSet.loading)

    return (
      <div className={'create-page container'}>
        <div className={'create-title'}>
          <h1>Create your own Set</h1>
        </div>
        <Grid container justify="center">
          <Grid item xs={12} md={8}>
            <form className={'create-form'} onSubmit={this.onSubmit}>
              <Grid container spacing={16}>
                <Grid item xs={10}>
                  <div className={'set-name-input-container'}>
                    <label className={'input-label'}>name</label>
                    <TextField
                      id={'set-name'}
                      name={'Name'}
                      placeholder={'Set\'s name'}
                      value={name}
                      fullWidth
                      error={!(!errors['name'])}
                      onChange={this.handleNameInput}
                    />
                    {errors['name'] && (
                      <span className={'input-error'}>
                        {errors['name']}
                      </span>
                    )}
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <div className={'set-token-input-container'}>
                    <label className={'input-label'}>token</label>
                    <TextField
                      id={'set-description'}
                      name={'Token'}
                      placeholder={'Symbol'}
                      value={symbol}
                      fullWidth
                      error={!(!errors['symbol'])}
                      onChange={this.handleSymbolInput}
                    />
                    {errors['symbol'] && (
                      <span className={'input-error'}>
                        {errors['symbol']}
                      </span>
                    )}
                  </div>
                </Grid>
              </Grid>
              <div className={'set-description-input-container'}>
                <label className={'input-label'}>description</label>
                <TextField
                  id={'set-description'}
                  name={'Description'}
                  placeholder={'What is the set about?'}
                  value={description}
                  fullWidth
                  error={!(!errors['description'])}
                  onChange={this.handleDescriptionInput}
                  multiline
                />
                {errors['description'] && (
                  <span className={'input-error'}>
                        {errors['description']}
                      </span>
                )}
              </div>
              <Grid container>
                <Grid item xs={4}>
                  <div className={'set-type-input-container'}>
                    <FormControl component="fieldset">
                      <label className={'input-label'}>Token scheme</label>
                      <RadioGroup
                        aria-label="Token Scheme"
                        name="tokenScheme"
                        value={'0'}
                        className={'set-type-group'}
                      >
                        <FormControlLabel value={'0'} control={<Radio className={'radio-input'} />} label={'Tradable'}/>
                        <FormControlLabel value={'1'} control={<Radio disabled className={'radio-input'}/>} label={'Mintable'}/>
                        <FormControlLabel value={'2'} control={<Radio disabled className={'radio-input'}/>} label={'Burnable'}/>
                      </RadioGroup>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <div className={'set-type-input-container'}>
                    <FormControl component="fieldset">
                      <label className={'input-label'}>Voting scheme</label>
                      <RadioGroup
                        aria-label="Voting scheme"
                        name="votingScheme"
                        value={'0'}
                        className={'set-type-group'}
                      >
                        <FormControlLabel value={'0'} control={<Radio className={'radio-input'} />} label={'Simple'}/>
                        <FormControlLabel value={'1'} control={<Radio disabled className={'radio-input'}/>} label={'Commit-Reveal'}/>
                        <FormControlLabel value={'2'} control={<Radio disabled className={'radio-input'}/>} label={'Delegate'}/>
                      </RadioGroup>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={4}>
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
                      </RadioGroup>
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
              <div className={'set-confirm-button'}>
								{!buttonDisabled && <Button
                  onClick={this.onSubmit}
                  disabled={buttonDisabled}
                >
                  Create set
                </Button>}
								{ buttonDisabled &&
									<CircularProgress/>

								}
              </div>
            </form>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    newSet: state.newSet,
    account: state.account
  }
}

const mapDispatchToProps = dispatch => ({
  onLogin: () => dispatch(loginRequest()),
  onSetCreate: (payload) => dispatch(createSetRequest(payload)),
  setReset: () => dispatch(createSetReset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateSetPage)