import {createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
    setBarcodeRequest: ['barcode'],
    setBarcodeSuccess: null,
    setBarcodeFailure: ['error'],
    barcodeResetSuccess: null
})

export const BarcodeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    currentBarcode: null,
    error: null,
    setting: false
})

/* ------------- Reducers ------------- */

export const request = (state, {barcode}) => state.merge({setting: true, currentBarcode: barcode})

export const success = state => state.merge({setting: false, error: null})

export const failure = (state, {error}) => state.merge({setting: false, currentBarcode: null, error})

export const resetSuccess = state => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.SET_BARCODE_REQUEST]: request,
    [Types.SET_BARCODE_SUCCESS]: success,
    [Types.SET_BARCODE_FAILURE]: failure,
    [Types.BARCODE_RESET_SUCCESS]: resetSuccess
})
