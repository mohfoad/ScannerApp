import React from 'react'
import { View, Text } from 'react-native'
import ModalPicker from 'react-native-modal-picker'
import { Colors, Metrics } from '../../Themes'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { isEmpty, pathOr, find, propEq, isNil } from 'ramda'

// Styles
import Styles from './styles'

export default class Dropdown extends React.Component {
    getDisplayText () {
        if (isEmpty(this.props.data)) {
            return this.props.disabledText
        }
        if (isNil(this.props.selectedIndex)) {
            return this.props.defaultText
        }

        const item = find(propEq('key', this.props.selectedIndex))(this.props.data)
        return pathOr(null, ['label'], item)
    }

    componentWillReceiveProps (newProps) {
        if (this.props.data.length !== newProps.data.length) {
            this.forceUpdate()
        }
    }

    renderDropdownPlaceholder () {
        return (
            <View style={[Styles.container, !this.props.isValid && Styles.containerInvalid]}>
                <View style={Styles.labelContainer}>
                    <Text style={Styles.label}>{this.getDisplayText()}</Text>
                </View>
                <View style={Styles.icon}>
                    <Icon name='expand-more' color={Colors.darkGray} size={Metrics.icons.medium} />
                </View>
            </View>
        )
    }

    renderModalPicker () {
        return (
            <ModalPicker
                data={this.props.data}
                cancelStyle={Styles.modalPickerCancel}
                optionStyle={Styles.modalPickerOption}
                cancelText={'CANCEL'}
                initValue={this.props.defaultText}
                onChange={(option) => {
                    this.props.onChange && this.props.onChange(option)
                }}
            >
                {this.renderDropdownPlaceholder()}
            </ModalPicker>
        )
    }

    render () {
        if (isEmpty(this.props.data)) {
            return this.renderDropdownPlaceholder()
        } else {
            return this.renderModalPicker()
        }
    }
}

Dropdown.propTypes = {
    defaultText: PropTypes.string,
    disabledText: PropTypes.string,
    data: PropTypes.array,
    selectedIndex: PropTypes.number,
    onChange: PropTypes.func,
    isValid: PropTypes.bool
}

Dropdown.defaultProps = {
    defaultText: 'Please select an option',
    disabledText: 'Dropdown is disabled',
    data: [],
    isValid: true
}
