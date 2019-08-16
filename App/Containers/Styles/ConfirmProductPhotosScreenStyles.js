import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

export default {
  ...ApplicationStyles.screen,
  boldLabel: {
    ...Fonts.style.smallBold,
    alignSelf: 'center',
    color: Colors.darkGray,
    textAlign: 'center',
    marginVertical: Metrics.baseMargin,
    backgroundColor: Colors.transparent
  },
  label: {
    ...Fonts.style.bigDescription,
    alignSelf: 'center',
    color: Colors.primaryDark,
    textAlign: 'center',
    marginTop: Metrics.baseMargin,
    marginBottom: Metrics.doubleBaseMargin
  },
  headingWrapper: {
    backgroundColor: Colors.white,
    alignItems: 'center'
  },
  checkProduct: {
    marginVertical: Metrics.baseMargin,
    width: 28,
    height: 38
  },
  productNameLabelWrapper: {
    flex: 2,
    marginLeft: Metrics.baseMargin,
    alignSelf: 'flex-start'
  },
  productNameLabel: {
    ...Fonts.style.small,
    color: Colors.primaryDark
  },
  lastCapturedLabel: {
    ...Fonts.style.tiny,
    color: Colors.primaryDark,
    marginTop: Metrics.baseMargin
  },
  productPhotosContainer: {
    flex: 1
  },
  productThumbWrapper: (isSelected = false) => ({
    width: 230,
    height: 230,
    borderColor: isSelected ? Colors.primaryDark : Colors.gray,
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderRadius: Metrics.doubleBaseBorderRadius,
    marginRight: Metrics.doubleBaseMargin,
    overflow: 'visible'
  }),
  productThumb: {
    width: 230,
    height: 230
  }
}
