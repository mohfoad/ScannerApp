import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import {View, Text, TouchableOpacity, ScrollView, ActivityIndicator, ProgressViewIOS} from 'react-native'
import _ from 'lodash'
import {connect} from 'react-redux'
import SageActions from '../../Redux/SageRedux'
import {compose} from 'recompose'
import KeepAwake from 'react-native-keep-awake'

import withData from '../../Decorators/withData'
import BackAndHelpNavigationBar from '../../Components/BackAndHelpNavigationBar'
import Button from '../../Components/Button'
import PromiseUtil from '../../Utils/PromiseUtil'
import {notifyAndLogError} from '../../Lib/bugsnag'
import {Metrics} from '../../Themes';

import Styles from './styles';

class SyncScreen extends PureComponent {
    static propTypes = {
        data: PropTypes.shape({
            diff: PropTypes.shape({
                upc: PropTypes.object.isRequired
            }),
            loading: PropTypes.bool
        }).isRequired
    };

    state = {
        loading: false,
        progressTotal: 0,
        error: null
    };

    queuePeriodicUpdate() {
        const PERIODIC_UPDATE_INTERVAL = 3 * 60 * 1000;
        clearTimeout(this._periodicUpdateTimer);

        this._periodicUpdateTimer = setTimeout(async () => {
            if (this.state.loading) return this.queuePeriodicUpdate();

            if (this.isUnmounted) return;

            await this.props.data.fetch();

            if (this.isUnmounted) return;

            this.queuePeriodicUpdate()
        }, PERIODIC_UPDATE_INTERVAL)
    }

    componentWillUnmount() {
        this.isUnmounted = true;
        clearTimeout(this._periodicUpdateTimer)
    }

    async sync({quickSync = false, photosRemain, productsRemain, outOfStockRemain}) {
        this.setState({
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
                    error = 'Failed too hard, too much, too often.\nTry again?'
                    break
                }
                // wait a little after a massive failure
                await PromiseUtil.sleep(failCounter * 5000)
                continue
            } catch (ex) {
                error = ex;
                break
            }
        }

        if (error) notifyAndLogError(error);
        else {
            await this.props.data.fetch();
            if (!quickSync) this.queuePeriodicUpdate()
        }

        this.setState({
            loading: false,
            error: error ? error.stack || error.toString() : null
        })
    }

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
            <BackAndHelpNavigationBar
                navigation={this.props.navigation}
                style={Styles.root}
                title='Sync Data'
                hideBack={data.loading || loading}
            >
                <KeepAwake/>

                <View style={Styles.content}>
                    <Text style={Styles.title}>{productsRemain} products to upload</Text>
                    <Text style={Styles.title}>{photosRemain} photos to upload</Text>
                    <Text style={Styles.title}>{outOfStockRemain} out of stocks to upload</Text>
                    {!touchedItems.length && !loading ? (
                        <View style={Styles.done}>
                            <Text style={Styles.doneText}>All Done 🎉</Text>
                        </View>
                    ) : error ? (
                        <View style={Styles.error}>
                            <Text style={Styles.errorText}>{error}</Text>
                        </View>
                    ) : (
                        <ProgressViewIOS progress={progress} style={{margin: Metrics.doubleBaseMargin}}/>
                    )}
                </View>

                <Button
                    inverted
                    center
                    text='Quick Sync'
                    loading={loading}
                    onPress={
                        loading ? () => {
                        } : () => this.sync({quickSync: true, productsRemain, photosRemain, outOfStockRemain})
                    }
                    style={Styles.syncButton}
                />

                <Button
                    dark
                    center
                    text='Start Sync'
                    loading={loading}
                    onPress={loading ? () => {
                    } : () => this.sync({productsRemain, photosRemain, outOfStockRemain})}
                    style={Styles.syncButton}
                />
            </BackAndHelpNavigationBar>
        )
    }
}

export default compose(withData)(SyncScreen)
