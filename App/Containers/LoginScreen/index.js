import React from 'react';
import PropTypes from 'prop-types';
import ReactNative, {View, ScrollView, Text, Keyboard, UIManager, AsyncStorage} from 'react-native';
import {compose, withPropsOnChange} from 'recompose';

import {get as _get} from 'lodash';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';

import * as inputValidators from '../../Lib/InputValidators';
import {keyboardDidShow, keyboardDidHide} from '../../Lib/ComponentEventHandlers';
import {Metrics, Images, Colors} from '../../Themes';
import ValidatedFormScreen from '../ValidatedFormScreen';
import Button from '../../Components/Button';
import ValidatedTextInput from '../../Components/ValidatedTextInput';

// React Apollo
import {withAuth, withCreateAccount, withLogin} from '../../GraphQL/Account/decorators';

// Styles
import styles from '../Styles/LoginScreenStyles';

const FORGOT_PASSWORD_URL = 'https://pinto.co/forgot';
const FORGOT_PASSWORD_TITLE = 'Forgot Password';

class Index extends ValidatedFormScreen {
    static propTypes = {
        settingApplicationData: PropTypes.bool,
        resettingApplicationData: PropTypes.bool,
        login: PropTypes.func.isRequired,
        createAccount: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            // email: __DEV__ ? 'bot-photo-entry@sageproject.com' : null,
            // password: __DEV__ ? 'justsagebot123' : null,
            email: null,
            password: null,
            visibleHeight: Metrics.screenHeight,
            loading: false,
            isErrored: false
        };

