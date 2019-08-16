import React from 'react'
import PropTypes from 'prop-types'
import ValidatedTextInput from '../../App/Components/ValidatedTextInput'
import * as inputValidators from '../../App/Lib/InputValidators'

import { shallow } from 'enzyme'

const wrapper = shallow(
  <ValidatedTextInput
    placeholder='email'
    name='EMAIL'
    returnKeyType='next'
    index='email'
    ref='email'
    required
    value='test@email.com'
    onChange={(value) => this.setState({ email: value })}
    validationFn={inputValidators.emailValidator}
    onValidityChange={() => {}}
    onSubmitEditing={() => {}}
    errorMessage='error'
  />
)

it('component exists', () => {
  expect(wrapper.length).toBe(1)
})

it('component structure', () => {
  expect(wrapper.name()).toBe('View')
  expect(wrapper.children().length).toBe(2)
  expect(
    wrapper
      .children()
      .first()
      .name()
  ).toBe('TextInput')
})

it('component initial state', () => {
  expect(wrapper.name()).toBe('View')
  expect(wrapper.children().length).toBe(2)
  expect(wrapper.state().isValid).toBe(true)
  expect(wrapper.state().isFocused).toBe(false)
  expect(wrapper.state().isValidated).toBe(false)
})

it('component text input child props', () => {
  expect(
    wrapper
      .children()
      .first()
      .props().value
  ).toBe('test@email.com')
  expect(
    wrapper
      .children()
      .first()
      .props().placeholder
  ).toBe('email')
})
