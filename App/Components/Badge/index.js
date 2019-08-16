import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'
import Styles from './styles'

export default class Badge extends React.Component {
    getText () {
        const buttonText = this.props.text
        return buttonText.toString().toUpperCase()
    }

    render () {
        return (
            <View style={[Styles.badge, this.props.isHidden && Styles.badgeHidden, this.props.style]}>
                <Text style={[Styles.badgeText, this.props.textStyle]}>{this.getText()}</Text>
            </View>
        )
    }
}

Badge.propTypes = {
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]),
    textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]),
    isHidden: PropTypes.bool
}

Badge.defaultProps = {
    style: StyleSheet.create({}),
    textStyle: StyleSheet.create({}),
    isHidden: false
}
