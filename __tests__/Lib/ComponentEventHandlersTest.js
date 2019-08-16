// https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md
import { keyboardDidShow, keyboardDidHide } from '../../App/Lib/ComponentEventHandlers'
import { Metrics } from '../../App/Themes'

// hackery to test this since setState on the shallow() wrapper node actually makes
// the state property a function on this which breaks the handler logic -- just needs to test the logic
const wrapper = {
  state: {
    visibleHeight: Metrics.screenHeight
  },
  setState: function (newState) {
    this.state = newState
  }
}
wrapper.setState.bind(wrapper)

it('updates state to change visible height on keyboardDidShow', () => {
  const dummyEvent = { endCoordinates: { height: 20 } }
  wrapper.setState({ visibleHeight: Metrics.screenHeight })
  const boundKeyboardDidShow = keyboardDidShow.bind(wrapper)
  boundKeyboardDidShow(dummyEvent)
  expect(wrapper.state.visibleHeight).toBe(Metrics.screenHeight - dummyEvent.endCoordinates.height)
})

it('updates state to original visible height on keyboardDidHide', () => {
  const dummyEvent = {}
  const boundKeyboardDidHide = keyboardDidHide.bind(wrapper)
  boundKeyboardDidHide(dummyEvent)
  expect(wrapper.state.visibleHeight).toBe(Metrics.screenHeight)
})
