import './App/Config/ReactotronConfig'
import { AppRegistry } from 'react-native'
import KeyboardManager from 'react-native-keyboard-manager'
import App from './App/Containers/App'
// make sure bugsnag is initialized
import './App/Lib/bugsnag'

KeyboardManager.setToolbarPreviousNextButtonEnable(true)
KeyboardManager.setEnable(true)
KeyboardManager.setEnableDebugging(true)
KeyboardManager.setKeyboardDistanceFromTextField(10)
KeyboardManager.setPreventShowingBottomBlankSpace(true)
KeyboardManager.setEnableAutoToolbar(true)
KeyboardManager.setToolbarDoneBarButtonItemText('Done')
KeyboardManager.setToolbarManageBehaviour(0)
KeyboardManager.setShouldToolbarUsesTextFieldTintColor(false)
KeyboardManager.setShouldShowTextFieldPlaceholder(true)
KeyboardManager.setOverrideKeyboardAppearance(false)
KeyboardManager.setShouldResignOnTouchOutside(true)
KeyboardManager.resignFirstResponder()

if (!__DEV__) {
  process.nextTick = setImmediate
}

console.ignoredYellowBox = [
  'Warning: Module ',
  'redux-persist',
  'Warning: isMounted',
  "Warning: Can't call setState (or forceUpdate) on an unmounted component",
  'Native TextInput(',
  'Unable to symbolicate stack trace',
  'Warning: Can only update a mounted or mounting',
  'Warning: Overriding previous layout animation',
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Warning: componentWillUpdate is deprecated',
  '-[RNCamera updateFocusDepth]'
];

console.disableYellowBox = true;
GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

AppRegistry.registerComponent('ScannerApp', () => App);
