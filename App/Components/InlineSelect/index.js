import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {View, TouchableOpacity, Text} from 'react-native'
import styles from './styles';

const ValueType = PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]);

export default class InlineSelect extends PureComponent {
    static propTypes = {
        value: ValueType,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                key: ValueType,
                label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
            })
        ).isRequired,
        onChange: PropTypes.func.isRequired,
        compact: PropTypes.bool
    };

    render() {
        const {value, options, onChange, compact, style} = this.props;

        return (
            <View style={[styles.root, style]}>
                {options.map(({key, label}, index) => (
                    <TouchableOpacity
                        key={key}
                        onPress={() => onChange(key)}
                        style={[
                            styles.option,
                            compact && styles.option_compact,
                            index < options.length - 1 ? styles.optionBorder : null,
                            key === value ? styles.selected : null
                        ]}
                    >
                        <Text style={[styles.text, compact && styles.text_compact, { color: key === value ? 'white' : '#4a7ffb'}]}>{label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        )
    }
}
