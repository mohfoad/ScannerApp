import { StyleSheet } from 'react-native'
import { Metrics, Colors, Fonts, ApplicationStyles } from '../../Themes/'
import _ from 'lodash'
import { makeVariations } from '../../Utils/Styles'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    alignItems: 'stretch',
    flexGrow: 1
  },
  cameraContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  camera: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: Metrics.screenWidth,
    backgroundColor: Colors.transparent
  },
  manuallyEnterBarcodeButton: {
    marginBottom: Metrics.tripleBaseMargin
  },
  barcodeGuideImage: {
    width: 21,
    height: 21,
    position: 'absolute',
    top: Metrics.screenHeight / 2 - Metrics.barcodeHeight - Metrics.baseMargin,
    marginBottom: Metrics.baseMargin
  },
  barcodeDataText: {
    ...Fonts.style.tinyBold,
    flexGrow: 1,
    padding: Metrics.basePadding,
    color: Colors.white,
    textAlign: 'center',
    position: 'absolute',
    width: 240,
    top: Metrics.screenHeight / 2 - Metrics.barcodeHeight + Metrics.baseMargin
  },
  barcodeFrame: {
    position: 'absolute',
    width: Metrics.barcodeWidth,
    height: Metrics.barcodeHeight,
    borderRadius: Metrics.baseBorderRadius,
    backgroundColor: Colors.transparentGray,
    overflow: 'hidden'
  },
  ...makeVariations(
    [ 'button', {
      width: 80,
      height: 45,
      backgroundColor: Colors.transparentGray,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: Colors.white,
      borderWidth: 1,
      alignSelf: 'flex-end'
      // marginRight: Metrics.tripleBaseMargin,
      // marginBottom: Metrics.doubleBaseMargin,
    } ],
    [ 'accountButton', { width: 77 } ],
    [ 'modeButton_photographer', { borderColor: Colors.blue } ],
    [ 'modeButton_runner', { borderColor: Colors.green } ]
  ),
  ...makeVariations(
    [ 'modeButtonText', {
      ...Fonts.style.smallBold,
      textAlign: 'center',
      color: Colors.white
    } ],
    [ 'modeButtonText_photographer', { color: Colors.blue } ],
    [ 'modeButtonText_runner', { color: Colors.green } ]
  ),
  topActions: {
    position: 'absolute',
    top: Metrics.statusBarHeight + Metrics.baseMargin,
    left: Metrics.baseMargin,
    right: Metrics.baseMargin,
    flexDirection: 'row'
  },
  status: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginHorizontal: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40
  },
  statusText: {
    color: 'white',
    textAlign: 'center'
  }

})
