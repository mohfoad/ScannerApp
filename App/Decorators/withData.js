import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import _ from 'lodash'
import Storage from '../Utils/Storage'
import {connect} from 'react-redux'
import RNFS from 'react-native-fs'
import Secrets from 'react-native-config'

import {withAuth} from '../GraphQL/Account/decorators'
import SageActions from '../Redux/SageRedux'
import {notifyAndLogError} from '../Lib/bugsnag'
import getEmptyUpcData from '../Utils/getEmptyUpcData'

const DEFAULT_DATA_RESULT = {doneUPCs: [], upc: {}, date: new Date().toISOString()};
const APP_DIR = RNFS.DocumentDirectoryPath.split('/')
    .slice(0, -1)
    .join('/');
const CAMERA_DIR = APP_DIR + '/Library/Caches/Camera/';

class _WithDataDecorator extends PureComponent {
    static propTypes = {
        Klass: PropTypes.func.isRequired,
        props: PropTypes.object.isRequired,
        auth: PropTypes.shape({
            session: PropTypes.shape({
                user: PropTypes.shape({
                    displayName: PropTypes.string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired,
        incrementUserStat: PropTypes.func.isRequired
    };

    state = {
        result: Storage.payload.data,
        diff: Storage.payload.diff,
        loading: !!Storage.payload.loading,
        // refresh: this.refresh.bind(this),
        sync: (...args) => this.sync(...args),
        syncOne: (...args) => this.syncOne(...args),
        quickSync: (...args) => this.quickSync(...args),
        removeAllData: (...args) => this.removeAllData(...args),
        updateUpc: (...args) => this.updateUpc(...args),
        fetch: (...args) => Storage.fetch(...args),
        getUPC: (upc) => _.get(this.state.result, ['upc', upc])
    };

    componentWillMount() {
        this._unbind = Storage.listen(({data, diff, loading}) => this.setState({result: data, diff, loading}))
    }

    componentWillUnmount() {
        _.invoke(this, '_unbind')
    }

    _getToUpdate = () => {
        return _.map(
            _.filter(
                _.get(this.state.diff, 'upc'),
                (x) => ['cart', 'done'].includes(x.storeStatus)
            ),
            (item) =>
                _.pick(item, ['upc', 'storeStatus', 'payload', 'photos', 'outOfStock'])
        )
    };

    removeAllPhotos = async () => {
        let list = await RNFS.readDir(CAMERA_DIR);
        list = list.filter((x) => x.isFile());
        await Promise.all(list.map((item) => RNFS.unlink(item.path)));
        console.warn(`Removed ${list.length} photos`)
    };

    removeAllData = async () => {
        console.warn('removeAllData()');
        await this.removeAllPhotos();
        await Storage.removeAllData()
    };

    _syncUpcList = async (upcList, onUpload) => {
        const {
            auth: {
                session: {
                    user: {_id, displayName}
                }
            }
        } = this.props;
        const user = `${displayName}-${_id}`;
        if (!upcList.length) return {empty: true};

        let allPassed = true;
        top: for (let item of upcList) {
            try {
                // in cart items have already been uploaded, no action needed
                const body = new FormData();
                body.append('user', user);
                for (let index = 0; index < _.size(item.photos); ++index) {
                    const photo = item.photos[index];

                    // this is ... omfg
                    // ios sometimes? changes the APP_ID so the absolute image paths are not valid anymore
                    // so we have to discard the absolute path and re-stich it every time to be sure
                    let uri = photo.uri;
                    if (!(await RNFS.exists(uri))) {
                        const relativeUri = RNFS.DocumentDirectoryPath + photo.relativeUri;
                        if (await RNFS.exists(relativeUri)) photo.uri = relativeUri;
                        else {
                            allPassed = false;
                            continue top
                        }
                    }

                    body.append('fileList', {
                        uri: photo.uri,
                        type: 'image/jpeg',
                        name: photo.uri.split('/').pop()
                    })
                }

                if (_.isEmpty(item.photos)) {
                    body.append('data', JSON.stringify(item))
                } else {
                    const clone = {...item, photos: item.photos.map((x) => _.omit(x, ['uri', 'relativeUri']))};
                    body.append('data', JSON.stringify(clone))
                }

                let result = await fetch(`${Secrets.API_BASE_URL}/uploadItem`, {method: 'post', body});
                result = await result.json();

                if (result.error) throw result.error;

                await onUpload(item)
            } catch (ex) {
                allPassed = false;
                // log the error but carry on
                notifyAndLogError(ex)
            }
        }

        return allPassed
    };

    quickSync = async () => {
        const upcList = _.cloneDeep(this._getToUpdate())
            .filter((item) => !item.isQuickSynced && (['cart', 'done'].includes(item.storeStatus) || item.outOfStock))
            .map((item) =>
                item.storeStatus === 'cart' || item.outOfStock
                    ? {...item, isSafeToClearDiff: true}
                    : item.storeStatus === 'done' // don't set any isSafeTo* flags, since this is a partial update
                    ? {..._.pick(item, ['upc', 'outOfStock']), storeStatus: 'cart', toQuickSync: true}
                    : null
            )
            .filter((item) => item);

        return this._syncUpcList(upcList, async (item) => {
            if (item.toQuickSync) return this.updateUpc(item.upc, {isQuickSynced: true});
            else return this.clearUpcOnSyncHandler(item)
        })
    };

    sync = async () => {
        return this._syncUpcList(_.cloneDeep(this._getToUpdate()), (item) =>
            this.clearUpcOnSyncHandler({...item, isSafeToClearDiff: true, isSafeToRemovePhotos: true})
        )
    };

    syncOne = async () => {
        const [done, rest] = _.partition(this._getToUpdate(), {storeStatus: 'done'});
        const list = _.shuffle(done.length ? done : rest).slice(0, 1);

        if (!list.length) return {ok: true, empty: true};

        try {
            await this._syncUpcList(_.cloneDeep(list), (item) =>
                this.clearUpcOnSyncHandler({...item, isSafeToClearDiff: true, isSafeToRemovePhotos: true})
            );
            return {ok: true, item: list[0]}
        } catch (error) {
            return {ok: false, error}
        }
    };

    clearUpcOnSyncHandler = async (item) => {
        try {
            if (item.isSafeToClearDiff) await Storage.clearUpc(item.upc);
            if (item.isSafeToRemovePhotos) {
                await Promise.all(_.map(item.photos, (photo) => RNFS.unlink(photo.uri)))
            }
            console.log(' - Uploaded %s %s | %s', item.storeStatus, item.upc)
        } catch (ex) {
            // log the error but carry on
            notifyAndLogError(ex)
        }
    };

    updateUpc = async (upc, diff) => {
        const {incrementUserStat} = this.props;
        const {storeStatus} = this.state.getUPC(upc) || {};
        await Storage.updateUpc(upc, diff);

        if (diff.storeStatus !== storeStatus && ['done', 'cart'].includes(diff.storeStatus)) {
            incrementUserStat(diff.storeStatus)
        }
    };

    render() {
        const {Klass, props} = this.props;

        return <Klass {...props} data={this.state}/>
    }
}

const withData = compose(
    withAuth,
    connect(
        () => ({}),
        {incrementUserStat: SageActions.incrementUserStat}
    ),
    (Klass) => ({auth, incrementUserStat, ...props}) => (
        <_WithDataDecorator Klass={Klass} props={props} auth={auth} incrementUserStat={incrementUserStat}/>
    )
);

export default withData

export const withUpcData = (Klass) =>
    withData(
        class WithUpcData extends PureComponent {
            static propTypes = {
                // from props
                upc: PropTypes.string,

                // from HOCs
                data: PropTypes.object.isRequired
            };

            getState = ({upc, data}) => ({
                upcData: data.getUPC(upc) || getEmptyUpcData(upc)
            });

            state = this.getState(this.props);

            componentWillReceiveProps(nextProps) {
                if (
                    nextProps.upc !== this.props.upc ||
                    nextProps.data !== this.props.data ||
                    nextProps.diff !== this.props.diff
                ) {
                    this.setState(this.getState(nextProps))
                }
            }

            updateUpc = (diff) => this.props.data.updateUpc(this.props.upc, diff);

            render() {
                const {upc, data, ...props} = this.props;

                return <Klass {...props} data={this.state.upcData} updateUpc={this.updateUpc}/>
            }
        }
    );
