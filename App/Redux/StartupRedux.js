import {createActions, createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
    startup: null,
    getCodeCreate: ['code']
});

export const StartupTypes = Types;
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    getCodeCreate: null
});

/* ------------- Reducers ------------- */

// export const startup = (state, {barcode}) => state.merge({setting: true, currentBarcode: barcode})

export const codeInformation = (state, {code}) => {
    state.merge({getCodeCreate: code})
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    // [Types.START_UP]: startup,
    [Types.GET_CODE_CREATE]: codeInformation,
})

