import mockery from 'mockery'
import m from 'module'

// inject __DEV__ as it is not available when running through the tests
global.__DEV__ = true

// We enable mockery and leave it on.
mockery.enable()

// Silence the warnings when *real* modules load... this is a change from
// the norm.  We want to opt-in instead of opt-out because not everything
// will be mocked.
mockery.warnOnUnregistered(false)

// Mock any libs that get called in here
// I'm looking at you react-native-router-flux, reactotron etc!
jest.mock('reactotron-react-native')
jest.mock('reactotron-redux')
jest.mock('reactotron-apisauce')
jest.mock('react-native-animatable')
jest.mock('react-native-vector-icons/Ionicons')
jest.mock('react-native-vector-icons/MaterialIcons')
jest.mock('LayoutAnimation')
jest.mock('NativeEventEmitter')

// Mock all images for React Native
const originalLoader = m._load
m._load = (request, parent, isMain) => {
  if (request.match(/.jpeg|.jpg|.png|.gif$/)) {
    return { uri: request }
  }

  return originalLoader(request, parent, isMain)
}
