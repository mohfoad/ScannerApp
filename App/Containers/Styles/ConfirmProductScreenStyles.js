import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

export default {
  ...ApplicationStyles.screen,
  boldLabel: {
    ...Fonts.style.tinyBold,
    alignSelf: 'center',
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Metrics.halfBaseMargin,
    backgroundColor: Colors.transparent
  },
  label: {
    ...Fonts.style.bigDescription,
    alignSelf: 'center',
    color: Colors.primaryDark,
    textAlign: 'center',
    width: Metrics.formWidth - 20,
    marginBottom: Metrics.doubleBaseMargin
  },
  productCard: {
    width: Metrics.formWidth - 20,
    height: Metrics.formWidth - 60,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: Metrics.baseBorderRadius,
    overflow: 'hidden',
    marginBottom: Metrics.doubleBaseMargin
  },
  productNameRow: {
    height: 84,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    padding: Metrics.doubleBasePadding,
    justifyContent: 'space-between'
  },
  productNameThumbWrapper: {
    width: 42,
    height: 42,
    borderColor: Colors.gray,
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderRadius: Metrics.baseBorderRadius,
    overflow: 'hidden'
  },
  productNameThumb: {
    width: 42,
    height: 42
  },
  productNameLabelWrapper: {
    flex: 2,
    marginLeft: Metrics.doubleBaseMargin,
    alignSelf: 'flex-start'
  },
  productNameLabel: {
    ...Fonts.style.description,
    color: Colors.primaryDark
  },
  productBrandLabel: {
    ...Fonts.style.description,
    color: Colors.gray
  },
  productPhotosContainer: {
    flex: 1
  },
  productThumbWrapper: (isSelected = false) => ({
    width: 100,
    height: 100,
    borderColor: isSelected ? Colors.primaryDark : Colors.gray,
    borderWidth: 2,
    borderRadius: Metrics.baseBorderRadius,
    backgroundColor: Colors.white,
    margin: Metrics.baseMargin,
    overflow: 'hidden'
  }),
  productThumb: {
    width: 100,
    height: 100
  },
  photoCountWrapper: shouldUpdate => ({
    backgroundColor: shouldUpdate ? Colors.yellow : Colors.white,
    borderColor: Colors.gray,
    borderTopWidth: 1,
    paddingVertical: Metrics.basePadding,
    paddingHorizontal: Metrics.basePadding
  }),
  numberOfPhotosText: {
    ...Fonts.style.smallBold,
    marginBottom: Metrics.halfBaseMargin,
    color: Colors.primaryDark
  },
  shouldUpdateText: {
    ...Fonts.style.tiny,
    color: Colors.primaryDark
  }
}
