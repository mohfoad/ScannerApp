import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles, Fonts } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  onboardingContainer: {
    alignItems: 'center',
    width: Metrics.screenWidth,
    backgroundColor: Colors.primary
  },
  loginRow: {
    paddingTop: Metrics.doubleBasePadding,
    paddingBottom: Metrics.doubleBasePadding,
    paddingHorizontal: Metrics.doubleBasePadding,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  loginButtonWrapper: {
    flex: 1
  },
  loginButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.darkGray,
    backgroundColor: Colors.lightGray,
    padding: Metrics.basePadding,
    borderRadius: Metrics.baseBorderRadius
  },
  button: {
    borderWidth: 0
  },
  slide: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  slide2: {
    backgroundColor: 'white',
    width: Metrics.screenWidth,
    height: Metrics.screenHeight
  },
  slide3: {
    backgroundColor: 'blue',
    width: Metrics.screenWidth,
    height: Metrics.screenHeight
  },
  slide4: {
    backgroundColor: 'purple',
    width: Metrics.screenWidth,
    height: Metrics.screenHeight
  },
  slide5: {
    backgroundColor: 'green',
    width: Metrics.screenWidth,
    height: Metrics.screenHeight
  },
  slide6: {
    backgroundColor: 'yellow',
    width: Metrics.screenWidth,
    height: Metrics.screenHeight
  },
  dotsWrapper: {
    width: Metrics.screenWidth,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.transparent,
    backgroundColor: Colors.twentyPercentWhite,
    marginHorizontal: Metrics.baseMargin
  },
  activeDot: {
    borderColor: Colors.white
  },
  onboarding1Image: {
    width: 280,
    height: 240,
    marginTop: 20
  },
  onboarding2Image: {
    width: Metrics.screenWidth,
    height: 252
  },
  onboarding3Image: {
    width: 266,
    height: 140,
    marginTop: 130
  },
  onboarding4Image: {
    width: 214,
    height: 140,
    marginTop: 130
  },
  onboarding5Image: {
    width: 130,
    height: 202,
    marginTop: 90
  },
  promptRow: {
    paddingTop: Metrics.doubleBasePadding,
    paddingBottom: Metrics.basePadding,
    paddingHorizontal: Metrics.doubleBasePadding,
    margin: Metrics.baseMargin,
    marginTop: 20 + Metrics.baseMargin + Metrics.statusBarHeight,
    width: Metrics.formWidth,
    alignSelf: 'center'
  },
  heading: {
    ...Fonts.style.heading,
    color: Colors.white,
    marginTop: 30,
    marginBottom: 15
  },
  secondaryHeading: {
    ...Fonts.style.heading,
    color: Colors.white,
    marginTop: 10
  },
  prompt: {
    ...Fonts.style.normal,
    color: Colors.white,
    marginBottom: Metrics.doubleBaseMargin
  },
  description: {
    ...Fonts.style.normal,
    color: Colors.white,
    textAlign: 'center',
    width: Metrics.screenWidth * 4 / 5,
    lineHeight: Fonts.size.h4,
    marginBottom: Metrics.doubleBaseMargin
  }
})
