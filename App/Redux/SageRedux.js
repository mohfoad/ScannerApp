import {createReducer, createActions} from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import gql from 'graphql-tag'
import {apolloClient} from '../Lib/Apollo'

export const MODE_ENUM = _.keyBy(['photographer', 'runner'])

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
    categoryMapRequest: null,
    categoryMapSuccess: ['categories'],
    categoryMapFailure: ['error'],
    searchBrandsRequest: ['searchText'],
    searchBrandsSuccess: ['brands'],
    searchBrandsFailure: ['error'],
    uploadMediaRequest: ['filePath'],
    uploadMediaSuccess: ['media'],
    uploadMediaFailure: ['error'],
    setMode: ['mode'],
    setBarcode: ['barcode'],
    setHasInternet: ['hasInternet'],
    setTag: ['tag'],
    setAutoQuickSync: ['autoQuickSync'],
    incrementUserStat: ['storeStatus'],
    setUserStat: ['key', 'value'],
    resetUserStats: null
    // setProp: [ 'key', 'value' ],
});

export const SageTypes = Types;
export default Creators

/* ------------- Initial State ------------- */

const getDefaultUserStats = () => ({
    cart: 0,
    done: 0,
    date: (new Date()).toISOString()
});

export const INITIAL_STATE = Immutable({
    categories: {},
    brands: [],
    error: null,
    fetching: false,
    media: {},
    mode: MODE_ENUM.runner,
    data: {upc: []},
    dataDiff: {},
    barcode: null,
    hasInternet: false,
    tag: null,
    autoQuickSync: 60,
    userStats: getDefaultUserStats()
});

/* ------------- Reducers ------------- */

export const categoryMapRequest = state => state.merge({fetching: true});

export const categoryMapSuccess = (state, {categories}) => state.merge({fetching: false, categories, error: null});

export const categoryMapFailure = (state, {error}) => state.merge({fetching: false, error});

export const searchBrandsRequest = state => state.merge({fetching: true});

export const searchBrandsSuccess = (state, {brands}) => state.merge({fetching: false, brands, error: null});

export const searchBrandsFailure = (state, {error}) => state.merge({fetching: false, error});

export const uploadMediaRequest = state => state.merge({fetching: true});

export const uploadMediaSuccess = (state, {media}) => state.merge({fetching: false, media, error: null});

export const uploadMediaFailure = (state, {error}) => state.merge({fetching: false, error});

export const setMode = (state, {mode}) => {
    if (!MODE_ENUM[mode]) throw new Error(`Invalid mode: "${mode}"`);
    return state.merge({mode})
}

export const setBarcode = (state, {barcode}) => state.merge({barcode});

export const setHasInternet = (state, {hasInternet}) => state.merge({hasInternet});

export const setTag = (state, {tag}) => state.merge({tag});

export const setAutoQuickSync = (state, {autoQuickSync}) => state.merge({autoQuickSync});

export const incrementUserStat = (state, {storeStatus}) => {
    if ((new Date(state.userStats.date)).getDate() !== (new Date()).getDate()) {
        state = state.merge({userStats: getDefaultUserStats()})
    }

    return state.merge({
        userStats: state.userStats.merge({[storeStatus]: state.userStats[storeStatus] + 1})
    })
};

export const setUserStat = (state, {key, value}) =>
    state.merge({userStats: state.userStats.merge({[key]: value})});

export const resetUserStats = state => state.merge({userStats: getDefaultUserStats()});

// export const setProp = (state, { key, value }) => {
//   if (!(key in INITIAL_STATE.asMutable())) throw `[setProp] Invalid key ${key}`;
//   return state.merge({ [key]: value })
// }

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.CATEGORY_MAP_REQUEST]: categoryMapRequest,
    [Types.CATEGORY_MAP_SUCCESS]: categoryMapSuccess,
    [Types.CATEGORY_MAP_FAILURE]: categoryMapFailure,
    [Types.SEARCH_BRANDS_REQUEST]: searchBrandsRequest,
    [Types.SEARCH_BRANDS_SUCCESS]: searchBrandsSuccess,
    [Types.SEARCH_BRANDS_FAILURE]: searchBrandsFailure,
    [Types.UPLOAD_MEDIA_REQUEST]: uploadMediaRequest,
    [Types.UPLOAD_MEDIA_SUCCESS]: uploadMediaSuccess,
    [Types.UPLOAD_MEDIA_FAILURE]: uploadMediaFailure,
    [Types.SET_MODE]: setMode,
    [Types.SET_BARCODE]: setBarcode,
    [Types.SET_HAS_INTERNET]: setHasInternet,
    [Types.SET_TAG]: setTag,
    [Types.SET_AUTO_QUICK_SYNC]: setAutoQuickSync,
    [Types.INCREMENT_USER_STAT]: incrementUserStat,
    [Types.SET_USER_STAT]: setUserStat,
    [Types.RESET_USER_STATS]: resetUserStats
    // [Types.SET_PROP]: setProp,
});
