import { takeLatest, takeEvery, call, all } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { ApplicationTypes } from '../Redux/ApplicationRedux'
import { BarcodeTypes } from '../Redux/BarcodeRedux'
import { AlertTypes } from '../Redux/AlertRedux'
import { SageTypes } from '../Redux/SageRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { reset } from './ApplicationSagas'
import { setBarcodeRequest } from './BarcodeSagas'
import { alertPopulate } from './AlertSagas'
import { getCategoryMap, searchBrands, uploadMedia } from './SageSagas'

/* ------------- Connect Types To Sagas ------------- */

export default function * rootSaga ([ apolloClient ]) {
  // The API we use is only used from Sagas, so we create it here and pass along
  // to the sagas which need it.
  const api = DebugConfig.useFixtures ? FixtureAPI : yield call(API.initialize)
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    // others get additionals arguments like an API singleton or a React Apollo Client
    takeLatest(ApplicationTypes.APPLICATION_DATA_RESET_REQUEST, reset, api, apolloClient),
    takeLatest(BarcodeTypes.SET_BARCODE_REQUEST, setBarcodeRequest),
    takeLatest(AlertTypes.ALERT_POPULATE, alertPopulate),
    takeLatest(SageTypes.CATEGORY_MAP_REQUEST, getCategoryMap, api, apolloClient),
    takeLatest(SageTypes.SEARCH_BRANDS_REQUEST, searchBrands, api, apolloClient),
    takeEvery(SageTypes.UPLOAD_MEDIA_REQUEST, uploadMedia, api, apolloClient)
  ])
}
