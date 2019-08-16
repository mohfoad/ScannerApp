import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import SettingsScreen from './index'
import ApplicationActions from '../../Redux/ApplicationRedux'
import {NavigationActions, StackActions} from 'react-navigation'

class SettingsScreenWrapper extends React.Component {
    resetNavigation = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'LoginScreen'})]
        });
        this.props.navigation.dispatch(resetAction)
    };

    render() {
        const {settingApplicationData, resettingApplicationData, navigation} = this.props;

        return (
            <SettingsScreen
                resetNavigation={this.resetNavigation}
                handleReset={this.props.resetApplicationData}
                navigation={navigation}
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
});

const mapDispatchToProps = (dispatch) => ({
    setApplicationData: (key, value) => dispatch(ApplicationActions.applicationDataSetRequest(key, value)),
    resetApplicationData: () => dispatch(ApplicationActions.applicationDataResetRequest())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsScreenWrapper)
