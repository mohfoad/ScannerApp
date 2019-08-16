import React from 'react'
import ModeSelectorScreen from './index'

export default class ModeSelectorScreenWrapper extends React.Component {
  render () {
    return <ModeSelectorScreen {...this.props} />
  }
}
