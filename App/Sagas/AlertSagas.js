import { call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import AlertActions from '../Redux/AlertRedux'

// populate alert and then reset it after a delay
export function* alertPopulate(action) {
  yield call(delay, 3000)
  yield put(AlertActions.alertReset())
}
