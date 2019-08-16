import {createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
    alertPopulate: ['message', 'alertType', 'title'],
    alertReset: null
})

export const AlertTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    message: null,
    alertType: null,
    title: null
})

/* ------------- Reducers ------------- */

// set global alert state to show message
export const populate = (state, {message, alertType, title}) =>
    state.merge({message, alertType, title})

// reset the global alert state
export const reset = state => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.ALERT_POPULATE]: populate,
    [Types.ALERT_RESET]: reset
})
