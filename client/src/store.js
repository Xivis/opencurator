import {createStore, applyMiddleware} from 'redux';
import createSagasMiddleware from 'redux-saga'

import {rootReducer} from './reducer'
import {rootSaga} from './sagas'


const sagasMiddleware = createSagasMiddleware()

const middlewares = [sagasMiddleware,]

const middleware = applyMiddleware(...middlewares)
const store = createStore(rootReducer, middleware)

sagasMiddleware.run(rootSaga)

export {store}
