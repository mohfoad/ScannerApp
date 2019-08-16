import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { isEmpty } from 'ramda'
import Styles, { defaultHeight } from './styles'
import { Colors } from '../../Themes'

export default class ValidatedTextInput extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            value: this.props.value,
            isValid: typeof this.props.isValid === 'boolean' ? this.props.isValid : true,
            isFocused: false,
            isValidated: false
        }
    }

    componentDidMount () {
        // if this input isnt required this will be true
        // we 'validate' the empty input with the value prop in case its somehow valid at didMount
        // & notify parent form of validity
        this.props.onValidityChange(this, this.getIsValid())
    }

    // allows us to re-validate state-driven props setting the value of the input
    // after redux completes its cycle on the parent form
    // and updating the UI accordingly.
    componentWillReceiveProps (nextProps) {
        const { validationFn, value } = this.props
        if ((value !== nextProps.value && !isEmpty(nextProps.value)) || this.props.isValid !== nextProps.isValid) {
            let isValid
            if (typeof nextProps.isValid === 'boolean') {
                isValid = nextProps.isValid
            } else {
                isValid = this.getIsValid(nextProps.value)
            }
            // notify parent form of validity
            this.props.onValidityChange(this, isValid)
            // if we pass in default values that are not empty (false-y),
            // pre-validate and update state to reflect validation results.
            this.setState({
                value: nextProps.value,
                isValidated: validationFn ? isValid : !!nextProps.value,
                isValid
            })
        }
    }

    getIsValid = (eValue) => {
        const { validationFn, value, isValid, isValidating } = this.props
        if (isValidating) {
            return false
        }
        if (typeof isValid === 'boolean') {
            return isValid
        }
        return validationFn ? validationFn(eValue || value) : true
    }

    handleChange = (e) => {
        const { validationFn } = this.props
        const isValid = this.getIsValid(e.nativeEvent.text)
        this.setState({
            value: e.nativeEvent.text,
            isValidated: validationFn ? isValid : !!e.nativeEvent.text
        })
        // the app fires a change event when it populates the fields
        this.props.onValidityChange(this, isValid)
        this.props.onChange(e.nativeEvent.text, e, isValid)
        return isValid
    }

    handleBlur = (e) => {
        this.setState({
            isValid: this.handleChange(e),
            isFocused: false
        })
        this.props.onBlur(e)
    }

    handleFocus = (e) => {
        this.setState({
            isFocused: true
        })
        this.props.onFocus(this.props.index)
    }

    handleFocusFromParent = (e) => {
        this.setState({
            isFocused: true
        })
        this.refs[this.props.index].focus()
    }

    render () {
        const { isValid, isFocused, isValidated } = this.state

        const {
            editable,
            errorMessage,
            index,
            keyboardType,
            onSubmitEditing,
            placeholder,
            required,
            returnKeyType,
            secureTextEntry,
            style,
            value,
            autoCapitalize,
            selectTextOnFocus,
            inverted,
            invertedColor,
            invertedTextColor
        } = this.props

        const hasValue = value && value.length > 0

        return (
            <View style={[Styles.container(defaultHeight, isFocused, inverted, invertedColor), style]}>
                <TextInput
                    ref={index}
                    style={Styles.input(defaultHeight, inverted, invertedTextColor)}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    onFocus={this.handleFocus}
                    placeholder={placeholder}
                    value={value}
                    editable={editable}
                    secureTextEntry={secureTextEntry}
                    returnKeyType={returnKeyType}
                    keyboardType={keyboardType}
                    onSubmitEditing={onSubmitEditing}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                    selectTextOnFocus={selectTextOnFocus}
                />
                {isValid || !required ? null : (
                    <TouchableOpacity onPress={this.handleFocusFromParent} onFocus={this.handleFocus}>
                        <Text
                            style={[
                                Styles.errorContainer(
                                    isValid,
                                    hasValue,
                                    isFocused,
                                    isValidated && hasValue,
                                    defaultHeight,
                                    inverted,
                                    invertedColor
                                ),
                                this.props.errorStyle
                            ]}
                        >
                            {required && '*'} {errorMessage}
                        </Text>
                    </TouchableOpacity>
                )}
                {required ? <Text style={Styles.required(isFocused, isValid, hasValue)}>*</Text> : null}
            </View>
        )
    }
}

ValidatedTextInput.propTypes = {
    editable: PropTypes.bool,
    errorMessage: PropTypes.string,
    errorStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]),
    isValidating: PropTypes.bool,
    // passing the prop isValid will skip validationFn and validate depending on this value
    isValid: PropTypes.bool,
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    keyboardType: PropTypes.string,
    name: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    onValidityChange: PropTypes.func,
    placeholder: PropTypes.string.isRequired,
    required: PropTypes.bool,
    returnKeyType: PropTypes.string,
    secureTextEntry: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]),
    validationFn: PropTypes.func, // returns true or an error string
    value: PropTypes.string,
    autoCapitalize: PropTypes.string,
    selectTextOnFocus: PropTypes.bool,
    inverted: PropTypes.bool,
    invertedColor: PropTypes.string,
    invertedTextColor: PropTypes.string
}

ValidatedTextInput.defaultProps = {
    editable: true,
    errorMessage: 'Error.',
    isValidating: false,
    keyboardType: 'default',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    onSubmitEditing: () => {},
    onValidityChange: () => {},
    required: false,
    secureTextEntry: false,
    style: {},
    validationFn: null,
    value: '',
    autoCapitalize: 'words',
    selectTextOnFocus: false,
    inverted: false,
    invertedColor: Colors.white,
    invertedTextColor: Colors.white
}
