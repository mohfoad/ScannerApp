import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native'
import Styles from './styles'

export default class Pill extends React.Component {
    getText () {
        const pillText = this.props.text || ''
        return pillText.toString()
    }

    onPress = () => {
        this.props.onPress(this.props.text)
    }

    render () {
        const onPress = this.props.disabled ? () => {} : this.onPress
        if (!this.props.text) {
            return null
        }
        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View
                    style={[
                        Styles.pill,
                        this.props.isHidden && Styles.pillHidden,
                        this.props.isSelected && Styles.pillSelected,
                        this.props.style
                    ]}
                >
                    <Text style={[Styles.pillText, this.props.isSelected && Styles.pillSelectedText, this.props.textStyle]}>
                        {this.getText()}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

Pill.propTypes = {
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]),
    textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]),
    isHidden: PropTypes.bool,
    isSelected: PropTypes.bool
}

Pill.defaultProps = {
    onPress: () => {},
    style: StyleSheet.create({}),
    textStyle: StyleSheet.create({}),
    isHidden: false,
    isSelected: false
}
