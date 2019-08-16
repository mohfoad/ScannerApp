// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import Secrets from 'react-native-config'
import ClientOauth2 from 'client-oauth2'

// ------
// STEP "0"
// ------
//
// Set up infrastructure for getting and refreshing the oauth access token
//

let api = null
let token = null

const accessTokenUri = `${Secrets.API_BASE_URL}/oauth/token`
const oauthClient = new ClientOauth2({
    clientId: Secrets.OAUTH_CLIENT_ID,
    clientSecret: Secrets.OAUTH_CLIENT_SECRET,
    accessTokenUri,
    authorizationUri: accessTokenUri,
    authorizationGrants: ['credentials']
})

const refreshToken = async (options = {}) => {
    const {api, force} = options
    if (force) token = null

    try {
        if (!token) {
            token = await oauthClient.credentials.getToken()
        } else if (token.expired()) {
            token = await token.refresh()
        }
    } catch (e) {
        // @TODO: handle error case
        console.log(e)
    }

    if (!token || !token.accessToken) {
        await new Promise((resolve) => setTimeout(resolve, 250))
        await refreshToken(options)
    }

    if (api) {
        api.setHeader('Authorization', `Bearer ${token.accessToken}`)
    }

    return token
}

const getToken = async (options) => refreshToken(options).then(() => token)

const initialize = async () => {
    if (api) {
        return Promise.resolve(api)
    }
    try {
        token = await getToken()
        api = create(token)
        setInterval(() => refreshToken({api: api.getInstance(), force: true}), 30 * 60 * 1000)
        return api
    } catch (e) {
        console.log(e)
        // reinitialize if something goes wrong
        await new Promise((resolve) => setTimeout(resolve, 500))
        await initialize()
    }
}

const getHeaders = () => {
    if (api) {
        return Promise.resolve(api.getInstance().headers)
    }
    return initialize().then((api) => api.getInstance().headers)
}

const create = (token) => {
    // ------
    // STEP 1
    // ------
    //
    // Create and configure an apisauce-based api object.
    //
    const apiInstance = apisauce.create({
        // base URL is read from the "constructor"
        baseURL: Secrets.API_BASE_URL,
        // here are some default headers
        headers: {
            Authorization: `Bearer ${token.accessToken}`
        },
        // 30 second timeout
        timeout: 30000
    })

    // Wrap api's addMonitor to allow the calling code to attach
    // additional monitors in the future.  But only in __DEV__ and only
    // if we've attached Reactotron to console (it isn't during unit tests).
    if (__DEV__ && console.tron) {
        apiInstance.addMonitor(console.tron.apisauce)
    }

    // ------
    // STEP 2
    // ------
    //
    // Define some functions that call the api.  The goal is to provide
    // a thin wrapper of the api layer providing nicer feeling functions
    // rather than "get", "post" and friends.
    //
    // I generally don't like wrapping the output at this level because
    // sometimes specific actions need to be take on `403` or `401`, etc.
    //
    // Since we can't hide from that, we embrace it by getting out of the
    // way at this level.
    //
    const getDummy = () => apiInstance.get('/')

    const getData = () => apiInstance.get('/data')

    const getCategoryMap = () => apiInstance.get('/data/categoryMap')

    const searchBrands = (searchText) =>
        apiInstance.get('/brand', {
            query: {name: `~${searchText}`},
            select: 'name,image',
            populate: 'image'
        })

    const searchBrandByName = (searchText) =>
        apiInstance.get('/brand', {
            query: {name: `${searchText}`},
            select: 'name,image',
            populate: 'image'
        })

    const getInstance = () => apiInstance

    const uploadMedia = (file) => apiInstance.post('/upload', file)

    // ------
    // STEP 3
    // ------
    //
    // Return back a collection of functions that we would consider our
    // interface.  Most of the time it'll be just the list of all the
    // methods in step 2.
    //
    // Notice we're not returning back the `api` created in step 1?  That's
    // because it is scoped privately.  This is one way to create truly
    // private scoped goodies in JavaScript.
    //
    return {
        // a list of the API functions from step 2
        getDummy,
        getCategoryMap,
        getData,
        searchBrands,
        searchBrandByName,
        uploadMedia,
        getInstance
    }
}

// let's return back our create method as the default.
export default {
    initialize,
    getHeaders
}
