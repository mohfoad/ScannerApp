import { put } from 'redux-saga/effects'
import BarcodeActions from '../Redux/BarcodeRedux'

export function * setBarcodeRequest ({ barcode }) {
  if (!barcode) {
    yield put(BarcodeActions.setBarcodeFailure('ERROR'))
  } else {
    yield put(BarcodeActions.setBarcodeSuccess())
  }
}
