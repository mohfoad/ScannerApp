import React from 'react';
import SyncScreen from './index';

export default class SyncScreenWrapper extends React.Component {
    render () {
        return <SyncScreen {...this.props} />
    }
};
