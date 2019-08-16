import * as inputValidators from '../../App/Lib/InputValidators'

it('return an error message if an email is invalid', () => {
  expect(inputValidators.emailValidator('blah')).toBe(false)
})

it('return true if an email is valid', () => {
  expect(inputValidators.emailValidator('test@email.com')).toBe(true)
})

it('return true value is numerical', () => {
  expect(inputValidators.numericValidator('10,000.00')).toBe(true)
})

it('return false if contains non numeric character', () => {
  expect(inputValidators.numericValidator('ten thousand')).toBe(false)
})

it('return false if contains non numeric character', () => {
  expect(inputValidators.numericValidator('42!')).toBe(false)
})

it('be true if url like', () => {
  expect(inputValidators.urlValidator('http://sageproject.com')).toBe(true)
})

it('be false if not url like', () => {
  expect(inputValidators.urlValidator('some text')).toBe(false)
})

it('be true if has value', () => {
  expect(inputValidators.requiredValidator('blah')).toBe(true)
})

it('be false if does not have value', () => {
  expect(inputValidators.requiredValidator()).toBe(false)
})
