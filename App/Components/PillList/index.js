import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text } from 'react-native'
import Styles from './styles';

const ValueType = PropTypes.oneOfType([PropTypes.string, PropTypes.number])

export default class PillList extends PureComponent {
    static propTypes = {
        value: ValueType,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                key: ValueType,
                label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
            })
        ).isRequired,
        onChange: PropTypes.func.isRequired
    }

    render () {
        const { value, options, onChange, style } = this.props

        return (
            <View style={[Styles.root, style]}>
                {options.map(({ key, label }, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onChange(key)}
                        style={[Styles.option, key === value ? Styles.selected : null]}
                    >
                        <Text style={Styles.text}>{label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        )
    }
}
