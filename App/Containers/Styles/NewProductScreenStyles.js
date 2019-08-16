import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

export default {
  ...ApplicationStyles.screen,
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.lightGray
  },
  accordionHeading: isActive => ({
    height: isActive ? 0 : Metrics.buttonHeight + Metrics.basePadding,
    backgroundColor: Colors.white,
    width: Metrics.screenWidth,
    paddingVertical: isActive ? 0 : Metrics.halfBasePadding,
    borderBottomWidth: isActive ? 0 : 1,
    borderTopWidth: isActive ? 0 : 1,
    borderColor: Colors.gray,
    marginTop: -1,
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden'
  }),
  headingText: {
    ...Fonts.style.smallBold,
    color: Colors.blueGray,
    paddingVertical: Metrics.basePadding,
    marginLeft: Metrics.doubleBaseMargin
  },
  accordionContent: (step, hasBrands = false) => ({
    backgroundColor: Colors.white,
    borderBottomWidth: step === 4 ? 1 : 0,
    borderColor: Colors.gray,
    overflow: 'visible',
    height: step === 2
      ? 275
        : step === 1
          ? 250
          : step === 4
            ? 300
            : 275
  }),
  nextStepButton: {
    marginTop: Metrics.doubleBaseMargin,
    marginBottom: Metrics.tripleBaseMargin,
    alignSelf: 'center'
  },
  contentStepText: {
    ...Fonts.style.smallBold,
    color: Colors.primaryDark,
    marginTop: Metrics.doubleBaseMargin,
    marginLeft: Metrics.doubleBaseMargin
  },
  contentCtaText: {
    ...Fonts.style.bigHeading,
    color: Colors.primaryDark,
    marginVertical: Metrics.baseMargin,
    marginLeft: Metrics.doubleBaseMargin
  },
  contentDescriptionText: {
    ...Fonts.style.small,
    color: Colors.blueGray,
    marginBottom: Metrics.baseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    width: Metrics.screenWidth * 2 / 3,
    lineHeight: Fonts.size.h6
  },
  pillsContent: {
    backgroundColor: Colors.transparent,
    width: Metrics.screenWidth - Metrics.doubleBasePadding,
    flex: 4,
    flexGrow: 1,
    marginTop: Metrics.baseMargin,
    marginBottom: Metrics.doubleBaseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    overflow: 'visible'
  },
  selectedPillsContentWrapper: {
    height: Metrics.buttonHeight + Metrics.doubleBasePadding
  },
  selectedPillsContent: step => ({
    backgroundColor: Colors.transparent,
    flex: step <= 4 ? 4 : 0,
    marginRight: Metrics.doubleBaseMargin,
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: step > 1 ? 'flex-end' : 'flex-start'
  }),
  selectedPill: {
    marginRight: Metrics.baseMargin,
    height: 28,
    alignSelf: 'center'
  },
  selectedPillText: {
    fontSize: Fonts.size.tiny
  },
  categoryPillWrapper: {
    alignItems: 'center'
  },
  pill: {
    marginRight: Metrics.baseMargin,
    alignSelf: 'center',
    marginBottom: Metrics.baseMargin
  },
  photosWrapper: {
    flexDirection: 'row',
    marginLeft: Metrics.doubleBaseMargin
  },
  productThumb: small => ({
    width: small ? 50 : 90,
    height: small ? 50 : 90,
    marginTop: small ? 0 : Metrics.baseMargin,
    marginRight: small ? Metrics.baseMargin : Metrics.doubleBaseMargin,
    borderRadius: Metrics.baseBorderRadius
  }),
  fakeProductThumb: idx => ({
    height: 90,
    width: idx > 1 ? 45 : 90,
    marginTop: Metrics.baseMargin,
    marginRight: Metrics.doubleBaseMargin,
    borderRadius: Metrics.baseBorderRadius
  }),
  nextStepHeading: {
    ...Fonts.style.bigHeading,
    lineHeight: Fonts.size.h2,
    color: Colors.primaryDark,
    marginVertical: Metrics.baseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.tripleBasePadding
  },
  nextStepDescription: {
    ...Fonts.style.small,
    lineHeight: Fonts.size.h4,
    color: Colors.blueGray,
    marginLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBasePadding
  },
  confirmWrapper: {
    height: Metrics.images.logo,
    width: Metrics.screenWidth,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  confirmCopyWrapper: {
    flex: 2,
    alignSelf: 'center'
  },
  happyBag: {
    height: Metrics.images.xlarge,
    width: Metrics.images.xlarge,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: Metrics.tripleBaseMargin,
    flex: 1
  },
  greenCheckmark: {
    width: Metrics.images.tiny,
    height: Metrics.images.tiny,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginHorizontal: Metrics.baseMargin
  },
  brandsWrapper: (hasResults) => ({
    borderRadius: Metrics.baseBorderRadius,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
    overflow: 'visible',
    width: Metrics.screenWidth - Metrics.baseMargin * 4
  }),
  autocompleteContainer: {
  },
  autocompleteInputContainer: {
    borderRadius: Metrics.baseBorderRadius,
    borderColor: Colors.gray,
    borderBottomWidth: 2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  autocompleteListContainer: {
    height: 140
  },
  autocompleteList: (hasResults = false) => ({
    borderRadius: Metrics.baseBorderRadius,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: 'transparent',
    height: hasResults ? 140 : 0,
    borderColor: hasResults ? Colors.gray : Colors.transparent,
    borderWidth: 1,
    borderBottomWidth: 1
  }),
  addBrandWrapper: {
    flexDirection: 'row',
    padding: Metrics.basePadding,
    paddingVertical: Metrics.halfBasePadding
  },
  addBrandResult: {
    ...Fonts.style.mediumBold,
    color: Colors.primary,
    padding: Metrics.basePadding,
    paddingVertical: Metrics.halfBasePadding
  },
  addBrandImage: {
    width: 20,
    height: 20,
    margin: Metrics.baseMargin,
    marginVertical: Metrics.halfBaseMargin
  },
  brandWrapper: {
    padding: Metrics.basePadding,
    borderTopWidth: 1,
    borderColor: Colors.gray,
    paddingVertical: Metrics.halfBasePadding
  },
  brandResult: {
    ...Fonts.style.mediumBold,
    padding: Metrics.basePadding,
    color: Colors.primaryDark
  },
  autocompleteInputText: {
    ...Fonts.style.normal,
    color: Colors.darkGray,
    height: 30
  }
}
