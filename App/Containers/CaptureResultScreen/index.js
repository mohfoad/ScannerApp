import React, {Component} from 'react';
import {TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import _, {get as _get} from 'lodash';
import * as Animatable from 'react-native-animatable';
import InfiniteScroll from 'react-native-infinite-scroll';
import {compose, withPropsOnChange} from 'recompose';
import gql from 'graphql-tag';
import {withAuth, withCreateAccount, withLogin} from '../../GraphQL/Account/decorators';
import {apolloClient} from '../../Lib/Apollo';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {CustomHeader} from '../../Components/CustomHeader';
import {Images} from '../../Themes';
import * as scale from '../../Utils/Scale';
import styles from './styles';
import withApollo from '../../Decorators/withApollo';

const BASE_DATA_PREFIX = '@pinto:prData'; // do not edit this, it will make all phones lose all progress

const QUERY_PR_DATA = gql`
  query prData($updatedDate: String) {
    prData(updatedDate: $updatedDate)
  }
`;

class CaptureResultScreen extends Component {
    constructor() {
        super();

        this.state = {
            index: 0,
            routes: [
                {key: 'errors', title: 'errors'},
                {key: 'captured', title: 'captured'},
                {key: 'synched', title: 'synched'},
                {key: 'pending', title: 'pending'}
            ],
            loading: false,
            captureData: null,
            loadNum: 10
        };
    }

    async componentDidMount({variables = {}} = {}) {
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

    componentWillUnmount() {
        this.setState({ loading: false });
    }

    renderTitle = (tab) => {
        const { captureData } = this.state;
        switch (tab) {
            case 'errors':
                const errorNum = captureData !== null && captureData.filter(captureRow => captureRow.storeStatus === 'synch failed').length;
                return `ERRORS (${errorNum})`;
            case 'captured':
                return `CAPTURED (${captureData !== null && captureData.length})`;
            case 'synched':
                const syncedNum = captureData !== null && captureData.filter(captureRow => captureRow.storeStatus === 'done').length;
                return `SYNCHED (${syncedNum})`;
            case 'pending':
                const pendingNum = captureData !== null && captureData.filter(captureRow => captureRow.storeStatus === 'pending').length;
                return `PENDING (${pendingNum})`;
            default:
                return `CAPTURED (${captureData !== null && captureData.length})`;
        }
    };

    renderSyncStatus = (syncRow, i) => {
        return (
            <Animatable.View style={styles.syncRowContainer} key={i}>
                <Animatable.View style={styles.syncRowUp}>
                    <Animatable.View style={styles.syncDetail}>
                        <Animatable.Text style={styles.syncId}>{syncRow.upc}</Animatable.Text>
                        <Animatable.Text style={styles.syncName}>
                            { syncRow.labelName }
                        </Animatable.Text>
                    </Animatable.View>
                    <Animatable.View style={[styles.syncStatus, { backgroundColor: this.getBackground(syncRow.storeStatus) }]}>
                        <Animatable.Text style={styles.syncStatusText}>{syncRow.storeStatus}</Animatable.Text>
                    </Animatable.View>
                </Animatable.View>
                {
                    syncRow.storeStatus === 'synch failed' &&
                    <Animatable.Text style={styles.errorText}>
                        Some status message that we can give the user.
                    </Animatable.Text>
                }
                <Animatable.View style={styles.syncRowDown}>
                    {
                        syncRow.images && syncRow.images.map((image, index) => {
                            return <Animatable.Image source={image} key={index} style={styles.syncFailedImage} />
                        })
                    }
                </Animatable.View>
            </Animatable.View>
        )
    };

    getBackground = (status) => {
        if (status === 'pending') {
            return '#c7c9d4';
        } else if (status === 'synching') {
            return '#a65dfb';
        } else if (status === 'synch failed') {
            return '#f54370';
        } else if (status === 'synched') {
            return '#00dc92';
        }
    };

    _renderScene = ({route}) => {
        const {index, captureData } = this.state;
        switch (route.key) {
            case 'errors':
                return index === 0 && this._renderTabComponent('synch failed');
            case 'captured':
                return index === 1 &&
                    <InfiniteScroll
                        horizontal={false}  //true - if you want in horizontal
                        onLoadMoreAsync={this.loadMorePage}
                        distanceFromEnd={10} // distance in density-independent pixels from the right end
                        style={styles.scrollView}>
                        <ScrollView>
                            {
                                captureData.slice(0, this.state.loadNum).map((row, i) => {
                                    return this.renderSyncStatus(row, i);
                                })
                            }
                        </ScrollView>
                    </InfiniteScroll>;
            case 'synched':
                return index === 2 && this._renderTabComponent('done');
            case 'pending':
                return index === 3 && this._renderTabComponent('pending');
            default:
                return index === 0 &&
                    <InfiniteScroll
                        horizontal={false}  //true - if you want in horizontal
                        onLoadMoreAsync={this.loadMorePage}
                        distanceFromEnd={10} // distance in density-independent pixels from the right end
                        style={styles.scrollView}>
                        <ScrollView>
                            {
                                captureData.slice(0, this.state.loadNum).map((row, i) => {
                                    return this.renderSyncStatus(row, i);
                                })
                            }
                        </ScrollView>
                    </InfiniteScroll>;
        }
    };

    _renderTabBar = (props) => {
        return (
            <Animatable.View style={styles.tabBar}>
                {
                    props.navigationState.routes.map((route, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.tabItem}
                                onPress={() => this.setState({index: index})}
                            >
                                <Animatable.Text
                                    style={[styles.tabTitle, {color: this.state.index === index ? '#1f2952' : '#232f5b'}]}>{this.renderTitle(route.title)}</Animatable.Text>
                                <Animatable.View
                                    style={[styles.tabIndicator, {backgroundColor: this.state.index === index ? '#233162' : 'white'}]}/>
                            </TouchableOpacity>
                        )
                    })
                }
            </Animatable.View>
        )
    };

    _renderTabComponent = (type) => {
        const { captureData } = this.state;
        return(
            <InfiniteScroll
                horizontal={false}  //true - if you want in horizontal
                onLoadMoreAsync={this.loadMorePage}
                distanceFromEnd={10} // distance in density-independent pixels from the right end
                style={styles.scrollView}>
                <ScrollView style={styles.tabView}>
                    {
                        captureData.filter(captureRow => captureRow.storeStatus === type).slice(0, this.state.loadNum).map((row, i) => {
                            return this.renderSyncStatus(row, i);
                        })
                    }
                </ScrollView>
            </InfiniteScroll>
        )
    };

    loadMorePage = () => {
        this.setState({ loadNum: this.state.loadNum + 10 });
    };

    render() {
        const { loading, captureData } = this.state;
        const { navigation } = this.props;

        return (
            <Animatable.View style={loading ? styles.loadingContainer : styles.container}>
                {
                    loading ?
                        <ActivityIndicator size="large" color="#0000ff" /> :
                        captureData !== null &&
                        <React.Fragment>
                            <CustomHeader
                                title={'Capture Status'}
                                onClose={() => navigation.goBack()}
                            />
                            <TouchableOpacity style={styles.manualRefresh}>
                                <Animatable.Text style={styles.refreshText}>FORCE MANUAL RESYNCH</Animatable.Text>
                            </TouchableOpacity>
                            <Animatable.View style={styles.captureStatus}>
                                <Animatable.View style={styles.warning}>
                                    <Animatable.Image source={Images.warning} style={styles.warningImage}/>
                                    <Animatable.Text style={styles.warningResult}>
                                        { captureData.filter(upc => upc.storeStatus === 'error').length } Errors
                                    </Animatable.Text>
                                </Animatable.View>
                                <Animatable.View style={styles.pending}>
                                    <Animatable.Image source={Images.pending} style={styles.pendingImage}/>
                                    <Animatable.Text style={styles.pendingResult}>
                                        { captureData.filter(upc => upc.storeStatus === 'pending').length } Pending Sync
                                    </Animatable.Text>
                                </Animatable.View>
                            </Animatable.View>
                            <Animatable.View style={styles.tabContainer}>
                                <TabView
                                    navigationState={this.state}
                                    renderScene={this._renderScene}
                                    renderTabBar={this._renderTabBar}
                                    onIndexChange={index => this.setState({index})}
                                    initialLayout={{width: 1 * scale.deviceWidth, height: 0}}
                                />
                            </Animatable.View>
                        </React.Fragment>
                }
            </Animatable.View>
        )
    }
}

export default compose(
    withAuth,
    withPropsOnChange(
        (props, nextProps) =>
            _get(props, 'auth.session.isAuthenticated', false) !== _get(nextProps, 'auth.session.isAuthenticated', false),
        ({ auth }) => ({ isAuthenticated: _get(auth, 'session.isAuthenticated', false) })
    ),
    withLogin,
    withCreateAccount,
    withApollo('query prData', null, null, null, { renderLoading: 'default', fetchPolicy: 'network-only' })
)(CaptureResultScreen);
