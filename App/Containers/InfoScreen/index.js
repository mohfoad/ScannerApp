import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity } from 'react-native'
import { compose, withPropsOnChange } from 'recompose'
import { get as _get } from 'lodash'
import * as Animatable from 'react-native-animatable'

import { Metrics, Colors, Images } from '../../Themes'

// React Apollo
import { withAuth, withLogout } from '../../GraphQL/Account/decorators'

// Styles
import Styles from '../Styles/InfoScreenStyles'

class Index extends React.Component {
  static propTypes = {
    settingApplicationData: PropTypes.bool,
    resettingApplicationData: PropTypes.bool
  }

  constructor (props) {
    super(props)

    this.state = {
      visibleHeight: Metrics.screenHeight
    }

    this.scrollY = 0
  }

  componentWillReceiveProps (newProps) {}

  handleClose = () => {
    this.props.navigation.goBack()
  }

  render () {
    return (
      <View style={{ height: this.state.visibleHeight, backgroundColor: Colors.primary }}>
        <Animatable.View style={[Styles.infoContainer, { height: this.state.visibleHeight }]}>
          <View style={Styles.navBar}>
            <View style={Styles.closeButton}>
              <TouchableOpacity onPress={this.handleClose} style={Styles.leftRightButton}>
                <Animatable.Image animation={'fadeIn'} duration={300} source={Images.close} style={Styles.close} />
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>
      </View>
    )
  }
}

const enhance = compose(
  withAuth,
  withPropsOnChange(
    (props, nextProps) =>
      _get(props, 'auth.session.isAuthenticated', false) !== _get(nextProps, 'auth.session.isAuthenticated', false),
    ({ auth }) => ({
      isAuthenticated: _get(auth, 'session.isAuthenticated', false),
      user: _get(auth, 'session.user', {
        displayName: '',
        email: ''
      })
    })
  ),
  withLogout
)

export default enhance(Index)
