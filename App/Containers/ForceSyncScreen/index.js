import React, {Component} from 'react';
import { TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {compose, withPropsOnChange} from 'recompose';
import _, {get as _get} from 'lodash';
import {Metrics, Images, Colors, Fonts, ApplicationStyles} from '../../Themes';
import { CustomHeader } from '../../Components/CustomHeader';
import {notifyAndLogError} from '../../Lib/bugsnag';
import withData from '../../Decorators/withData';
import styles from './styles';

// React Apollo
import {withAuth, withCreateAccount, withLogin} from '../../GraphQL/Account/decorators';
import PromiseUtil from "../../Utils/PromiseUtil";

class ForceSyncScreen extends Component {
    constructor() {
        super();

        this.countUpFn = null;
        this.state = {
            fill: 0,
            loading: false,
            progressTotal: 0,
            error: null
        };
    }

    startLoading = () => {
        if (this.state.fill === 100) {
            clearTimeout(this.countUpFn);
            return;
        }
        this.setState({ fill: this.state.fill + 1 });
        this.countUpFn = setTimeout(this.startLoading, 100);
    };

    queuePeriodicUpdate = () => {
        const PERIODIC_UPDATE_INTERVAL = 3 * 60 * 1000;
        clearTimeout(this._periodicUpdateTimer);

        this._periodicUpdateTimer = setTimeout(async () => {
            if (this.state.loading) return this.queuePeriodicUpdate();

            if (this.isUnmounted) return;

            await this.props.data.fetch();

            if (this.isUnmounted) return;

            this.queuePeriodicUpdate()
        }, PERIODIC_UPDATE_INTERVAL)
    };

    async componentDidMount(): void {
        const {data} = this.props;
        const touchedItems = _.map(_.get(data, 'diff.upc'));
        const [outOfStockRemain, productsRemain] = _.partition(
            touchedItems,
            (x) => !['cart', 'done'].includes(x.storeStatus) && x.outOfStock
        ).map((x) => x.length);
        const photosRemain = _.filter(_.flatMap(touchedItems, 'photos')).length;
        await this.startSync({quickSync: true, productsRemain, photosRemain, outOfStockRemain});
    }

    startSync = async ({quickSync = false, productsRemain, photosRemain, outOfStockRemain}) => {
        !quickSync && this.startLoading();
        !quickSync && this.setState({
            loading: true,
            progressTotal: (quickSync ? 0 : photosRemain) + productsRemain + outOfStockRemain,
            error: null
        });

        let failCounter = 0;
        const maxFails = 5;
        let error;

        while (true) {
            try {
                const allPassed = await this.props.data[quickSync ? 'quickSync' : 'sync']();

                if (this.isUnmounted) return;

                if (allPassed) break;

                if (++failCounter > maxFails) {
                    error = 'Failed too hard, too much, too often.\nTry again?';
                    break
                }
                // wait a little after a massive failure
                await PromiseUtil.sleep(failCounter * 5000);
                continue
            } catch (ex) {
                error = ex;
                break
            }
        }

        if (error) {
            notifyAndLogError(error);
            !quickSync && this.setState({
                loading: false,
                error: error ? error.stack || error.toString() : null,
                fill: 100
            });
            !quickSync && clearTimeout(this.countUpFn);
        } else {
            try {
                await this.props.data.fetch();
                !quickSync && this.setState({
                    loading: false,
                    error: null,
                    fill: 100
                });
                !quickSync && clearTimeout(this.countUpFn);
            } catch (ex1) {
                !quickSync && this.setState({
                    loading: false,
                    error: ex1 ? ex1.stack || ex1.toString() : null,
                    fill: 100
                });
                !quickSync && clearTimeout(this.countUpFn);
            }
            if (!quickSync) this.queuePeriodicUpdate()
        }
    };

    render() {
        const {data, navigation} = this.props;
        const {loading, error, progressTotal} = this.state;

        const touchedItems = _.map(_.get(data, 'diff.upc'));
        const [outOfStockRemain, productsRemain] = _.partition(
            touchedItems,
            (x) => !['cart', 'done'].includes(x.storeStatus) && x.outOfStock
        ).map((x) => x.length);
        const photosRemain = _.filter(_.flatMap(touchedItems, 'photos')).length;
        let progress = (progressTotal - photosRemain - productsRemain) / progressTotal;
        progress = !isFinite(progress) || isNaN(progress) ? 0 : progress;
        console.log('sync progress @DMITRI', progress);

        return (
            <Animatable.View style={styles.container}>
                <CustomHeader title={'Manual Sync'} onClose={() => navigation.goBack()} />
                <Animatable.View style={styles.progressCircle}>
                    <AnimatedCircularProgress
                        size={240}
                        width={8}
                        fill={this.state.fill}
                        tintColor="#00dc92"
                        backgroundColor="rgba(31, 41, 82, 0.08)"
                    >
                        {
                            (fill) => {
                                return (
                                    <Animatable.View style={styles.points}>
                                        <Animatable.Text style={styles.progressNum}>
                                            {
                                                this.state.loading? Math.round(fill) :
                                                    this.state.fill === 0 ? '' : '🎉'
                                            }
                                        </Animatable.Text>
                                        <Animatable.Text style={styles.description}>
                                            {
                                                this.state.loading ?
                                                    'Products Syncing…' :
                                                    this.state.fill === 0 ? 'Products to Sync' :
                                                        this.state.error ? 'Sync complete with issues' :
                                                            'Sync complete'
                                            }
                                        </Animatable.Text>
                                    </Animatable.View>
                                )
                            }
                        }
                    </AnimatedCircularProgress>
                </Animatable.View>
                <TouchableOpacity
                    style={[styles.progressButton, { backgroundColor: this.state.loading ? 'rgba(31, 41, 82, 0.25)' : '#4a7ffb' }]}
                    onPress={loading ? () => {} : () => this.startSync({productsRemain, photosRemain, outOfStockRemain})}
                >
                    <Animatable.Text style={styles.buttonText}>
                        {
                            this.state.loading ? 'Sync in Progress...' : 'Start Sync'
                        }
                    </Animatable.Text>
                </TouchableOpacity>
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
    withData
);

export default enhance(ForceSyncScreen);
