import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, Alert, ScrollView, TouchableOpacity, Image, StatusBar} from 'react-native';
import {compose, withPropsOnChange} from 'recompose';
import _, {get as _get} from 'lodash';
import * as Animatable from 'react-native-animatable';
import {connect} from 'react-redux';
import VersionNumber from 'react-native-version-number';

import withApollo from '../../Decorators/withApollo';
import toTitleCase from '../../Utils/toTitleCase';
import {Metrics, Colors, Images} from '../../Themes';
import ValidatedFormScreen from '../ValidatedFormScreen';
import { apolloClient } from '../../Lib/Apollo';
import withData from '../../Decorators/withData';
import SageActions from '../../Redux/SageRedux';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import RNPickerSelect from 'react-native-picker-select';

// React Apollo
import {withAuth, withLogout} from '../../GraphQL/Account/decorators';
import gql from 'graphql-tag';

import { CustomHeader } from '../../Components/CustomHeader';

import styles from './styles';
import * as scale from '../../Utils/Scale';
import Storage from '../../Utils/Storage'

const QUERY_PR_DATA = gql`
  query prData($updatedDate: String) {
    prData(updatedDate: $updatedDate)
  }
`;

class Index extends ValidatedFormScreen {
    static propTypes = {
        settingApplicationData: PropTypes.bool,
        resettingApplicationData: PropTypes.bool,
        logout: PropTypes.func.isRequired,
        tag: PropTypes.string,
        setTag: PropTypes.func.isRequired,
        setAutoQuickSync: PropTypes.func.isRequired,
        resetUserStats: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            displayName: props.user.displayName,
            email: props.user.email,
            visibleHeight: Metrics.screenHeight,
            loading: false,
            selectedIndex1: 0,
            selectedIndex2: 0,
            captureData: null,
            items: [],
            selectedStore: '',
            selectedStoreLabel: ''
        };

