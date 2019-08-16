import { put } from 'redux-saga/effects'
import ApplicationActions from '../Redux/ApplicationRedux'
import BarcodeActions from '../Redux/BarcodeRedux'

// resets application state (including Apollo?)
export function * reset (api, apolloClient) {
  // apolloClient.resetStore()
  yield put(ApplicationActions.applicationDataResetSuccess())
  yield put(BarcodeActions.barcodeResetSuccess())
}
