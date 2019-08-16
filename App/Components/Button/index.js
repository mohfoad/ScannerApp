import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, ActivityIndicator, TouchableOpacity, Text, Image} from 'react-native';
import Styles from './styles';
import {Colors} from '../../Themes/';

export default class Button extends React.Component {
    getText() {
        return this.props.text || (typeof this.props.children === 'string' ? this.props.children.toString() : '')
    }

    render() {
        const onPress = this.props.disabled || this.props.loading ? () => {
        } : this.props.onPress;
        const activityIndicatorColor = this.props.inverted
            ? Colors.primaryDark
            : this.props.dark
                ? Colors.white
                : Colors.white;
        return (
            <TouchableOpacity
                style={[
                    Styles.button,
                    this.props.inverted && Styles.invertedButton,
                    this.props.dark && Styles.darkButton,
                    this.props.red && Styles.redButton,
                    this.props.center && Styles.center,
                    this.props.disabled && Styles.disabledButton,
                    this.props.style
                ]}
                onPress={onPress}
            >
                {this.props.loading ? (
                    <ActivityIndicator size={'small'} color={activityIndicatorColor}/>
                ) : (
                    <Text
                        style={[
                            Styles.buttonText,
                            this.props.inverted && Styles.invertedButtonText,
                            this.props.dark && Styles.darkButtonText,
                            this.props.red && Styles.darkButtonText,
                            this.props.textStyle
                        ]}
                    >
                        {this.getText()}
                    </Text>
                )}
                {this.props.image ? <Image source={this.props.image} style={Styles.image}/> : null}
                {typeof this.props.children === 'string' ? null : this.props.children}
            </TouchableOpacity>
        )
    }
}

Button.propTypes = {
    navigator: PropTypes.object,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    text: PropTypes.string,
    onPress: PropTypes.func.isRequired,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]),
    textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]),
    inverted: PropTypes.bool,
    dark: PropTypes.bool,
    children: PropTypes.any,
    image: PropTypes.any
};

Button.defaultProps = {
    disabled: false,
    loading: false,
    style: StyleSheet.create({}),
    textStyle: StyleSheet.create({}),
    inverted: false,
    dark: false,
    children: [],
    image: false
};
