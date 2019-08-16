// process STARTUP actions
function someNormalFunction () {
  return true
}

export function * startup (action) {
  if (__DEV__ && console.tron) {
    // straight-up string logging
    console.tron.log('Hello, I\'m an example of how to log via Reactotron.')

    // logging an object for better clarity
    console.tron.log({
      message: 'pass objects for better logging',
      someGeneratorFunction: startup
    })

    // fully customized!
    const subObject = { a: 1, b: [1, 2, 3], c: true }
    subObject.circularDependency = subObject // osnap!
    console.tron.display({
      name: 'Sage 🍃',
      preview: 'Just an example log',
      value: {
        '🍃': 'Welcome to the future, where emojis are lingua franca and communication succeeds if only by accident!',
        subObject,
        someInlineFunction: () => true,
        someGeneratorFunction: startup,
        someNormalFunction: someNormalFunction
      }
    })
  }
}
