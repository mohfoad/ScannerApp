import React, {PureComponent} from 'react'
import _ from 'lodash'
import {AsyncStorage} from 'react-native'
import gql from 'graphql-tag'
import {apolloClient} from '../Lib/Apollo'
import {ReactNativeFile} from 'apollo-upload-client'
import PromiseUtil from './PromiseUtil'
import getEmptyUpcData from './getEmptyUpcData'

const QUERY_PR_DATA = gql`
  query prData($updatedDate: String) {
    prData(updatedDate: $updatedDate)
  }
`;

const BASE_DATA_PREFIX = '@pinto:prData'; // do not edit this, it will make all phones lose all progress
const DIFF_PREFIX = '@pinto:prDiff';

if (DIFF_PREFIX.startsWith(BASE_DATA_PREFIX)) {
    throw 'DIFF_PREFIX should not start with BASE_DATA_PREFIX, this can cause issues with deleting items'
}

// Storing massive objects to AsyncStorage is paaaainfuuullyy slow (JSON.stringify large items in general)
// So we implement a dynamic way of chunking up objects and arrays on set and stitching it back together on get
const OBJECT_CHUNK_SIZE = 250;

class Storage {
    constructor(props) {
        this.data = null;
        this.diff = null;
        this.loading = false;
        this.listeners = [];
        this.queryData = undefined; // important so _.isEqual(null, undefined) ==> false
        this._isInit = false;
        this.setPayload()
    }

    setQueryData = (queryData) => {
        console.log('---- set query data ----');
        if (this.queryData === undefined || !_.isEqual(this.queryData, queryData)) {
            this.queryData = queryData;
            if (this._isInit) this.fetch();
            else this.init()
        }
    };

    setQueryDataDebounced = _.debounce(this.setQueryData, 250);

    makeQuery() {
        if (!this.queryData) return null;

        const query = {};

        if (this.queryData.tag) query.tags = this.queryData.tag;

        return _.isEmpty(query) ? null : query
    }

    setPayload() {
        console.log('---- set payload ----', this.diff);
        this.payload = {
            data: this.data,
            diff: this.diff,
            loading: this.loading
        }
    }

    async init() {
        console.log('[Storage] init()');

        this._isInit = true;

        // restore from memory, should never happen on init, but juuust in case
        if (this.data) return;

        // restore from AsyncStorage
        this.diff = await this.getDiff();
        this.data = await nsGet(BASE_DATA_PREFIX);

        if (this.data) {
            // do some basic cleanup
            for (let key in _.get(this.diff, 'upc') || {}) {
                const val = this.diff.upc[key];
                if (!val.upc) delete this.diff.upc[key]
            }

            return this.applyDiff(this.diff)
        }

        // fetch from network
        return await this.fetch()
    }

    listen(fn) {
        this.listeners.push(fn);
        return () => {
            this.listeners = this.listeners.filter((x) => x !== fn)
        }
    }

    async fetch({variables = {}} = {}) {
        this.loading = true;
        this.update();

        let data;
        try {
            console.log('---------- variables ----------', variables);
            const response = await apolloClient.query({
                query: QUERY_PR_DATA,
                variables,
                fetchPolicy: 'no-cache'
            });
            data = response.data;
            if (response.errors) throw response.errors
        } catch (ex) {
            console.error(ex);
            this.loading = false;
            this.update();
            return
        }

        data = _.get(data, 'prData', null);
        console.log("---- pr data from back-end ----", data);
        if (data && data.isDiff) {
            this.data = {
                date: data.date,
                app: data.app,
                upc: {
                    ..._.get(this.data, 'upc'),
                    ...data.upc
                },
                doneUPCs: _.uniq([..._.get(this.data, 'doneUPCs'), ...data.doneUPCs])
            }
        } else this.data = data;
        await nsSet(BASE_DATA_PREFIX, this.data);
        await this.applyDiff(this.diff)
    }

    update() {
        this.setPayload();
        for (let fn of this.listeners) fn(this.payload)
    }

    async applyDiff(newDiff) {
        console.log('---- new diff ----', newDiff);
        if (newDiff) {
            this.data = {
                ...this.data,
                upc: {
                    ...(_.get(this.data, 'upc') || {}),
                    ...(newDiff.upc || {})
                },
                doneUPCs: _.uniq([...(_.get(this.data, 'doneUPCs') || []), ...(newDiff.doneUPCs || [])])
            }
        } else await this.removeDiff();

        this.loading = false;
        this.update()
    }

