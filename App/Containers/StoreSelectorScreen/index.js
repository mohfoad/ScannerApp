import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import { compose, withPropsOnChange } from 'recompose';
import { get as _get } from 'lodash';
import RNPickerSelect from 'react-native-picker-select';

// React Apollo
import { withAuth, withCreateAccount, withLogin } from '../../GraphQL/Account/decorators';
import withApollo from '../../Decorators/withApollo';
import Storage from '../../Utils/Storage';
import * as scale from '../../Utils/Scale';
import {Metrics, Images} from '../../Themes';
import styles from './styles';

class StoreSelectorScreen extends Component {
    static propTypes = {
        prStores: PropTypes.object.isRequired,
        prUserUpdate: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            visibleHeight: Metrics.screenHeight,
            selectedStore: '',
            selectedStoreLabel: '',
            loading: false,
            items: []
        };
    }

    componentDidMount() {
        const { prStores, auth } = this.props;
        const stores = _.get(prStores, 'result');
        const partner = _.get(auth, 'session.user.photoEntry.partner');
        const storesArr =  Object.values(stores[partner]).map(store => {
            return {
                value: store.key,
                label: `${store.name} - ${store.city} ${store.state}`,
                texts: {
                    up: `${store.city} ${store.state}`,
                    bottom: store.name
                }
            }
        });
        this.setState({ items: storesArr })
    }

    handleEnterPhotoMode = () => {
        this.props.navigation.navigate('PartnerSelectorScreen', { transition: 'card' })
    };

    handleEnterRunnerMode = () => {
        this.props.navigation.navigate('PartnerSelectorScreen', { transition: 'card' })
    };

    selectStore = (value) => {
        this.setState({ selectedStore: value }, () => {
            this.setState({ selectedStoreLabel: this.state.items.filter(item => item.value === value)[0].texts });
        });
    };

    updateStore = async () => {
        this.setState({ loading: true });
        await this.props.prUserUpdate({ store: this.state.selectedStore });
        await Storage.fetch();
        this.setState({ loading: false });
        this.props.navigation.navigate('ScannerScreen');
    };

    render() {
        const { selectedStore, selectedStoreLabel, loading } = this.state;

        return (
            <Animatable.View style={styles.container}>
                <Animatable.View style={styles.imageWrapper}>
                    <Animatable.Image source={Images.store} style={styles.store} animation="fadeIn" />
                </Animatable.View>
                <Animatable.View style={styles.welcomeTextWrapper}>
                    <Animatable.Text style={styles.welcomeText}>Select a Store</Animatable.Text>
                </Animatable.View>
                <Animatable.Text style={styles.selectText}>Are you taking photos in a physical store?</Animatable.Text>
                <TouchableOpacity style={styles.selectOption}>
                    <Animatable.View style={[{width: 30 * scale.widthRatio, height: 28 * scale.heightRatio}]}>
                        <Animatable.Image source={Images.store} style={styles.option} animation="fadeIn" />
                    </Animatable.View>
                    <Animatable.View style={styles.text}>
                        <RNPickerSelect
                            placeholder={{ label: 'Choose One' }}
                            placeholderTextColor={'#1f2952'}
                            items={this.state.items}
                            onValueChange={this.selectStore}
                            value={selectedStore}
                        >
                            {
                                !!selectedStore ?
                                    <React.Fragment>
                                        <Animatable.Text style={styles.upText}>{selectedStoreLabel && selectedStoreLabel.up}</Animatable.Text>
                                        <Animatable.Text style={styles.bottomText}>{selectedStoreLabel && selectedStoreLabel.bottom}</Animatable.Text>
                                    </React.Fragment>  :
                                    <Animatable.Text style={styles.placeholderText}>
                                        Select Store
                                    </Animatable.Text>
                            }
                        </RNPickerSelect>
                    </Animatable.View>
                </TouchableOpacity>
                {
                    !!selectedStore &&
                    <TouchableOpacity style={styles.finishButton} onPress={this.updateStore}>
                        {
                            loading ?
                                <ActivityIndicator size={'small'} color={'#ffffff'} /> :
                                <Animatable.Text style={styles.finishText}>Finish</Animatable.Text>
                        }
                    </TouchableOpacity>
                }
                <Animatable.View style={styles.textGroup}>
                    <Animatable.Text style={styles.text1}>I’m not in a store</Animatable.Text>
                    <Animatable.Text style={styles.text2} onPress={() => this.props.navigation.navigate('CreateAccountScreen')}>Skip store selection</Animatable.Text>
                    <Animatable.View style={styles.underLine} />
                </Animatable.View>
            </Animatable.View>
        )
    }
}

const enhance = compose(
    withAuth,
    withPropsOnChange(
        (props, nextProps) =>
            _get(props, 'auth.session.isAuthenticated', false) !== _get(nextProps, 'auth.session.isAuthenticated', false),
        ({ auth }) => ({ isAuthenticated: _get(auth, 'session.isAuthenticated', false) })
    ),
    withLogin,
    withCreateAccount,
    withApollo('query prStores', null, null, null, { renderLoading: 'default', fetchPolicy: 'network-only' }),
    withApollo(
        'mutation prUserUpdate',
        { store: 'String!' },
        '... Session',
        require('../../GraphQL/Account/fragments/session').default
    )
);

export default enhance(StoreSelectorScreen);
