import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactNative, {StatusBar, View, ScrollView, Text, Keyboard, UIManager, AsyncStorage} from 'react-native';
import {compose, withPropsOnChange} from 'recompose';
import {get as _get} from 'lodash';
import * as Animatable from 'react-native-animatable'

import * as inputValidators from '../../Lib/InputValidators';
import {keyboardDidShow, keyboardDidHide} from '../../Lib/ComponentEventHandlers';
import Button from '../../Components/Button';
import ValidatedTextInput from '../../Components/ValidatedTextInput';
import {Metrics, Images} from '../../Themes';
import styles from './styles';
import * as scale from '../../Utils/Scale';

// React Apollo
import {withAuth, withCreateAccount, withLogin} from '../../GraphQL/Account/decorators';
import withApollo from '../../Decorators/withApollo'
import gql from 'graphql-tag';
import {apolloClient} from "../../Lib/Apollo";

const QUERY_CHECK_CODE = gql`
  query prCodeCheck($code: String!) {
    prCodeCheck(code: $code)
  }
`;

class EnterCodeScreen extends Component {
    static propTypes = {
        createAccount: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            visibleHeight: Metrics.screenHeight,
            code: {value: null, valid: false, error: null},
            loading: false,
            error: null
        };

        this.isLoggingIn = false;
        this.scrollY = 0
    }

    async componentWillMount() {
        // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
        // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow.bind(this))
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide.bind(this))
        this.keyboardDidHideScrollBackListener = Keyboard.addListener(
            'keyboardDidHide',
            this.handleKeyboardDidHideScrollBack
        )
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.keyboardDidHideScrollBackListener.remove()
    }

    isValid() {
        return this.state.code.valid
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
        try {
            let code = this.state.code;
            this.setState({ loading: true });
            const response = await apolloClient.query({
                query: QUERY_CHECK_CODE,
                variables: { code: code.value },
                fetchPolicy: 'no-cache'
            });
            if (response.data.prCodeCheck) {
                code.valid = true;
                code.error = null;
                this.setState({ code, loading: false }, () => {
                    this.props.navigation.navigate('CreateAccountScreen', {transition: 'card'});
                });
            } else {
                let code = this.state.code;
                code.valid = false;
                code.error = 'This code does not match with server code';
                this.setState({ code, loading: false })
            }
        } catch (ex) {
            console.log(ex);
            code.valid = false;
        }
    };

    render() {
        const {visibleHeight, code, loading, error} = this.state;
        StatusBar.setBarStyle('light-content', true);
        return (
            <ScrollView
                style={styles.container}
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
                        <Animatable.View style={styles.lockImageWrapper}>
                            <Animatable.Image source={Images.lock} style={styles.lock} animation="fadeIn"/>
                        </Animatable.View>
                        <Animatable.Text style={styles.promptTitle} animation="fadeIn">
                            Enter Invite Code
                        </Animatable.Text>
                        <Animatable.Text style={styles.prompt} animation="fadeIn">
                            The Pinto Digitization App is Invite-only.
                        </Animatable.Text>
                    </View>

                    {error ? (
                        <View style={styles.errorRow}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <Text style={styles.inputTitle}>Invite Code</Text>
                    <ValidatedTextInput
                        placeholder="Invite Code"
                        name="Code"
                        returnKeyType="next"
                        index="code"
                        ref="code"
                        editable
                        required
                        value={code.value}
                        onChange={(value, event, valid) => {
                            this.setState({code: {...code, value, valid}})
                        }}
                        validationFn={inputValidators.requiredValidator}
                        onFocus={this.handleFocusChange}
                        onSubmitEditing={this.handleOnSubmitEditing.bind(null, 'email')}
                        errorMessage="Required"
                        inverted
                    />

                    <View style={styles.buttonWrapper}>
                        <Button
                            loading={loading}
                            onPress={this.handleSubmit}
                            text="Submit Code"
                            inverted
                            style={styles.button}
                            disabled={!this.isValid()}
                        />
                    </View>

                    <Text
                        style={styles.link}
                        onPress={() => this.props.navigation.navigate('LoginScreen', {transition: 'card'})}
                    >
                        or log in
                    </Text>
                    <Text style={[styles.inputQuestion, { marginTop: 29 * scale.heightRatio}]}>Don't have a code?</Text>
                    <Text
                        style={styles.requestLink}
                        onPress={() => this.props.navigation.navigate('RequestCodeScreen', {transition: 'card'})}
                    >
                        request code
                    </Text>
                </View>
            </ScrollView>
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

export default enhance(EnterCodeScreen);
