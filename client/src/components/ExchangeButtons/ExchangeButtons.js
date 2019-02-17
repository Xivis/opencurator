import React from "react";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import './ExchangeButtons.scss';

class ExchangeButtons extends React.Component {

	render() {
		return (
			<div className={'exchange-buttons'}>
				<Grid container spacing={8} direction="column" justify="center"  alignItems="stretch">
					<Grid item xs={12}>
						<Button className={'buy'} variant="outlined">
							Buy Tokens
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Button className={'sell'} variant="outlined">
							Sell Tokens
						</Button>
					</Grid>
				</Grid>

				{/*<Dialog />*/}

			</div>
		)
	}
}

/**
 *
 * 	Pasos:
 * 		0) Conectar a Redux -> state.account && actions loginRequest
 * 		1) Check if account.loggedIn -> sino por redux llamar a modules/account/actions > loginRequest
 * 			Cuando se logeo -> abrir modal
 * 		2) Hacer modales maquetados
 * 		3) Crear nuevo module -> token
 * 				a) Reducer
 * 						{
 * 							data: {
 * 								[tokenAddress]: {
 * 									loading: bool
 * 							}
 * 						}
 * 					}
 * 	  4) Accion de comprar:
 * 	  		a) Crear un nuevo action type -> BUY_TOKENS_REQUEST
 * 	  	  b) Crear una nueva accion que despache el BUY_TOKENS_REQUEST
 * 	  	    i) El reducer escucha BUY_TOKENS_REQUEST y actualiza el loading
 * 	  	  c) Crear sagas que va a escuchar todos los BUY_TOKENS_REQUEST -> funcion xY
 * 	  	  d) Funcion xY:
 * 	  	  	i) Inizializar el contrato con web3
 * 	  	    ii) Invocar a la funcion de BUY del contrato
 * 	  	    iii) OnSuccess -> despachar una nueva accion --> action type BUY_TOKENS_SUCCESS
 * 	  	           				--> Reducer actualiza: loading
 * 	  	           			  --> yield put(addAddress(address))
 * 	  	    iv) OnFail --> despachar una nueva accion --> action type BUY_TOKENS_FAILURE
 * 	  	    					 --> Reducer actualiza: loading
 * 	  	  e) El modal, cuando esta `loading` tiene que bloquear los botones
 * 	  	  d) Cuando cierro el modal? -> cuando this.props.set.balance !== nextProps.set.balance
 *
 * 		5) Repetir con vender
 * 	  6) commit + push
 */


export default ExchangeButtons;
