import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import VersionNumber from 'react-native-version-number'
import _ from 'lodash'

class Stats extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    hasInternet: PropTypes.bool.isRequired,
    userStats: PropTypes.shape({
      date: PropTypes.string.isRequired,
      cart: PropTypes.number.isRequired,
      done: PropTypes.number.isRequired
    }).isRequired
  }

  render () {
    const {
      data,
      hasInternet,
      userStats: { done, cart }
    } = this.props
    const app = _.get(data, 'result.app')
    const outdated = app && (app.version !== VersionNumber.appVersion || app.build > VersionNumber.buildVersion)
    return (
      <View style={[Styles.stats, outdated && Styles.outdated]}>
        <View style={Styles.row}>
          <Text style={Styles.statsText}>{cart} cart</Text>
          <Text style={Styles.statsText}>{done} done</Text>
          <Text style={Styles.statsText}>
            {hasInternet ? <Text style={Styles.wifiOn}>wifi on</Text> : <Text style={Styles.wifiOff}>wifi off</Text>}
          </Text>
        </View>
        {outdated ? (
          <Text style={Styles.outdatedText}>
            Please update app to v{app.version} — Build {app.build}
          </Text>
        ) : null}
      </View>
    )
  }
}

export default compose(connect(({ sage: { hasInternet, userStats } }) => ({ hasInternet, userStats })))(Stats)

import { StyleSheet } from 'react-native'
import { Metrics, Colors, Fonts } from '../Themes'

const Styles = StyleSheet.create({
  stats: {
    position: 'absolute',
    top: Metrics.statusBarHeight + Metrics.baseMargin + 50,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  outdated: {
    backgroundColor: 'rgba(255, 63, 110, 0.75)'
  },
  outdatedText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  statsText: {
    ...Fonts.style.medium,
    flex: 1,
    textAlign: 'center',
    color: Colors.white
  },
  wifiOn: {
    fontWeight: 'bold',
    color: Colors.green
  },
  wifiOff: {
    fontWeight: 'bold',
    color: Colors.magenta
  }
})
