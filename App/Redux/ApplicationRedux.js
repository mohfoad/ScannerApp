import {createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'
import {pathOr} from 'ramda'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
    applicationDataGetRequest: ['key'],
    applicationDataGetSuccess: ['key', 'value'],
    applicationDataGetFailure: ['error'],
    applicationDataSetRequest: ['key', 'value'],
    applicationDataSetSuccess: null,
    applicationDataSetFailure: ['error'],
    applicationDataResetRequest: null,
    applicationDataResetSuccess: null
})

export const ApplicationTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    data: {
        currentWebViewSource: null,
        currentWebViewTitle: null
    },
    currentDatum: {},
    getting: false,
    setting: false,
    resetting: false,
    error: null
})

/* ------------- Reducers ------------- */

export const getRequest = (state) => state.merge({getting: true})

export const getSuccess = (state, {key, value}) =>
    state.merge({
        getting: false,
        error: null,
        currentDatum: {
            [key]: value
        }
    })

export const getFailure = (state, {error}) => state.merge({getting: false, error})

export const setRequest = (state, {key, value}) =>
    state.merge({
        setting: false,
        error: null,
        data: {
            ...state.data,
            ...{
                [key]: value
            }
        }
    })

export const setSuccess = (state) => state.merge({setting: false})

export const setFailure = (state, {error}) => state.merge({setting: false, error})

export const resetRequest = (state) => state.merge({resetting: true})

export const resetSuccess = (state) =>
    INITIAL_STATE.merge({data: {topology: pathOr({}, ['data', 'topology'], state)}})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.APPLICATION_DATA_GET_REQUEST]: getRequest,
    [Types.APPLICATION_DATA_GET_SUCCESS]: getSuccess,
    [Types.APPLICATION_DATA_GET_FAILURE]: getFailure,
    [Types.APPLICATION_DATA_SET_REQUEST]: setRequest,
    [Types.APPLICATION_DATA_SET_SUCCESS]: setSuccess,
    [Types.APPLICATION_DATA_SET_FAILURE]: setFailure,
    [Types.APPLICATION_DATA_RESET_REQUEST]: resetRequest,
    [Types.APPLICATION_DATA_RESET_SUCCESS]: resetSuccess
})
