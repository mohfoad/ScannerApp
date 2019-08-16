import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ConfirmProductPhotosScreen from './index'
import ApplicationActions from '../../Redux/ApplicationRedux'
import BarcodeActions from '../../Redux/BarcodeRedux'
import AlertActions from '../../Redux/AlertRedux'
import BackAndHelpNavigationBar from '../../Components/BackAndHelpNavigationBar'
import { NavigationActions, StackActions } from 'react-navigation'

class ConfirmProductPhotosScreenWrapper extends React.Component {
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
    this.setState({ instanceState })
    // this.props.resetBarcode()
    this.resetNavigation()
  }

  componentDidMount () {
    const { currentBarcode, setCurrentBarcode, navigation } = this.props
    const { barcode } = navigation.state.params
    if (currentBarcode !== barcode) {
      setCurrentBarcode(barcode)
    }
  }

  render () {
    const { navigation, populateAlert, currentBarcode, setApplicationData, resetBarcode } = this.props

    const { barcode } = navigation.state.params

    return (
      <BackAndHelpNavigationBar navigation={navigation} title={'Check Product'}>
        <ConfirmProductPhotosScreen
          handleNextStep={this.handleNextStep}
          navigation={navigation}
          resetNavigation={this.resetNavigation}
          populateAlert={populateAlert}
          barcode={barcode || currentBarcode || '1'}
          searchText={barcode || currentBarcode}
          resetBarcode={resetBarcode}
          setApplicationData={setApplicationData}
        />
      </BackAndHelpNavigationBar>
    )
  }
}

const mapStateToProps = (state) => ({
  currentDatum: state.application.currentDatum,
  settingApplicationData: state.application.setting,
  currentBarcode: state.barcode.currentBarcode
})

const mapDispatchToProps = (dispatch) => ({
  setApplicationData: (key, value) => dispatch(ApplicationActions.applicationDataSetRequest(key, value)),
  setCurrentBarcode: (barcode) => dispatch(BarcodeActions.setBarcodeRequest(barcode)),
  resetBarcode: () => dispatch(BarcodeActions.barcodeResetSuccess()),
  populateAlert: (message, type = 'success', title = 'Confirm Product') =>
    dispatch(AlertActions.alertPopulate(message, type, title))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmProductPhotosScreenWrapper)
