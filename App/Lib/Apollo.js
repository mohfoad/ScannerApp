import Secrets from 'react-native-config'
import CookieManager from 'react-native-cookies'
import API from '../Services/Api'

import {AsyncStorage} from 'react-native'
import {ApolloClient} from 'apollo-client'
import {ApolloLink} from 'apollo-link'
import { createHttpLink } from 'apollo-link-http';
import {onError} from 'apollo-link-error'
import {createUploadLink} from 'apollo-upload-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {CachePersistor} from 'apollo-cache-persist'
import {setContext} from 'apollo-link-context'
import {RetryLink} from 'apollo-link-retry'
import {get as _get, forEach as _forEach} from 'lodash'

const BUILD_NUMBER = 2;
const SCHEMA_VERSION_KEY = 'schemaVersion'
const SCHEMA_VERSION = `0.1.2b${BUILD_NUMBER}`

let _persistor = null

export const restoreOrPurgeCache = async (persistor, override = false) => {
    // Read the current schema version from AsyncStorage.
    const currentVersion = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);
    if (!_persistor && persistor) {
        _persistor = persistor
    }
    if (override && _persistor) {
        console.log('force purging apollo cache')
        await _persistor.purge()
    }
    // always purge for now on startup
    const falseValue = true
    if (currentVersion === SCHEMA_VERSION && falseValue) {
        // If the current version matches the latest version,
        // we're good to go and can restore the cache.
        console.log('restoring apollo cache')
        await persistor.restore()
    } else {
        // Otherwise, we'll want to purge the outdated persisted cache
        // and mark ourselves as having updated to the latest version.
        console.log('purging apollo cache')
        await persistor.purge()
        await AsyncStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION)
    }
}

export const getApolloClient = () => {
    const cache = new InMemoryCache({
        dataIdFromObject: ({__typename, _id, name, type}) =>
            __typename && _id ? `${__typename}:${_id}` : __typename === 'Session' ? 'Session' : null
    })

    const persistor = new CachePersistor({
        cache,
        storage: AsyncStorage
    })

    restoreOrPurgeCache(persistor)

    const oauthLink = setContext((operation, {headers}) => {
        return API.getHeaders().then((data) => {
            return {
                headers: {
                    ...headers,
                    Authorization: data.Authorization || 'NULL AUTH',
                    'X-GraphQL-Operation': (operation && operation.operationName) || 'none',
                    'X-Cookie-Domain': Secrets.API_BASE_URL
                }
            }
        })
    })

    console.log('[API]', Secrets.API_BASE_URL)

    const uploadLink = createUploadLink({
        uri: `${Secrets.API_BASE_URL}/graphql`,
        credentials: 'include',
        fetch: (uri, options, ...rest) => {
            try {
                if (options.body && typeof options.body === 'string') {
                    const {operationName, query} = JSON.parse(options.body)
                    const [op] = query.match(/query|mutation/) || []
                    uri += '/' + [operationName, op].join(':')
                }
            } catch (ex) {
            }
            return fetch(uri, options, ...rest)
        }
    })

    const httpLink = createHttpLink({
        uri: `${Secrets.API_BASE_URL}/graphql`,
        credentials: 'include'
    });

    const cookieLink_ = new ApolloLink((operation, forward) => {
        console.log('apollo operation', operation)

        return forward(operation).map((response) => {
            const context = operation.getContext();
            const {
                response: { headers }
            } = context
            if (headers.get('set-cookie')) {
                // Set cookies from a response header
                // This allows you to put the full string provided by a server's Set-Cookie
                // response header directly into the cookie store.
                const cookie = headers.get('set-cookie');
                CookieManager.setFromResponse(Secrets.API_BASE_URL, {
                    'Set-Cookie"': Array.isArray(cookie) ? cookie.join('; ') : cookie
                })
            }
            // console.log('apollo context and resp: ', context, response)

            return response
        })
    })

    const cookieLink = cookieLink_.concat(httpLink);

    const errorLink = onError(({graphQLErrors, networkError, response, operation}) => {
        if (operation.operationName === 'trackingRecentEntries') {
            response.errors = null
        }

        if (graphQLErrors) {
            graphQLErrors.map(({message, locations, path}) =>
                console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
            )
        }
        if (networkError) console.log(`[Network error]: ${networkError}`)
    })

    const retryLink = new RetryLink({
        delay: {
            initial: 200,
            max: Infinity,
            jitter: true
        },
        attempts: {
            max: 3,
            retryIf: (error /*, _operation */) => !!error
        }
    })

    // use with apollo-client
    const link = ApolloLink.from([
        oauthLink,
        // retryLink,
        errorLink,
        cookieLink,
        uploadLink
    ])

    const client = new ApolloClient({
        queryDeduplication: true,
        connectToDevTools: false,
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'cache-and-network',
                errorPolicy: 'ignore'
            },
            query: {
                fetchPolicy: 'cache-first',
                errorPolicy: 'all'
            },
            mutate: {
                errorPolicy: 'all'
            }
        },
        link,
        cache
    })

    return client
}

export const apolloClient = getApolloClient();
