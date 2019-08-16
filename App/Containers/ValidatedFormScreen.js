import React from 'react'
import PropTypes from 'prop-types'

/**
 * A non-rendering class that other form containers extend to gain
 * validation functionality.  It is not a decorator because
 * when the decorator is invoked the prototype of the class would
 * be React.Component, and we don't want to bolt these methods on there.
 *
 * isValid should be called by the form container prior to submitting to check validity of all inputs
 * handleValidityChange should be passed to any form inputs that require validation and should
 * be included in the validation results object.
 */
export default class ValidatedFormScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            validationResults: {},
            validatedChildren: {}
        }
    }


    handleSubmit = () => {
    };

    isValid = () => {
        return Object.keys(this.state.validationResults)
            .map((key) => {
                const isValid = this.state.validationResults[key];
                this.state.validatedChildren[key].setState({isValid});
                return isValid
            })
            .every((inputIsValid) => inputIsValid === true);
    };

    handleValidityChange = (childInput, inputIsValid) => {
        // setState is passed a function here because setState is not synchronous
        // we avoid clobbering the validationResults by forcing all updates to happen in series
        this.setState((state) => {
            return {
                validatedChildren: {
                    ...state.validatedChildren,
                    ...{[childInput.props.name]: childInput}
                },
                validationResults: {
                    ...state.validationResults,
                    ...{[childInput.props.name]: inputIsValid}
                }
            }
        })
    };

    collectErrorMessages = () => {
        return Object.keys(this.state.validationResults)
            .map((key) => {
                const isValid = this.state.validationResults[key];
                if (isValid) {
                    return null
                }
                const {props} = this.state.validatedChildren[key];
                const {errorMessage} = props;
                if (errorMessage) {
                    return errorMessage
                }
                return `[${props.name} is invalid but no error message is set]`
            })
            .filter((errorMessage) => errorMessage)
    }
}
