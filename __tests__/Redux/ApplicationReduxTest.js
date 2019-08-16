import Actions, { reducer, INITIAL_STATE } from '../../App/Redux/ApplicationRedux'

test('set & reset', () => {
  const applicationState = reducer(INITIAL_STATE, Actions.applicationDataSetRequest('key', 'value'))
  expect(applicationState.data).toEqual({
    key: 'value'
  })

  const state = reducer(applicationState, Actions.applicationDataResetSuccess())

  expect(state.data).toEqual({ topology: {} })
})
