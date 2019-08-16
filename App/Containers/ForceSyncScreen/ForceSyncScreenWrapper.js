import React from 'react';
import ForceSyncScreen from './index';

export default class ForceSyncScreenWrapper extends React.Component {
  render () {
    return <ForceSyncScreen {...this.props} />
  }
};
