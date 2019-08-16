import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  infoContainer: {
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    paddingBottom: 40,
    height: Metrics.screenHeight
  },
  container: {
    alignItems: 'center',
    width: Metrics.screenWidth
  },
  leftRightButton: {
    width: 50,
    justifyContent: 'center',
    height: Metrics.buttonHeight
  },
  closeButton: {
    flex: 1,
    height: Metrics.navBarHeight,
    width: Metrics.buttonHeight,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  close: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: Metrics.baseMargin
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.primaryDark,
    height: Metrics.breadcrumbHeight,
    width: Metrics.screenWidth,
    paddingTop: Metrics.statusBarHeight,
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1
  }
})
