import React from 'react'
import CreateAccountScreen from './index'

export default class CreateAccountScreenWrapper extends React.Component {
  render () {
    return <CreateAccountScreen {...this.props} />
  }
}
