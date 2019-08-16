import React from 'react'
import PropTypes from 'prop-types'
import AlertMessage from '../../App/Components/AlertMessage'
import { shallow } from 'enzyme'

// Basic wrapper
const wrapper = shallow(<AlertMessage title='howdy' />)

test('component exists', () => {
  expect(wrapper.length).toBe(1) // exists
})

test('component structure', () => {
  expect(wrapper.name()).toBe('View')
  expect(wrapper.children().length).toBe(1) // has 1 child
  expect(
    wrapper
      .children()
      .first()
      .name()
  ).toBe('View') // that child is View

  const subview = wrapper.children().first()
  expect(subview.children().length).toBe(1)
})

test('style props are passed to top view', () => {
  const withStyle = shallow(<AlertMessage title='howdy' style={{ backgroundColor: 'red' }} />)
  expect(withStyle.props().style[1].backgroundColor).toBe('red')
})

test('show false', () => {
  const hidden = shallow(<AlertMessage title='howdy' show={false} />)
  expect(hidden.children().length).toBe(0)
})
