// https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md
import React from 'react'
import PropTypes from 'prop-types'
import Button from '../../App/Components/Button'
import { shallow } from 'enzyme'

// Basic wrapper
const wrapper = shallow(<Button onPress={() => {}} text='howdy' />)

it('component exists', () => {
  expect(wrapper.length).toBe(1) // exists
})

it('component structure', () => {
  expect(wrapper.name()).toBe('TouchableOpacity') // the right root component
  expect(wrapper.children().length).toBe(1) // has 1 child
  expect(
    wrapper
      .children()
      .first()
      .name()
  ).toBe('Text') // that child is Text
})

it('the text is set properly', () => {
  expect(
    wrapper
      .children()
      .first()
      .props().children
  ).toBe('howdy')
})

it('onPress', () => {
  let i = 0 // i guess i could have used sinon here too... less is more i guess
  const onPress = () => i++
  const wrapperPress = shallow(<Button onPress={onPress} text='hi' />)

  expect(wrapperPress.prop('onPress')).toBe(onPress) // uses the right handler
  expect(i).toBe(0)
  wrapperPress.simulate('press')
  expect(i).toBe(1)
})

it('renders children text when passed', () => {
  const wrapperChild = shallow(<Button onPress={() => {}}>Howdy</Button>)
  expect(wrapperChild.children().length).toBe(1) // has 1 child
  expect(
    wrapperChild
      .children()
      .first()
      .name()
  ).toBe('Text') // that child is Text
})