    async getDiff() {
        try {
            return JSON.parse(await AsyncStorage.getItem(DIFF_PREFIX))
        } catch (ex) {
            return null
        }
    }

    async setDiff(diff) {
        if (diff) {
            await AsyncStorage.setItem(DIFF_PREFIX, JSON.stringify(diff))
            this.diff = diff
        } else await this.removeDiff()
    }

    async removeDiff() {
        await nsRemove(DIFF_PREFIX);
        this.diff = null;
        this.data = await nsGet(BASE_DATA_PREFIX)
    }

    async updateUpc(upc, diff) {
        if (!upc) {
            console.log(upc, diff);
            console.error('No Upc passed');
            return
        }
        const base = _.get(this.data, ['upc', upc]) || getEmptyUpcData(upc);
        const data = {...base, ...diff};

        // only pending items can be out of stock
        if (['cart', 'done'].includes(data.storeStatus)) delete data.outOfStock;

        const newDiff = mergeUpcUpdata(this.diff, upc, data);
        await this.setDiff(newDiff);
        await this.applyDiff(newDiff)
    }

    async clearUpc(upc) {
        if (_.get(this.diff, ['upc', upc]) === undefined) return;
        const newDiff = {...this.diff, upc: {...this.diff.upc}};
        delete newDiff.upc[upc];
        await this.setDiff(newDiff);
        await this.applyDiff(newDiff)
    }

    async removeAllData() {
        await nsRemove(BASE_DATA_PREFIX);
        await this.removeDiff();
        this.data = null;
        this.loading = false;
        this.update();
        return this.fetch()
    }
}

/** ***** HELPERS *******/

const mergeUpcUpdata = (baseData, upc, upcData) => {
    if (!baseData) return {upc: {[upc]: upcData}};

    return {
        ...baseData,
        upc: {
            ..._.get(baseData, 'upc', {}),
            [upc]: {
                ..._.get(baseData, ['upc', upc], {}),
                ...upcData
            }
        }
    }
};

const nsRemove = async (prefix) =>
    AsyncStorage.multiRemove((await AsyncStorage.getAllKeys()).filter((x) => x.startsWith(prefix)));

const nsGet = async (prefix) => {
    const dataStr = await AsyncStorage.getItem(prefix);
    if (!dataStr) return null;

    const chunkedObj = JSON.parse(dataStr);
    console.log('---- chunked object ----', chunkedObj);
    const result = {};
    for (let key in chunkedObj) {
        const {chunked, value} = chunkedObj[key];
        if (chunked) {
            const chunkList = [];
            for (let chunkKey of value) chunkList.push(JSON.parse(await AsyncStorage.getItem(chunkKey)));
            result[key] =
                chunked === 'array'
                    ? chunkList.reduce((arr, chunk) => arr.concat(chunk), [])
                    : chunkList.reduce((obj, chunk) => Object.assign(obj, chunk), {})
        } else result[key] = value
    }
    console.log('---- get data with chunk key from aync storage ----', result);
    return result
};

const nsSet = async (prefix, obj, {chunkSize = OBJECT_CHUNK_SIZE} = {}) => {
    await nsRemove(prefix);

    if (!obj) return;

    const chunkedObj = {};
    for (let key in obj) {
        const value = obj[key];
        let result;

        if (value && typeof value === 'object') {
            if (Array.isArray(value)) {
                result = {chunked: 'array', value: _.chunk(value, chunkSize)}
            } else {
                result = {chunked: 'object', value: []};
                for (let list of _.chunk(Object.keys(value), chunkSize)) {
                    const item = {};
                    for (let subKey of list) item[subKey] = value[subKey];
                    result.value.push(item)
                }
            }
            result.value = result.value.map((chunk, index) => ({
                key: `${prefix}:${key}:${index}`,
                chunk
            }))
        } else {
            result = {chunked: false, value}
        }

        chunkedObj[key] = result;

        if (result.chunked) {
            if (result.value.length === 1) {
                result.chunked = false;
                result.value = result.value[0].chunk
            } else {
                for (let i = 0; i < result.value.length; ++i) {
                    const {key, chunk} = result.value[i];
                    await AsyncStorage.setItem(key, JSON.stringify(chunk));
                    result.value[i] = key
                }
            }
        }
    }

    console.log('---- make chunk object ----', chunkedObj);

    await AsyncStorage.setItem(prefix, JSON.stringify(chunkedObj))
};

/** **** INIT ******/

// this needs to be a singleton to be a single source of truth
// and it cannot be in redux due to the massive amounts of data
const instance = new Storage(BASE_DATA_PREFIX, DIFF_PREFIX);

export default instance
