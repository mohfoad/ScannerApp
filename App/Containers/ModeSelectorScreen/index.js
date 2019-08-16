import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import {compose, withPropsOnChange} from 'recompose';
import {get as _get} from 'lodash';
import {Metrics, Images, Colors, Fonts, ApplicationStyles} from '../../Themes';
import styles from './styles';
import * as scale from '../../Utils/Scale';

// React Apollo
import {withAuth, withCreateAccount, withLogin} from '../../GraphQL/Account/decorators'
import withApollo from '../../Decorators/withApollo';

class ModeSelectorScreen extends Component {
    static propTypes = {
        prUserUpdate: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            mode: '',
            loading: false
        }
    }

    handleEnterPhotoMode = async () => {
        this.setState({ loading: true });
        await this.props.prUserUpdate({ mode: 'photographer'} );
        this.setState({ loading: false });
        this.props.navigation.navigate('StoreSelectorScreen', {transition: 'card'})
    };

    handleEnterRunnerMode = async () => {
        this.setState({ loading: true });
        await this.props.prUserUpdate({ mode: 'runner' });
        this.setState({ loading: false });
        this.props.navigation.navigate('StoreSelectorScreen', {transition: 'card'})
    };

    render() {

        StatusBar.setBarStyle('dark-content', true);
        return (
            <Animatable.View style={styles.container}>
                <Animatable.View style={styles.imageWrapper}>
                    <Animatable.Image source={Images.barcodeBlack} style={styles.barCode} animation="fadeIn" />
                </Animatable.View>
                <Animatable.View style={styles.welcomeTextWrapper}>
                    <Animatable.Text style={styles.welcomeText}>Welcome to the Digitization App</Animatable.Text>
                </Animatable.View>
                <Animatable.Text style={styles.selectText}>Which best describes you?</Animatable.Text>
                <TouchableOpacity style={styles.selectOption} onPress={this.handleEnterPhotoMode}>
                    {
                        this.state.loading ?
                            <ActivityIndicator size={'small'} color={'#000000'} /> :
                            <React.Fragment>
                                <Animatable.View style={[{width: 39 * scale.widthRatio, height: 32 * scale.heightRatio}]}>
                                    <Animatable.Image source={Images.camera} style={styles.option} animation="fadeIn" />
                                </Animatable.View>
                                <Animatable.View>
                                    <Animatable.Text style={styles.upText}>I’m Taking Photos</Animatable.Text>
                                    <Animatable.Text style={styles.bottomText}>Enter Photo Mode</Animatable.Text>
                                </Animatable.View>
                                <Animatable.View style={styles.arrowImageWrapper}>
                                    <Animatable.Image source={Images.arrowRight} style={styles.arrow} animation="fadeIn" />
                                </Animatable.View>
                            </React.Fragment>
                    }
                </TouchableOpacity>
                <TouchableOpacity style={styles.selectOption} onPress={this.handleEnterRunnerMode}>
                    {
                        this.state.loading ?
                            <ActivityIndicator size={'small'} color={'#000000'} /> :
                            <React.Fragment>
                                <Animatable.View style={[{width: 35 * scale.widthRatio, height: 48 * scale.heightRatio}]}>
                                    <Animatable.Image source={Images.checkProduct} style={styles.option} animation="fadeIn" />
                                </Animatable.View>
                                <Animatable.View>
                                    <Animatable.Text style={styles.upText}>I’m Pulling Products from Shelves</Animatable.Text>
                                    <Animatable.Text style={styles.bottomText}>Enter Runner Mode</Animatable.Text>
                                </Animatable.View>
                                <Animatable.View style={styles.arrowImageWrapper}>
                                    <Animatable.Image source={Images.arrowRight} style={styles.arrow} animation="fadeIn" />
                                </Animatable.View>
                            </React.Fragment>
                    }
                </TouchableOpacity>
                <Animatable.Text style={styles.explanationText}>You’ll be able to change this later</Animatable.Text>
            </Animatable.View>
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
    withCreateAccount,
    withApollo(
        'mutation prUserUpdate',
        { mode: 'String' },
        '... Session',
        require('../../GraphQL/Account/fragments/session').default
    )
);

export default enhance(ModeSelectorScreen)
