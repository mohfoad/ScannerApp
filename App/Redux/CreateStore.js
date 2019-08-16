import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {autoRehydrate} from 'redux-persist'
import createActionBuffer from 'redux-action-buffer'
import Config from '../Config/DebugConfig'
import createSagaMiddleware from 'redux-saga'
import RehydrationServices from '../Services/RehydrationServices'
import ReduxPersist from '../Config/ReduxPersist'
import thunk from 'redux-thunk'
import _ from 'lodash'
import Storage from '../Utils/Storage'

const storageLinkMiddleware = ({getState}) => next => action => {
    next(action)
    const tag = _.get(getState(), ['sage', 'tag'])
    Storage.setQueryDataDebounced(tag ? {tag} : null)
}

// creates the store
export default (rootReducer, rootSaga) => {
    /* ------------- Redux Configuration Of Middlewares & Enhancers Prior To Store Creation ------------- */

    /* ------------- Saga Middleware ------------- */

    const sagaMonitor = __DEV__ ? console.tron.createSagaMonitor() : null
    const sagaMiddleware = createSagaMiddleware({sagaMonitor})

    /* ------------- Assemble Middlewares ------------- */
    const appliedMiddlewares = applyMiddleware(
        sagaMiddleware,
        thunk,
        storageLinkMiddleware,
        createActionBuffer('persist/REHYDRATE') // redux-persist.REHYDRATE is not a thing :(
    )

    // add the autoRehydrate enhancer if appropriate
    const enhancers = ReduxPersist.active
        ? composeWithDevTools(
            autoRehydrate(),
            appliedMiddlewares
        )
        : composeWithDevTools(
            appliedMiddlewares
        )

    /* ------------- AutoRehydration & Store Creation ------------- */

    // if Reactotron is enabled (default for __DEV__), we'll create the store through Reactotron
    const createAppropriateStore = Config.useReactotron ? console.tron.createStore : createStore
    const store = createAppropriateStore(rootReducer, enhancers)

    // configure persistStore and check reducer version number
    if (ReduxPersist.active) {
        RehydrationServices.updateReducers(store)
    }

    // kick off root saga
    sagaMiddleware.run(rootSaga, [])

    return store
}
