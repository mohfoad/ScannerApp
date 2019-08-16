import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet} from 'react-native'
import * as Animatable from 'react-native-animatable'
import {View, TouchableOpacity} from 'react-native'
import * as scale from '../Utils/Scale';

import {Metrics, Images} from '../Themes'

export default ({onPress, absolute, style, ...rest}) => (
    <View {...rest} style={[Styles.root, absolute && Styles.absolute, style]}>
        <TouchableOpacity onPress={onPress} style={Styles.leftRightButton}>
            <Animatable.Image animation='fadeIn' duration={300} source={Images.close} style={Styles.close}/>
        </TouchableOpacity>
    </View>
)

const Styles = StyleSheet.create({
    root: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 50 * scale.widthRatio,
        height: 50 * scale.widthRatio
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
});
