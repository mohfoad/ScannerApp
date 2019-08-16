import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import OnboardingScreen from './index'
import ApplicationActions from '../../Redux/ApplicationRedux'
import { NavigationActions, StackActions } from 'react-navigation'

class OnboardingScreenWrapper extends React.Component {
  resetNavigation = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'ScannerScreen' })]
    })
    this.props.navigation.dispatch(resetAction)
  }

  handleNextStep = (instanceState) => {
    this.setState({
      instanceState
    })
    this.props.setApplicationData('login', instanceState)
  }

  render () {
    const { resettingApplicationData, settingApplicationData, navigation } = this.props

    return (
      <OnboardingScreen
        handleNextStep={this.handleNextStep}
        handleReset={this.props.resetApplicationData}
        navigation={navigation}
        resetNavigation={this.resetNavigation}
        settingApplicationData={settingApplicationData}
        resettingApplicationData={resettingApplicationData}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  currentDatum: state.application.currentDatum,
  settingApplicationData: state.application.setting,
  resettingApplicationData: state.application.resetting
})

const mapDispatchToProps = (dispatch) => ({
  setApplicationData: (key, value) => dispatch(ApplicationActions.applicationDataSetRequest(key, value)),
  resetApplicationData: () => dispatch(ApplicationActions.applicationDataResetRequest())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingScreenWrapper)
