// https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md
import React from 'react'
import PropTypes from 'prop-types'
import Pill from '../../App/Components/Pill'
import { shallow } from 'enzyme'

const wrapper = shallow(<Pill text={1} />)

it('component exists', () => {
  expect(wrapper.length).toBe(1) // exists
})

it('component structure', () => {
  expect(wrapper.name()).toBe('TouchableWithoutFeedback') // the right root component
  expect(wrapper.children().length).toBe(1) // has 1 child
  expect(
    wrapper
      .children()
      .first()
      .name()
  ).toBe('View') // that child is View
})
