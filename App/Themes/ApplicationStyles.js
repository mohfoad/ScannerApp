import Fonts from './Fonts'
import Metrics from './Metrics'
import Colors from './Colors'

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android
const ApplicationStyles = {
  screen: {
    container: {
      flex: 1,
      backgroundColor: Colors.lightGray
    },
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.transparent,
      marginTop: Metrics.statusBarHeight,
      height: Metrics.screenHeight
    },
    mainContainerWithoutNavBar: {
      flex: 1,
      backgroundColor: Colors.transparent,
      height: Metrics.navBarHeight
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    section: {
      margin: Metrics.section,
      padding: Metrics.basePadding
    },
    sectionText: {
      ...Fonts.style.normal,
      paddingVertical: Metrics.doubleBaseMargin,
      color: Colors.white,
      marginVertical: Metrics.halfBaseMargin,
      textAlign: 'center'
    },
    subtitle: {
      color: Colors.white,
      padding: Metrics.halfBaseMargin,
      marginBottom: Metrics.halfBaseMargin,
      marginHorizontal: Metrics.halfBaseMargin
    },
    titleText: {
      ...Fonts.style.h2,
      fontSize: 14,
      color: Colors.text
    },
    form: {
      margin: Metrics.baseMargin,
      borderRadius: Metrics.baseBorderRadius,
      width: Metrics.formWidth,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexGrow: 1
    },
    logo: {
      width: Metrics.images.logo,
      resizeMode: 'contain'
    }
  },
  labelContainer: {
    padding: Metrics.halfBaseMargin,
    paddingBottom: Metrics.doubleBaseMargin,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    marginBottom: Metrics.baseMargin
  },
  label: {
    fontFamily: Fonts.type.bold,
    color: Colors.darkGray
  },
  groupContainer: {
    margin: Metrics.halfBaseMargin,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  sectionTitle: {
    ...Fonts.style.h4,
    color: Colors.darkGray,
    backgroundColor: Colors.lightGray,
    padding: Metrics.halfBaseMargin,
    marginTop: Metrics.halfBaseMargin,
    marginHorizontal: Metrics.baseMargin,
    borderWidth: 1,
    borderColor: Colors.darkGray,
    alignItems: 'center',
    textAlign: 'center'
  }
}

export default ApplicationStyles
