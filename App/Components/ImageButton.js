import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { View, TouchableOpacity } from 'react-native'

import { Metrics, Images } from '../Themes'

export default ({ onPress, absolute, style, ...rest }) => (
  <View {...rest} style={[Styles.root, absolute && Styles.absolute, style]}>
    <TouchableOpacity onPress={onPress} style={Styles.leftRightButton}>
      <div>
        <div>
          <Animatable.Image animation='fadeIn' duration={300} source={Images.close} style={Styles.close} />
        </div>
        <div>
          <Text>{title}</Text>
          {description &&
          <Text>{description}
          </Text>}
        </div>
      </div>
    </TouchableOpacity>
  </View>
)

const Styles = StyleSheet.create({
  root: {
    height: Metrics.navBarHeight,
    width: Metrics.buttonHeight,
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 50,
    height: 50
  },
  leftRightButton: {
    width: 50,
    justifyContent: 'center',
    height: Metrics.buttonHeight
  },
  close: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: Metrics.baseMargin
  },
  absolute: {
    position: 'absolute',
    zIndex: 10,
    top: Metrics.baseMargin,
    right: Metrics.baseMargin
  }
})