import { Metrics, Colors, Fonts, ApplicationStyles } from '../../Themes/'

import { makeVariations } from '../../Utils/Styles'

export default {
  ...ApplicationStyles.screen,
  container: {
    alignItems: 'stretch',
    flexGrow: 1,
    position: 'relative',
    marginTop: -Metrics.statusBarHeight
  },
  cameraContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  doneButton: {
    width: 120,
    height: 45,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0
  },
  doneButtonText: {
    ...Fonts.style.mediumBold,
    textAlign: 'center',
    color: Colors.primaryDark
  },
  photosContentContainer: {
    height: 90,
    position: 'absolute',
    top: 0,
    left: 0,
    width: Metrics.screenWidth,
    backgroundColor: Colors.white,
    flexDirection: 'row'
  },
  photoLabelContainer: {
    paddingHorizontal: Metrics.doubleBasePadding,
    flex: 0.25,
    flexDirection: 'row'
  },
  photoLabel: {
    ...Fonts.style.smallBold,
    color: Colors.primaryDark,
    flex: 1,
    alignSelf: 'center'
  },
  photosContent: {
    backgroundColor: Colors.transparent,
    height: 90,
    width: Metrics.screenWidth,
    flex: 4,
    overflow: 'hidden'
  },
  photosWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  photoData: {
    flexGrow: 1,
    ...Fonts.style.smallBold,
    padding: Metrics.basePadding,
    color: Colors.white
  },
  productThumb: {
    height: 70 - Metrics.baseMargin * 2,
    width: 70 - Metrics.baseMargin * 2,
    marginTop: Metrics.doubleBaseMargin,
    marginRight: Metrics.baseMargin,
    marginLeft: 5,
    borderRadius: Metrics.baseBorderRadius
  },
  fakePreviewWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 70 - Metrics.baseMargin * 2,
    width: 70 - Metrics.baseMargin,
    marginTop: Metrics.doubleBaseMargin + 7
  },
  fakePreview: (isCurrent) => ({
    borderWidth: 1,
    borderRadius: Metrics.baseBorderRadius,
    borderColor: Colors.primaryDark,
    height: 70 - Metrics.baseMargin * 2,
    width: 70 - Metrics.baseMargin * 2,
    borderStyle: isCurrent ? 'solid' : 'dashed',
    marginBottom: Metrics.baseMargin / 2
  }),
  ...makeVariations(
    [
      'title',
      {
        ...Fonts.style.heading,
        textAlign: 'center',
        color: Colors.white
      }
    ],
    ['title_black', { color: Colors.black }]
  ),
  ...makeVariations(
    [
      'subTitle',
      {
        ...Fonts.style.medium,
        textAlign: 'center',
        color: Colors.white
      }
    ],
    ['subTitle_glamor', { color: Colors.green }],
    ['subTitle_closeup', { color: Colors.blue }],
    ['subTitle_black', { color: Colors.black }]
  ),
  ...makeVariations(
    [
      'photoGuideImageWrapper',
      {
        alignSelf: 'stretch',
        alignItems: 'center',
        paddingBottom: Metrics.baseMargin * 1.5,
        paddingTop: Metrics.baseMargin * 3
      }
    ],
    ['photoGuideImageWrapper_glamor', { backgroundColor: Colors.green }],
    ['photoGuideImageWrapper_closeup', { backgroundColor: Colors.lightBlue }]
  ),
  photoGuideImage: {
    width: 42,
    height: 42,
    marginBottom: Metrics.baseMargin
  },
  photoOutlineWrapper: {
    position: 'relative',
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  photoOutlineGuide: {
    flex: 0,
    width: 250,
    height: 250,
    borderColor: Colors.white,
    borderRadius: Metrics.baseBorderRadius,
    borderWidth: 1
    // position: 'absolute',
    // top: Metrics.doubleBaseMargin + Metrics.breadcrumbHeight,
    // left: Metrics.screenWidth / 2 - 125
  },
  bottomGuideText: {
    ...Fonts.style.small,
    position: 'absolute',
    top: '100%',
    left: (Metrics.screenWidth - 280) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: 280,
    marginTop: Metrics.baseMargin,
    color: Colors.white
  },
  preview: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    backgroundColor: 'transparent'
  },
  previewImage: {
    alignSelf: 'stretch',
    flex: 1
  },
  imageIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingVertical: Metrics.baseMargin
  },
  imageFooter: {
    left: Metrics.doubleBaseMargin,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  retakeButton: {
    backgroundColor: Colors.red
  },
  retakeButtonText: {
    color: Colors.white
  },
  photoMode: {
    backgroundColor: Colors.green,
    borderWidth: 2,
    width: 120,
    height: 45,
    marginBottom: 0
  },
  photoModeText: {
    ...Fonts.style.mediumBold,
    color: Colors.black
  },
  photoMode_closeup: {
    backgroundColor: Colors.lightBlue
  },
  doneButton_closeup: {
    backgroundColor: Colors.blue
  },
  doneButton_glamor: {
    backgroundColor: Colors.green
  },
  doneButtonText_glamor: {
    color: Colors.black
  },
  previewPhotosContainer: {
    position: 'absolute',
    top: Metrics.baseMargin * 1.5,
    right: Metrics.baseMargin,
    zIndex: 1,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    backgroundColor: Colors.border,
    width: 42,
    height: 42,
    overflow: 'hidden'
  },
  previewPhotos: {
    width: 40,
    height: 40
  }
}
