import {combineReducers} from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'

export default () => {
    /* ------------- Assemble The Reducers ------------- */
    const appReducer = combineReducers({
        alert: require('./AlertRedux').reducer,
        application: require('./ApplicationRedux').reducer,
        barcode: require('./BarcodeRedux').reducer,
        sage: require('./SageRedux').reducer,
        startup: require('./StartupRedux').reducer
    })

    const rootReducer = (state, action) => {
        if (action.type === 'RESET_THE_STORE') state = undefined
        return appReducer(state, action)
    }

    return configureStore(rootReducer, rootSaga)
}