        this.isLoggingIn = false;
        this.scrollY = 0
    }

    componentDidMount() {
    }

    async componentWillMount() {
        this.props.setApplicationData('currentWebViewSource', null);
        this.props.setApplicationData('currentWebViewTitle', null);
        if (this.navigateIfNeeded()) return;
        // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
        // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide.bind(this));
        this.keyboardDidHideScrollBackListener = Keyboard.addListener(
            'keyboardDidHide',
            this.handleKeyboardDidHideScrollBack
        );
        try {
            const {email, password} = JSON.parse(await AsyncStorage.getItem('credentials'));
            this.setState({email, password})
        } catch (ex) {
        }
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.keyboardDidHideScrollBackListener.remove();
    }

    componentWillReceiveProps(nextProps) {
        if (!this.navigateIfNeeded(nextProps)) this.forceUpdate()
    }

    navigateIfNeeded({auth, navigation} = this.props) {
        if (!navigation.isFocused()) return;// react-stack-navigator does not unmount components...
        if (auth && !auth.loading && auth.session.isAuthenticated) {
            console.log('@DMITRI: auth', auth);
            navigation.navigate(
                _.get(auth, 'session.user.photoEntry.partner') && _.get(auth, 'session.user.photoEntry.store')
                    ? 'ScannerScreen'
                    : !_.get(auth, 'session.user.photoEntry.partner')
                    ? 'PartnerSelectorScreen'
                    : 'StoreSelectorScreen',
                {
                    transition: 'card'
                }
            );
            return true
        }

        return false
    }

    handlePressLogin = async () => {
        const {email, password} = this.state;
        this.isLoggingIn = true;
        this.setState({loading: true}, async () => {
            try {
                const {data, errors} = await this.props.login({
                    variables: {
                        email,
                        password
                    }
                });
                if (!data || !data.login) {
                    console.warn('Login failed', errors);
                    this.setState({loading: false, isErrored: true});
                    this.isLoggingIn = false
                } else {
                    this.setState({loading: false, isErrored: false});
                    await AsyncStorage.setItem('credentials', JSON.stringify({email, password}));
                    this.navigateIfNeeded()
                }
            } catch (e) {
                this.setState({loading: false, isErrored: true});
                this.isLoggingIn = false;
                this.props.handleReset(this.state)
            }
        })
    }

    handleOnSubmitEditing = (nextField) => {
        if (typeof this.refs[nextField].handleFocusFromParent === 'function') {
            this.refs[nextField].handleFocusFromParent()
        }
    };

    handleKeyboardDidHideScrollBack = () => {
        this.scrollView.scrollTo({
            y: 0,
            animated: true
        })
    };

    handleFocusChange = (ref) => {
        const handle = ReactNative.findNodeHandle(this.refs[ref])
        // scroll parent scrollview to focused input field y-offset
        UIManager.measureLayoutRelativeToParent(
            handle,
            (e) => {
                console.error(e)
            },
            (x, y, w, h) => {
                this.scrollView.scrollTo({
                    y,
                    animated: true
                })
            }
        )
    };

    _handleResetPassword = () => {
        this.props.setApplicationData('currentWebViewSource', FORGOT_PASSWORD_URL);
        this.props.setApplicationData('currentWebViewTitle', FORGOT_PASSWORD_TITLE)
    };

    renderInputs = () => {
        const {settingApplicationData} = this.props;
        const {email, password} = this.state;
        const editable = !settingApplicationData;
        const errorMessage = 'Required';

        return [
            <View key="logoRow" style={styles.promptRow}>
                <Animatable.Image source={Images.sageProject} style={styles.logo} animation="fadeIn"/>
                <Animatable.Text style={styles.prompt} animation="fadeIn">
                    Sign in to your account
                </Animatable.Text>
            </View>,
            <Animatable.View
                transition="opacity"
                key="errorRow"
                style={[styles.errorRow, {opacity: this.state.isErrored ? 1 : 0}]}
            >
                <Animatable.Image source={Images.alert} style={styles.alert} animation="fadeIn"/>
                <Animatable.Text style={styles.errorText} animation="fadeIn">
                    That email/password combo isn’t quite right.
                </Animatable.Text>
            </Animatable.View>,
            <Animatable.View key="emailRow" style={styles.emailRow} animation="fadeIn" delay={200}>
                <Text style={styles.rowLabel}>Email</Text>
                <ValidatedTextInput
                    placeholder={'Email'}
                    name="EMAIL"
                    returnKeyType="next"
                    index="email"
                    ref="email"
                    editable={editable}
                    required
                    value={email}
                    onFocus={this.handleFocusChange}
                    onChange={(value) => this.setState({email: value})}
                    validationFn={inputValidators.emailValidator}
                    onValidityChange={this.handleValidityChange}
                    onSubmitEditing={this.handleOnSubmitEditing.bind(null, 'password')}
                    errorMessage={errorMessage}
                    autoCapitalize="none"
                    inverted
                />
            </Animatable.View>,
            <Animatable.View key="passwordRow" style={styles.passwordRow} animation="fadeIn" delay={200}>
                <Text style={styles.rowLabel}>Password</Text>
                <ValidatedTextInput
                    placeholder={'Password'}
                    name="PASSWORD"
                    required
                    secureTextEntry
                    returnKeyType="go"
                    index="password"
                    ref="password"
                    value={password}
                    onFocus={this.handleFocusChange}
                    onChange={(value) => this.setState({password: value})}
                    validationFn={inputValidators.requiredValidator}
                    onValidityChange={this.handleValidityChange}
                    onSubmitEditing={this.handlePressLogin}
                    errorMessage={errorMessage}
                    autoCapitalize="none"
                    inverted
                />
            </Animatable.View>
        ]
    };

    render() {
        const {loading} = this.state;

        return (
            <View style={{height: this.state.visibleHeight, backgroundColor: Colors.primary}}>
                <ScrollView
                    style={styles.mainContainer}
                    contentContainerStyle={{}}
                    onScroll={(e) => {
                        this.scrollY = e.nativeEvent.contentOffset.y
                    }}
                    scrollEventThrottle={32}
                    ref={(sv) => {
                        this.scrollView = sv
                    }}
                >
                    <View style={styles.form}>
                        {this.renderInputs()}
                        <Animatable.View style={[styles.forgotPasswordRow]} animation="fadeIn" delay={200}>
                            <Text style={styles.requiredText}>* Required</Text>
                            <Text style={styles.link} onPress={this._handleResetPassword}>
                                Forgot password?
                            </Text>
                        </Animatable.View>
                        <Animatable.View style={[styles.loginRow]} animation="fadeIn" delay={200}>
                            <Button
                                loading={loading}
                                onPress={this.handlePressLogin}
                                text={'Sign in'}
                                inverted
                                style={styles.button}
                            />
                            <Text
                                style={styles.signUpLink}
                                onPress={() => this.props.navigation.navigate('EnterCodeScreen', {transition: 'card'})}
                            >
                                or sign up
                            </Text>
                            <View style={styles.termsOfWebView}>
                                <Text style={styles.termsText}>By signing up and using this service, you agree to Pinto’s <Text style={styles.webViewText}> Terms of Use</Text></Text>
                            </View>
                        </Animatable.View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const enhance = compose(
    withAuth,
    withPropsOnChange(
        (props, nextProps) =>
            _get(props, 'auth.session.isAuthenticated', false) !== _get(nextProps, 'auth.session.isAuthenticated', false),
        ({auth}) => ({isAuthenticated: _get(auth, 'session.isAuthenticated', false)})
    ),
    withLogin,
    withCreateAccount
);

export default enhance(Index)
