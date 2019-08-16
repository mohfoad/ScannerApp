import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import ReactNative, {View, ScrollView, Text, Keyboard, UIManager, AsyncStorage} from 'react-native';
import {compose, withPropsOnChange} from 'recompose';
import {get as _get} from 'lodash';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';

import * as inputValidators from '../../Lib/InputValidators';
import {keyboardDidShow, keyboardDidHide} from '../../Lib/ComponentEventHandlers';
import Button from '../../Components/Button';
import ValidatedTextInput from '../../Components/ValidatedTextInput';
import {Metrics, Images, Colors} from '../../Themes';
import styles from './styles';

// React Apollo
import {withAuth, withCreateAccount, withLogin} from '../../GraphQL/Account/decorators';

class CreateAccountScreen extends PureComponent {
    static propTypes = {
        createAccount: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            visibleHeight: Metrics.screenHeight,
            name: {value: null, valid: false, error: null},
            email: {value: null, valid: false, error: null},
            password: {value: null, valid: false, error: null},
            loading: false,
            error: null
        };

        this.isLoggingIn = false;
        this.scrollY = 0
    }

    async componentWillMount() {
        // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
        // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide.bind(this));
        this.keyboardDidHideScrollBackListener = Keyboard.addListener(
            'keyboardDidHide',
            this.handleKeyboardDidHideScrollBack
        )
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.keyboardDidHideScrollBackListener.remove();
    }

    isValid() {
        const {name, email, password} = this.state;
        return name.valid && email.valid && password.valid
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
        const handle = ReactNative.findNodeHandle(this.refs[ref]);
        // scroll parent scrollview to focused input field y-offset
        UIManager.measureLayoutRelativeToParent(
            handle,
            (e) => {
                console.error(e)
            },
            (x, y, w, h) => {
                const {visibleHeight} = this.state;
                const bottom = y + h + 100;
                if (bottom > this.state.visibleHeight) {
                    this.scrollView.scrollTo({
                        y: bottom - this.state.visibleHeight,
                        animated: true
                    })
                }
            }
        )
    };

    handleSubmit = async () => {
        const {name, email, password} = this.state;

        this.setState({loading: true});
        try {
            const {data, errors} = await this.props.createAccount({
                variables: {
                    displayName: name.value,
                    email: email.value,
                    password: password.value
                }
            });
            const error = _.get(errors, '0.message');
            if (error) this.setState({error});
            else {
                await AsyncStorage.setItem('credentials', JSON.stringify({
                    email: email.value,
                    password: password.value
                }));
                this.props.navigation.navigate('ModeSelectorScreen', {transition: 'card'})
            }
        } catch (ex) {
            console.warn(ex)
        }
        this.setState({loading: false})
    };

    render() {
        const {visibleHeight, name, email, password, loading, error} = this.state;

        return (
            <View style={{height: visibleHeight, backgroundColor: Colors.primary}}>
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
                        <View key="logoRow" style={styles.promptRow}>
                            <Animatable.Image source={Images.sageProject} style={styles.logo} animation="fadeIn"/>
                            <Animatable.Text style={styles.prompt} animation="fadeIn">
                                Success! Create your account
                            </Animatable.Text>
                        </View>

                        {error ? (
                            <View style={styles.errorRow}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <Animatable.View style={styles.fullNamRow}>
                            <Text style={styles.rowLabel}>Full Name</Text>
                            <ValidatedTextInput
                                placeholder="Full Name"
                                name="NAME"
                                returnKeyType="next"
                                index="name"
                                ref="name"
                                editable
                                required
                                value={name.value}
                                onChange={(value, event, valid) => {
                                    this.setState({name: {...name, value, valid}})
                                }}
                                validationFn={inputValidators.requiredValidator}
                                onFocus={this.handleFocusChange}
                                onSubmitEditing={this.handleOnSubmitEditing.bind(null, 'email')}
                                errorMessage="Required"
                                inverted
                            />
                        </Animatable.View>
                        <Animatable.View style={styles.emailRow}>
                            <Text style={styles.rowLabel}>Email</Text>
                            <ValidatedTextInput
                                placeholder="Email"
                                name="EMAIL"
                                returnKeyType="next"
                                index="email"
                                ref="email"
                                editable
                                required
                                value={email.value}
                                onChange={(value, event, valid) => {
                                    this.setState({email: {...email, value, valid}})
                                }}
                                onFocus={this.handleFocusChange}
                                validationFn={inputValidators.emailValidator}
                                onSubmitEditing={this.handleOnSubmitEditing.bind(null, 'password')}
                                errorMessage="Required"
                                autoCapitalize="none"
                                inverted
                            />
                        </Animatable.View>
                        <Animatable.View style={styles.passwordRow}>
                            <Text style={styles.rowLabel}>Password</Text>
                            <ValidatedTextInput
                                placeholder="Password"
                                name="PASSWORD"
                                returnKeyType="next"
                                index="password"
                                ref="password"
                                editable
                                required
                                secureTextEntry
                                value={password.value}
                                onChange={(value, event, valid) => {
                                    this.setState({password: {...password, value, valid}})
                                }}
                                validationFn={inputValidators.requiredValidator}
                                onFocus={this.handleFocusChange}
                                onSubmitEditing={this.isValid() ? this.handleSubmit : () => this.handleKeyboardDidHideScrollBack()}
                                errorMessage="Required"
                                inverted
                            />
                        </Animatable.View>

                        <Button
                            loading={loading}
                            onPress={this.handleSubmit}
                            text="Register"
                            inverted
                            style={styles.button}
                            disabled={!this.isValid()}
                        />

                        <Text
                            style={styles.link}
                            onPress={() => this.props.navigation.navigate('LoginScreen', {transition: 'card'})}
                        >
                            or log in
                        </Text>
                        <View style={styles.termsOfWebView}>
                            <Text style={styles.termsText}>By signing up and using this service, you agree to Pinto’s <Text style={styles.webViewText}> Terms of Use</Text></Text>
                        </View>
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

export default enhance(CreateAccountScreen)
