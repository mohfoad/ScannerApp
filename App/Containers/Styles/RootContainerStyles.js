import { StyleSheet } from 'react-native'
import { Colors, Fonts, Metrics } from '../../Themes/'

export default StyleSheet.create({
  applicationView: {
    flex: 1,
    backgroundColor: Colors.primary
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.primary
  },
  webviewContainerTitleText: {
    ...Fonts.style.heading,
    top: Metrics.statusBarHeight + Metrics.doubleBaseMargin + Metrics.baseMargin,
    width: Metrics.screenWidth,
    position: 'absolute',
    textAlign: 'center',
    paddingHorizontal: Metrics.doubleBasePadding,
    color: Colors.primaryDark
  },

  webviewContainer: {
    paddingTop: Metrics.navBarHeight + Metrics.tripleBasePadding,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    position: 'absolute',
    zIndex: 10003,
    top: 0,
    left: 0,
    backgroundColor: Colors.lightGray
  },

  webviewSpacer: {
    width: Metrics.screenWidth,
    height: 1,
    backgroundColor: Colors.gray
  },

  closeImageContainer: {
    position: 'absolute',
    top: Metrics.statusBarHeight + Metrics.doubleBaseMargin + Metrics.halfBaseMargin,
    right: Metrics.doubleBaseMargin
  },

  closeImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain'
  }
})

export const alertColors = {
  error: Colors.red,
  success: Colors.green,
  info: Colors.yellow,
  text: Colors.white
}

export const statusBarColor = Colors.primary
