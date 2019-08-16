// https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md
import React from 'react'
import PropTypes from 'prop-types'
import LoadingView from '../../App/Components/LoadingView'
import { shallow } from 'enzyme'

// Basic wrapper
const wrapper = shallow(<LoadingView />)

it('component exists', () => {
  expect(wrapper.length).toBe(1) // exists
})

it('component structure', () => {
  expect(wrapper.name()).toBe('View') // the right root component
  expect(wrapper.children().length).toBe(1) // has 1 child
  expect(
    wrapper
      .children()
      .first()
      .name()
  ).toBe('ActivityIndicator') // that child is ActivityIndicator
})
