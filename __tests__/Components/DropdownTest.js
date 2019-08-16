import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from '../../App/Components/Dropdown'
import { shallow } from 'enzyme'

const defaultProps = {
  data: [{ key: 0, label: 'First Option' }, { key: 1, label: 'Second Option' }],
  selectedIndex: null,
  defaultText: 'default',
  disabledText: 'disabled'
}

const wrapper = shallow(<Dropdown {...defaultProps} />)

it('component exist', () => {
  expect(wrapper.length).toBe(1)
})

it('component structure', () => {
  expect(wrapper.name()).toBe('ModalPicker') // the right root component
  expect(wrapper.children().length).toBe(1)
  expect(wrapper.children().name()).toBe('View')
  expect(wrapper.contains('default')).toBe(true)
})

it('default text option', () => {
  expect(wrapper.contains('Not default')).toBe(false)
  wrapper.setProps({ ...defaultProps, defaultText: 'Please select an option' })
  expect(wrapper.contains('Please select an option')).toBe(true)
})

it('display text', () => {
  wrapper.setProps({ ...defaultProps, selectedIndex: 0 })
  expect(wrapper.contains('default')).toBe(false)
  expect(wrapper.contains('First Option')).toBe(true)
})

it('disabled text option', () => {
  wrapper.setProps({ ...defaultProps, data: [] })
  expect(wrapper.contains('disabled')).toBe(true)
})
