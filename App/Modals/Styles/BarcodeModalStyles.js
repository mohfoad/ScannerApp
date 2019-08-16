import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Themes/'

export default {
  ...ApplicationStyles.screen,
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    backgroundColor: Colors.transparent
  },
  modal: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    backgroundColor: Colors.transparent,
    margin: 0,
    padding: 0,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  modalContent: {
    width: Metrics.screenWidth,
    height: Metrics.modalHeight,
    backgroundColor: Colors.white,
    margin: 0,
    padding: 0
  },
  heading: {
    height: Metrics.buttonHeight,
    backgroundColor: Colors.primary,
    justifyContent: 'center'
  },
  headingText: {
    ...Fonts.style.heading,
    color: Colors.white,
    textAlign: 'center',
    marginVertical: Metrics.baseMargins
  },
  input: {
    marginTop: Metrics.baseMargin,
    marginBottom: Metrics.doubleBaseMargin
  }
}
