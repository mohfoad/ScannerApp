// Common component event handlers
// Assume "this" is bound to a React component instance
// with a 'visibleHeight' key on state
import { LayoutAnimation } from 'react-native'
import { Metrics } from '../Themes'

// Animation types easeInEaseOut/linear/spring
const customKeyboardEasing = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut
  }
}

// @TODO: make these an HOC that also adds listener attachment/removal and state initialization
export function keyboardDidShow (e) {
  LayoutAnimation.configureNext(customKeyboardEasing)
  this.setState({
    visibleHeight: Metrics.screenHeight - e.endCoordinates.height
  })
}

export function keyboardDidHide (e) {
  LayoutAnimation.configureNext(customKeyboardEasing)
  this.setState({
    visibleHeight: Metrics.screenHeight
  })
}