        this.scrollY = 0;
    }

    async componentDidMount({variables = {}} = {}) {
        const { prStores, auth } = this.props;
        const mode = _.get(auth, 'session.user.photoEntry.mode');
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
        if (mode === 'photographer') {
            this.setState({ selectedIndex1: 0 });
        } else {
            this.setState({ selectedIndex1: 1 });
        }
        this.setState({ loading: true });
        try {
            const response = await apolloClient.query({
                query: QUERY_PR_DATA,
                variables,
                fetchPolicy: 'network-only'
            });
            const { prData } = response.data;
            console.log('------------ prData ------------', prData);
            this.setState({ loading: false, captureData: prData && Object.values(prData.upc) });
            if (response.errors) throw response.errors
        } catch (ex) {
            console.log(ex);
            this.setState({ loading: false });
        }
    }

    selectStore = (value) => {
        this.setState({ selectedStore: value }, () => {
            this.setState({ selectedStoreLabel: this.state.items.filter(item => item.value === value)[0].texts });
        });
    };

    updateStore = async () => {
        // this.setState({ loading: true });
        await this.props.prUserUpdate({ store: this.state.selectedStore });
        await Storage.fetch();
        // this.setState({ loading: false });
    };

    handleIndexChange(type, index) {
        if (type === 1) {
            this.setState({ ...this.state, selectedIndex1: index }, () => {
                this.updateMode();
            });
        } else {
            this.setState({ ...this.state, selectedIndex2: index });
        }
    };

    componentWillReceiveProps(newProps) {
        const {user: oldUser} = this.props;
        const {user: newUser} = newProps;
        if (newUser) {
            if (oldUser.displayName !== newUser.displayName) {
                this.setState({displayName: newUser.displayName});
            }
            if (oldUser.email !== newUser.email) {
                this.setState({email: newUser.email});
            }
        }
    }

    updateMode = async () => {
        if (this.state.selectedIndex1 === 0) {
            this.props.prUserUpdate({ mode: 'photographer' });
        } else {
            this.props.prUserUpdate({ mode: 'runner' });
        }
    }

    handlePressLogout = async () => {
        this.setState({loading: true}, async () => {
            try {
                await this.props.logout();
                apolloClient.resetStore();
                // this.setState({ loading: false })
                this.props.handleReset(this.state);
                this.props.resetNavigation()
            } catch (e) {
                this.setState({loading: false});
                this.props.handleReset(this.state);
                this.props.resetNavigation()
            }
        })
    };

    handleLearnHowToUsePress = () => {
        this.props.navigation.navigate('OnboardingScreen', {fromAccount: true})
    };

    handleResetAllTheData = () => {
        const resetAllTheData = () => {
            this.props.data.removeAllData();
            this.props.resetUserStats()
        };

        Alert.alert(
            'Delete all data',
            'You are about to delete all the photos and statuses on this phone!\nDo not do this unless asked to!',
            [
                {text: 'Delete', onPress: resetAllTheData, style: 'destructive'},
                {
                    text: 'Cancel',
                    onPress: () => {
                        console.log('Cancel')
                    }
                }
            ]
        )
    };

    handleClose = () => this.props.navigation.goBack();

    handleSelectStore = () => this.props.navigation.navigate('StoreSelectorScreen', {transition: 'card'});

    handleSelectPartner = () => this.props.navigation.navigate('PartnerSelectorScreen', {transition: 'card'});

    handleProductChecklist = () => this.props.navigation.navigate('ChecklistScreen', {transition: 'card'});

    handleMessageScreen = () => this.props.navigation.navigate('MessagesScreen', {transition: 'card'});

    handleSyncScreen = () => this.props.navigation.navigate('ForceSyncScreen', {transition: 'card'});

    handleCaptureResultScreen = () => this.props.navigation.navigate('CaptureResultScreen', {transition: 'card'});

    render() {
        const {data, tag, setTag, autoQuickSync, setAutoQuickSync, auth, prStores, prUserUpdate} = this.props;
        const stores = _.get(prStores, 'result');
        const partner = _.get(auth, 'session.user.photoEntry.partner');
        const keyForCurrentStore = _.get(auth, 'session.user.photoEntry.store');
        const currentStore = stores !== undefined && Object.values(stores[partner]).filter(item => item.key === keyForCurrentStore);
        const { loading, captureData, selectedStore, selectedStoreLabel } = this.state;

        StatusBar.setBarStyle('dark-content', true);
        return (
            <Animatable.View style={styles.container}>
                <CustomHeader
                    onClose={this.handleClose}
                />
                <ScrollView
                    style={styles.innerContainer}
                    contentContainerStyle={{}}
                >
                    <Animatable.View style={styles.userInfo}>
                        <Text style={styles.userName}>Hi, {auth.session.user.displayName}</Text>
                        <Text style={styles.account}>Account</Text>
                    </Animatable.View>
                    <Animatable.View style={styles.modeSelect}>
                        <Animatable.Text style={styles.modeTitle}>{this.state.selectedIndex1 === 0 ? 'Photo' : 'Runner'} Mode</Animatable.Text>
                        <Animatable.Text style={styles.modeDescription}>{this.state.selectedIndex1 === 0 ? 'Capturing photos of products' : 'Checking and pulling products'}</Animatable.Text>
                        <Animatable.View style={styles.modeSelectTabContainer}>
                            <SegmentedControlTab
                                tabsContainerStyle={[styles.tabContainerStyle, { width: 228 * scale.widthRatio }]}
                                values={["PHOTO MODE", "RUNNER MODE"]}
                                selectedIndex={this.state.selectedIndex1}
                                onTabPress={(index) => this.handleIndexChange(1, index)}
                                activeTabStyle={styles.activeTabStyle}
                                tabStyle={styles.tabStyle}
                                activeTabTextStyle={styles.activeTabTextStyle}
                                tabTextStyle={styles.tabTextStyle}
                            />
                        </Animatable.View>
                    </Animatable.View>
                    <Animatable.View style={styles.storeSelect}>
                        <Animatable.Text style={styles.storeTitleText}>Store</Animatable.Text>
                        {
                            currentStore !== undefined && _.isArray(currentStore) &&
                            <RNPickerSelect
                                placeholder={{ label: 'Choose One' }}
                                placeholderTextColor={'#1f2952'}
                                items={this.state.items}
                                onValueChange={this.selectStore}
                                value={selectedStore}
                            >
                                <View style={styles.selectStorePart}>
                                    {
                                        !!selectedStore ?
                                            <Animatable.Text style={styles.upText}>{selectedStoreLabel && selectedStoreLabel.up}</Animatable.Text> :
                                            <Animatable.Text style={styles.storeDescriptionText}>
                                                {partner} - {currentStore[0].city} {currentStore[0].state}
                                            </Animatable.Text>
                                    }

                                    <TouchableOpacity onPress={this.handleSelectStore} style={styles.storeSelectMoveButton}>
                                        <Text style={styles.storeSelectMoveButtonText}>SELECT STORE</Text>
                                    </TouchableOpacity>
                                </View>
                            </RNPickerSelect>
                        }
                    </Animatable.View>
                    <Animatable.View style={styles.getUpgrade}>
                        <Animatable.View style={styles.upgradeTitle}>
                            <Animatable.Text style={styles.upgradeTitleText}>App Version</Animatable.Text>
                            <Animatable.Text style={styles.upgradeDescriptionText}>{`v${VersionNumber.appVersion} — Build ${VersionNumber.buildVersion}`}</Animatable.Text>
                        </Animatable.View>
                        {
                            this.state.selectedIndex1 !== 0 &&
                            <TouchableOpacity style={styles.upgradeMoveButton}>
                                <Animatable.Text style={styles.upgradeMoveButtonText}>GET UPGRADE</Animatable.Text>
                            </TouchableOpacity>
                        }
                    </Animatable.View>
                    <Animatable.View style={styles.productCaptureSelect}>
                        <Animatable.Text style={styles.productCaptureSelectTitle}>Product Capture Priority</Animatable.Text>
                        <Animatable.Text style={styles.productCaptureSelectDescription}>
                            {this.state.selectedIndex2 === 0 && 'Capturing products that must be done in this store'}
                            {this.state.selectedIndex2 === 1 && 'Capturing high-priority products that are likely in this store'}
                            {this.state.selectedIndex2 === 2 && 'Capturing any possible product that needs capture'}
                        </Animatable.Text>
                        <Animatable.View style={styles.productCaptureSelectTabContainer}>
                            <SegmentedControlTab
                                tabsContainerStyle={[styles.tabContainerStyle, { width: 342 * scale.widthRatio }]}
                                values={["STORE LIST", "HIGH PRIORITY", "ALL PRODUCTS"]}
                                selectedIndex={this.state.selectedIndex2}
                                onTabPress={(index) => this.handleIndexChange(2, index)}
                                activeTabStyle={styles.activeTabStyle}
                                tabStyle={styles.tabStyle}
                                activeTabTextStyle={styles.activeTabTextStyle}
                                tabTextStyle={styles.tabTextStyle}
                            />
                        </Animatable.View>
                    </Animatable.View>
                    <Animatable.View style={styles.sessionCaptureStatus}>
                        <TouchableOpacity style={styles.sessionCaptureMoveDetailButton} onPress={this.handleCaptureResultScreen}>
                            <Animatable.View style={styles.sessionCaptureMoveDetailButtonTextContainer}>
                                <Animatable.Text style={styles.sessionCaptureMoveDetailButtonText}>Session Capture Status</Animatable.Text>
                            </Animatable.View>
                            <Image source={Images.arrowRight} style={styles.arrowIcon}/>
                        </TouchableOpacity>
                        <Animatable.Text style={styles.sessionCaptureDetail}>
                            {captureData !== null && captureData.length} Captured;
                            {captureData !== null && captureData.filter(upc => upc.storeStatus === 'done').length} Synced;
                            {captureData !== null && captureData.filter(upc => upc.storeStatus === 'pending').length} Pending Sync
                        </Animatable.Text>
                        <Animatable.View style={styles.barStyle}>
                            <Animatable.View
                                style={
                                    [styles.activeBarStyle,
                                        { width: `${captureData !== null && captureData.length > 0 ? captureData.filter(upc => upc.storeStatus === 'pending').length / captureData.length * 100 : 100}%`
                                        }
                                    ]
                                }
                            />
                        </Animatable.View>
                        <Animatable.Text style={styles.statusDetail}>
                            Sync Status: { captureData !== null && captureData.length > 0 ? captureData.filter(upc => upc.storeStatus === 'pending').length / captureData.length * 100 : 100 }% synced to server
                        </Animatable.Text>
                        <TouchableOpacity style={styles.manualSyncButton} onPress={this.handleSyncScreen}>
                            <Animatable.Text style={styles.manualSyncButtonText}>FORCE MANUAL SYNC</Animatable.Text>
                        </TouchableOpacity>
                    </Animatable.View>
                    <Animatable.View style={styles.messageSection}>
                        <Animatable.View style={styles.messageStatus}>
                            <TouchableOpacity style={styles.messageStatusText} onPress={this.handleMessageScreen}>
                                <Animatable.View style={styles.messageStatusTitleTextContainer}>
                                    <Animatable.Text style={styles.messageStatusTitleText}>Your Messages</Animatable.Text>
                                </Animatable.View>
                                <Image source={Images.arrowRight} style={styles.arrowIcon}/>
                            </TouchableOpacity>
                            <Text style={styles.messageStatusDetail}>0 messages</Text>
                        </Animatable.View>
                    </Animatable.View>
                    <TouchableOpacity onPress={this.handleProductChecklist} style={styles.buttonContainer}>
                        <Animatable.Image source={Images.diary} style={[styles.leftIcon, { width: 20 * scale.widthRatio, height: 20 * scale.widthRatio }]} />
                        <Animatable.Text style={[styles.rightText, { color: '#4a7ffb' }]}>View Product Checklist</Animatable.Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Animatable.Image source={Images.sms} style={[styles.leftIcon, { width: 20 * scale.widthRatio, height: 13 * scale.widthRatio }]} />
                        <Animatable.Text style={[styles.rightText, { color: '#4a7ffb' }]}>Message Support</Animatable.Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handleResetAllTheData} style={styles.buttonContainer}>
                        <Animatable.Image source={Images.delete} style={[styles.leftIcon, { width: 17 * scale.widthRatio, height: 20 * scale.widthRatio }]} />
                        <Animatable.Text style={[styles.rightText, { color: '#f54370' }]}>Reset All Data & Restart Session</Animatable.Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handlePressLogout} style={styles.buttonContainer}>
                        <Animatable.Image source={Images.logout} style={[styles.leftIcon, { width: 18 * scale.widthRatio, height: 18 * scale.widthRatio }]} />
                        <Animatable.Text style={[styles.rightText, { color: '#f54370' }]}>Log Out</Animatable.Text>
                    </TouchableOpacity>
                </ScrollView>
            </Animatable.View>
        )
    }
}

const enhance = compose(
    withAuth,
    withData,
    withPropsOnChange(
        (props, nextProps) =>
            _get(props, 'auth.session.isAuthenticated', false) !== _get(nextProps, 'auth.session.isAuthenticated', false),
        ({auth}) => ({
            isAuthenticated: _get(auth, 'session.isAuthenticated', false),
            user: _get(auth, 'session.user', {
                displayName: '',
                email: ''
            })
        })
    ),
    connect(
        ({sage: {tag, autoQuickSync, userStats}}) => ({tag, autoQuickSync, userStats}),
        {
            setTag: SageActions.setTag,
            setAutoQuickSync: SageActions.setAutoQuickSync,
            resetUserStats: SageActions.resetUserStats
        }
    ),
    withApollo(
        'mutation prUserUpdate',
        {store: 'String', priority: 'String', mode: 'String'},
        '... Session',
        require('../../GraphQL/Account/fragments/session').default
    ),
    withLogout,
    withAuth,
    withApollo('query prStores')
);

export default enhance(Index)
