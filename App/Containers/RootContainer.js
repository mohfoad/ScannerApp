import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {updateFocus} from 'react-navigation-is-focused-hoc'
import {Image, View, StatusBar, AlertIOS, NetInfo, Animated, WebView, TouchableOpacity, Text} from 'react-native'
import Navigation from '../Navigation/AppNavigation'
import {connect} from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import SageActions from '../Redux/SageRedux'
import ReduxPersist from '../Config/ReduxPersist'
import {MessageBar, MessageBarManager} from 'react-native-message-bar'
import {notifyAndLogError} from '../Lib/bugsnag'
import AutoQuickSync from '../Components/AutoQuickSync'
import LoadingView from '../Components/LoadingView'
import {isEmpty, pathOr, find, propEq, isNil} from 'ramda'
import ApplicationActions from '../Redux/ApplicationRedux'

// Styles
import Styles, {alertColors, statusBarColor} from './Styles/RootContainerStyles'
import {Metrics, Colors, Images} from '../Themes'

const infoStrokeColor = alertColors.info
const infoBackgroundColor = alertColors.info
const errorStrokeColor = alertColors.error
const errorBackgroundColor = alertColors.error
const successStrokeColor = alertColors.success
const successBackgroundColor = alertColors.success

class RootContainer extends Component {
    static propTypes = {
        startup: PropTypes.func.isRequired,
        setHasInternet: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            currentScreen: null,
            webViewScale: new Animated.Value(1),
            webViewOpacity: new Animated.Value(0),
            webViewTranslateY: new Animated.Value(-Metrics.screenHeight)
        }
    }

    componentWillMount() {
        NetInfo.isConnected.addEventListener('change', this.handleConnectivityChange)
    }

    componentDidMount() {
        // if redux persist is not active fire startup action
        if (!ReduxPersist.active) this.props.startup()
        MessageBarManager.registerMessageBar(this.refs.alert)
    }

    handleConnectivityChange = (isConnected) => {
        this.props.setHasInternet(isConnected)
    }

    _closeWebView = () => {
        this._hideWebView(() => {
            this.props.setApplicationData('currentWebViewSource', null)
        })
    }

    _showWebView = () => {
        Animated.parallel([
            Animated.timing(this.state.webViewOpacity, {
                toValue: 1,
                duration: Metrics.shortDuration,
                useNativeDriver: true
            }),
            Animated.timing(this.state.webViewScale, {
                toValue: 1,
                duration: Metrics.shortDuration,
                useNativeDriver: true
            }),
            Animated.timing(this.state.webViewTranslateY, {
                toValue: 0,
                duration: Metrics.shortDuration,
                useNativeDriver: true
            })
        ]).start()
    }

    _hideWebView = (cb = () => {
    }) => {
        Animated.parallel([
            Animated.timing(this.state.webViewOpacity, {
                toValue: 0,
                duration: Metrics.shortDuration,
                useNativeDriver: true
            }),
            Animated.timing(this.state.webViewScale, {
                toValue: 1,
                duration: Metrics.shortDuration,
                useNativeDriver: true
            }),
            Animated.timing(this.state.webViewTranslateY, {
                toValue: Metrics.screenHeight,
                duration: Metrics.shortDuration,
                useNativeDriver: true
            })
        ]).start(cb)
    }

    componentWillReceiveProps(newProps) {
        this.forceUpdate();
        // show global alert depending on changes to store state with key "alert"
        if (this.props.currentWebViewSource !== newProps.currentWebViewSource) {
            if (newProps.currentWebViewSource) {
                this._showWebView()
            } else {
                this._hideWebView()
            }
        }
        if (this.props.alert !== newProps.alert) {
            if (newProps.alert !== null) {
                MessageBarManager.showAlert({
                    title: newProps.alert.title,
                    message: newProps.alert.message,
                    alertType: newProps.alert.alertType,
                    shouldHideAfterDelay: true,
                    durationToShow: 300,
                    durationToHide: 300,
                    duration: 2000,
                    viewTopInset: 16, // lines up nicely with our custom nav bar + status bar height given the font sizes below
                    stylesheetInfo: {
                        strokeColor: infoStrokeColor,
                        backgroundColor: infoBackgroundColor
                    },
                    stylesheetError: {
                        strokeColor: errorStrokeColor,
                        backgroundColor: errorBackgroundColor
                    },
                    stylesheetSuccess: {
                        strokeColor: successStrokeColor,
                        backgroundColor: successBackgroundColor
                    },
                    titleStyle: {
                        color: alertColors.text,
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginBottom: 4
                    },
                    messageStyle: {
                        color: alertColors.text,
                        fontSize: 16
                    }
                })
            } else {
                MessageBarManager.hideAlert()
            }
        }
    }

    componentWillUnmount() {
        // Remove the alert located on this master page from the manager
        MessageBarManager.unregisterMessageBar()
    }

    // gets the current screen from navigation state
    getCurrentRouteName(navigationState) {
        if (!navigationState) {
            return null
        }
        const route = navigationState.routes[navigationState.index];
        // dive into nested navigators
        if (route.routes) {
            return this.getCurrentRouteName(route)
        }
        return route.routeName
    }

    _renderWebViewLoadingView = () => {
        return <LoadingView/>
    };

    _renderWebView = () => {
        const {currentWebViewSource, currentWebViewTitle} = this.props
        if (!currentWebViewSource) {
            return null
        }
        return (
            <Animated.View
                style={[
                    {
                        opacity: this.state.webViewOpacity,
                        transform: [{scale: this.state.webViewScale}, {translateY: this.state.webViewTranslateY}]
                    },
                    Styles.webviewContainer
                ]}
            >
                <Text style={Styles.webviewContainerTitleText}>{currentWebViewTitle}</Text>
                <TouchableOpacity style={Styles.closeImageContainer} onPress={this._closeWebView}>
                    <Image source={Images.close} style={Styles.closeImage}/>
                </TouchableOpacity>
                <View style={Styles.webviewSpacer}/>
                <WebView
                    renderLoading={this._renderWebViewLoadingView}
                    startInLoadingState
                    style={Styles.webview}
                    source={{uri: currentWebViewSource}}
                />
            </Animated.View>
        )
    };

    render() {
        return (
            <View style={Styles.applicationView}>
                <StatusBar barStyle="light-content" backgroundColor={statusBarColor}/>
                {!this.state.currentScreen ? null : <AutoQuickSync currentScreen={this.state.currentScreen}/>}
                <Navigation
                    onNavigationStateChange={(prevState, currentState) => {
                        updateFocus(currentState);
                        const currentScreen = this.getCurrentRouteName(currentState);
                        const prevScreen = this.getCurrentRouteName(prevState);
                        if (prevScreen !== currentScreen) {
                            this.setState({currentScreen});
                            switch (currentScreen) {
                                case 'OnboardingScreen':
                                case 'LoginScreen':
                                case 'SettingsScreen':
                                case 'ScannerScreen':
                                    StatusBar.setBarStyle('light-content');
                                    break;
                                default:
                                    StatusBar.setBarStyle('dark-content');
                                    break;
                            }
                        }
                    }}
                />
                {this._renderWebView()}
                <MessageBar ref="alert"/>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    alert: state.alert,
    currentWebViewSource: pathOr(null, ['currentWebViewSource'], state.application.data),
    currentWebViewTitle: pathOr(null, ['currentWebViewTitle'], state.application.data)
});

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
    startup: StartupActions.startup,
    setHasInternet: SageActions.setHasInternet,
    setApplicationData: (key, value) => dispatch(ApplicationActions.applicationDataSetRequest(key, value))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RootContainer)
