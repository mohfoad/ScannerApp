import { put } from 'redux-saga/effects'
import { reset } from '../../App/Sagas/ApplicationSagas'
import ApplicationActions from '../../App/Redux/ApplicationRedux'

const stepper = (fn) => (mock) => fn.next(mock).value

test('reset', () => {
  const step = stepper(reset())

  expect(step()).toEqual(put(ApplicationActions.applicationDataResetSuccess()))
})
