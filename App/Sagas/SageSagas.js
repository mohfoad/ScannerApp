import { call, put, select } from 'redux-saga/effects'
import SageActions from '../Redux/SageRedux'
import { pathOr, union } from 'ramda'
import RNFetchBlob from 'react-native-fetch-blob'
import RNFS from 'react-native-fs'
import API from '../Services/Api'
import ApplicationActions from '../Redux/ApplicationRedux'

export const uploadedLocalPathsSelector = state => state.application.data.uploadedLocalPaths || []
export const uploadedRemoteMediaSelector = state => state.application.data.uploadedRemoteMedia || []

export function * getCategoryMap (api, apolloClient) {
  // make the call to the api
  const response = yield call(api.getCategoryMap)
  // success?
  if (response.ok) {
    const results = pathOr([], ['data'], response)
    yield put(SageActions.categoryMapSuccess(results))
  } else {
    yield put(SageActions.categoryMapFailure())
  }
}

export function * searchBrands (api, apolloClient, { searchText }) {
  // make the call to the api
  const response = yield call(api.searchBrands, searchText)
  const specificResponse = yield call(api.searchBrandByName, searchText)
  // success?
  if (response.ok && specificResponse.ok) {
    const results = pathOr([], ['data'], response)
    const specificResults = pathOr([], ['data'], specificResponse)
    yield put(SageActions.searchBrandsSuccess(union(specificResults, results)))
  } else {
    yield put(SageActions.searchBrandsFailure())
  }
}

export function * uploadMedia (api, apolloClient, action) {
  // make the call to the api
  const { filePath } = action
  const uploadedLocalPaths = yield select(uploadedLocalPathsSelector)
  const alreadyUploaded = !!uploadedLocalPaths.find(path => path === filePath)

  if (!alreadyUploaded) {
    const endpoint = `${api.getInstance().getBaseURL()}/upload`
    const base64Data = yield RNFS.readFile(filePath, 'base64').then(imageBase64 => imageBase64)
    const headers = yield call(API.getHeaders)

    const { response, success } = yield RNFetchBlob.fetch(
      'POST',
      endpoint,
      {
        Authorization: headers.Authorization,
        'Content-Type': 'multipart/form-data'
      },
      [
        {
          name: 'file',
          filename: 'media.jpg',
          type: 'image/jpeg',
          data: base64Data
        }
      ]
    )
    .then(res => ({
      response: res,
      success: true
    }))
    .catch(err => ({
      response: err,
      success: false
    }))

    // success?
    if (success) {
      const uploadedRemoteMedia = yield select(uploadedRemoteMediaSelector)
      const uploadedMedia = JSON.parse(response.data)
      yield put(ApplicationActions.applicationDataSetRequest('uploadedLocalPaths', [...uploadedLocalPaths, filePath]))
      yield put(ApplicationActions.applicationDataSetRequest('uploadedRemoteMedia', [...uploadedRemoteMedia, {...uploadedMedia, ...{localPath: filePath}}]))
      yield put(SageActions.uploadMediaSuccess(uploadedMedia))
    } else {
      yield put(SageActions.uploadMediaFailure())
    }
  } else {
    yield put(SageActions.uploadMediaFailure())
  }
}
