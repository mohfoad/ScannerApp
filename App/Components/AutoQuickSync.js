import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import {compose} from 'recompose'
import {connect} from 'react-redux'
import _ from 'lodash'

import withData from '../Decorators/withData'
import PromiseUtil from '../Utils/PromiseUtil'
import {notifyAndLogError} from '../Lib/bugsnag'

// how ofter do we poll for updates from the server
const POLL_REMOTE_DIFF_INTERVAL = 90e3;

// default timeout between every single sync
const UPLOAD_BASE_TIMEOUT = 10e3;

// delay after a single sync error has occurred. This is higher to account for e.g. no network
const UPLOAD_ERROR_TIMEOUT = 60e3;

// slightly higher delay after a big upload (sync of a "done" product with images) to give time for other requests to catch up
const UPLOAD_HEAVY_TIMEOUT = 20e3;

class AutoQuickSync extends PureComponent {
    static propTypes = {
        currentScreen: PropTypes.string.isRequired
    };

    componentDidMount() {
        this.start()
    }

    componentWillUnmount() {
        clearInterval(this._interval);
        delete this.autoDoneSync
    }

    start({autoQuickSync} = this.props) {
        clearInterval(this._interval);
        this._interval = setInterval(() => this.quickSync(), POLL_REMOTE_DIFF_INTERVAL);

        this.autoDoneSync = true;
        this.runSyncLoop()
    }

    // don't sync on the sync screen, for syncing reasons
    canSync() {
        return !['ForceSyncScreen'].includes(this.props.currentScreen)
    }

    quickSync = async () => {
        const {data} = this.props;

        if (!this.canSync()) return;

        try {
            // await data.quickSync() // runSyncLoop() actually handles auto syncing now, no need for dis
            await data.fetch(
                // perform a full update from time to time
                _.isEmpty(_.get(data, 'result.upc')) || (this.lastUpdate && Date.now() - this.lastUpdate > 3600e3)
                    ? {}
                    : {variables: {updatedDate: data.result.date}}
            );
            this.lastUpdate = Date.now()
        } catch (error) {
            notifyAndLogError(error)
        }
    };

    runSyncLoop = async () => {
        if (!__DEV__) await PromiseUtil.sleep(60e3); // delay the start of this, allow startup fetches

        while (true) {
            if (!this.autoDoneSync) return;

            let timeout = UPLOAD_BASE_TIMEOUT;

            if (this.canSync()) {
                try {
                    const {ok, item = {}, empty, error} = await this.props.data.syncOne();
                    timeout = !ok
                        ? UPLOAD_ERROR_TIMEOUT
                        : item.storeStatus === 'done'
                            ? UPLOAD_HEAVY_TIMEOUT
                            : UPLOAD_BASE_TIMEOUT
                } catch (ex) {
                    notifyAndLogError(ex);
                    timeout = UPLOAD_ERROR_TIMEOUT
                }
            }

            await PromiseUtil.sleep(timeout)
        }
    };

    render() {
        if (__DEV__) global.AutoQuickSync = this;
        return null
    }
}

export default compose(withData)(AutoQuickSync)
