import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import NewProductScreen from './index'
import ApplicationActions from '../../Redux/ApplicationRedux'
import BarcodeActions from '../../Redux/BarcodeRedux'
import AlertActions from '../../Redux/AlertRedux'
import SageActions from '../../Redux/SageRedux'
import { NavigationActions, StackActions } from 'react-navigation'
import BackAndHelpNavigationBar from '../../Components/BackAndHelpNavigationBar'
import { pathOr } from 'ramda'

class NewProductScreenWrapper extends React.Component {
  resetNavigation = () => {
    const resetAction = StackActions.reset({
      index: 2,
      actions: [
        NavigationActions.navigate({ routeName: 'OnboardingScreen' }),
        NavigationActions.navigate({ routeName: 'LoginScreen' }),
        NavigationActions.navigate({ routeName: 'ScannerScreen' })
      ]
    })

    this.props.navigation.dispatch(resetAction)
  }

  handleNextStep = (instanceState) => {
    this.props.resetApplicationData()
    this.props.resetBarcode()
    this.resetNavigation()
  }

  componentDidMount () {
    const { currentBarcode, setCurrentBarcode, getCategoryMap, navigation } = this.props

    const { barcode } = pathOr({}, ['state', 'params'], navigation)

    getCategoryMap()

    if (currentBarcode !== barcode) {
      setCurrentBarcode(barcode)
    }
  }

  render () {
    const {
      navigation,
      currentBarcode,
      categories,
      brands,
      photos,
      uploadMedia,
      uploadedRemoteMedia,
      populateAlert,
      resetApplicationData,
      searchBrands,
      setApplicationData,
      topology
    } = this.props

    const { barcode } = pathOr({}, ['state', 'params'], navigation)
    const { shouldUpdate } = pathOr({}, ['state', 'params'], navigation)

    return (
      <BackAndHelpNavigationBar navigation={navigation} title={'New Entry'}>
        <NewProductScreen
          handleNextStep={this.handleNextStep}
          navigation={navigation}
          barcode={barcode || currentBarcode}
          categories={categories}
          brands={brands}
          photos={photos}
          uploadedRemoteMedia={uploadedRemoteMedia}
          uploadMedia={uploadMedia}
          resetApplicationData={resetApplicationData}
          populateAlert={populateAlert}
          searchBrands={searchBrands}
          setApplicationData={setApplicationData}
          shouldUpdate={shouldUpdate}
          topology={topology}
        />
      </BackAndHelpNavigationBar>
    )
  }
}

const mapStateToProps = (state) => ({
  currentDatum: state.application.currentDatum,
  settingApplicationData: state.application.setting,
  currentBarcode: state.barcode.currentBarcode,
  categories: state.sage.categories,
  brands: pathOr([], ['brands'], state.sage),
  topology: pathOr({}, ['topology'], state.application.data),
  photos: pathOr([], ['photos'], state.application.data),
  uploadedRemoteMedia: pathOr([], ['uploadedRemoteMedia'], state.application.data)
})

const mapDispatchToProps = (dispatch) => ({
  setApplicationData: (key, value) => dispatch(ApplicationActions.applicationDataSetRequest(key, value)),
  setCurrentBarcode: (barcode) => dispatch(BarcodeActions.setBarcodeRequest(barcode)),
  resetBarcode: () => dispatch(BarcodeActions.barcodeResetSuccess()),
  populateAlert: (message, type = 'success', title = 'New Product') =>
    dispatch(AlertActions.alertPopulate(message, type, title)),
  getCategoryMap: () => dispatch(SageActions.categoryMapRequest()),
  searchBrands: (searchText) => dispatch(SageActions.searchBrandsRequest(searchText)),
  uploadMedia: (file) => dispatch(SageActions.uploadMediaRequest(file)),
  resetApplicationData: () => dispatch(ApplicationActions.applicationDataResetRequest())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewProductScreenWrapper)
