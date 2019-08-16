import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Index from './index'
import ApplicationActions from '../../Redux/ApplicationRedux'
import AlertActions from '../../Redux/AlertRedux'
import SageActions from '../../Redux/SageRedux'
import BackAndHelpNavigationBar from '../../Components/BackAndHelpNavigationBar'
import { pathOr } from 'ramda'
import Immutable from 'seamless-immutable'
import { compose } from 'recompose'
import { withUpcData } from '../../Decorators/withData'

class CameraScreenWrapper extends React.Component {
  handleNextStep = (instanceState) => {
    this.setState({ instanceState })
    this.props.setApplicationData('camera', instanceState)
  }

  savePhotoPath = (path) => {
    this.props.setApplicationData('photos', [...this.props.photos, path])
  }

  onBack = () => this.props.setBarcode(null)

  handleBack = (onBack) => {
    this.props.updateUpc({ payload: {}, photos: [] })
    onBack()
  }

  render () {
    const { navigation, photos, uploadMedia, populateAlert, data, updateUpc } = this.props

    const { isRetaking } = pathOr({}, ['state', 'params'], navigation)

    return (
      <BackAndHelpNavigationBar
        navigation={navigation}
        title={'New Entry'}
        compact
        onBack={this.onBack}
        confirmBack={(onBack) =>
          !data.touched
            ? null
            : [
              'Discard Progress',
              'You are about to discard your progress if you go back',
              [
                  { text: 'Go Back', onPress: () => this.handleBack(onBack), style: 'destructive' },
                  { text: 'Cancel', onPress: () => {} }
              ]
            ]
        }
      >
        <Index
          handleNextStep={this.handleNextStep}
          savePhotoPath={this.savePhotoPath}
          photos={photos}
          navigation={navigation}
          uploadMedia={uploadMedia}
          isRetaking={isRetaking}
          populateAlert={populateAlert}
          data={data}
          updateUpc={updateUpc}
        />
      </BackAndHelpNavigationBar>
    )
  }
}

const mapStateToProps = ({ application, sage: { barcode } }) => ({
  currentDatum: application.currentDatum,
  photos: pathOr([], ['photos'], application.data),
  settingApplicationData: application.setting,
  upc: barcode
})

const mapDispatchToProps = (dispatch) => ({
  uploadMedia: (file) => dispatch(SageActions.uploadMediaRequest(file)),
  setApplicationData: (key, value) => dispatch(ApplicationActions.applicationDataSetRequest(key, value)),
  populateAlert: (message, type = 'success', title = 'Capture Photos') =>
    dispatch(AlertActions.alertPopulate(message, type, title)),
  setBarcode: (...args) => dispatch(SageActions.setBarcode(...args))
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withUpcData
)(CameraScreenWrapper)
