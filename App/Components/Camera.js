import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { RNCamera } from 'react-native-camera'
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator } from 'react-native'
import _ from 'lodash'
import RNFS from 'react-native-fs'

import Button from './Button'

const RELATIVE_CAMERA_DIR = 'camera'
const CAMERA_DIR = RNFS.DocumentDirectoryPath + '/' + RELATIVE_CAMERA_DIR

const BARCODE_TYPES = [
  RNCamera.Constants.BarCodeType.code128,
  RNCamera.Constants.BarCodeType.code39,
  RNCamera.Constants.BarCodeType.code39mod43,
  RNCamera.Constants.BarCodeType.code93,
  RNCamera.Constants.BarCodeType.ean13,
  RNCamera.Constants.BarCodeType.ean8,
  RNCamera.Constants.BarCodeType.upc_e
]

export default class Camera extends PureComponent {
  static propTypes = {
    autoFocus: PropTypes.bool.isRequired,
    onPicture: PropTypes.func,
    pictureOptions: PropTypes.object.isRequired,
    leftButton: PropTypes.node,
    rightButton: PropTypes.node,
    grid: PropTypes.bool.isRequired,
    wrapperStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    getPictureName: PropTypes.func.isRequired
  }

  static defaultProps = {
    grid: false,
    autoFocus: true,
    tapToFocus: false,
    pictureOptions: {
      quality: 0.85,
      exif: true
    },
    pictureLoading: false,
    getPictureName: _.identity
  }

  state = {
    autoFocus: this.props.autoFocus,
    autoFocusPointOfInterest: null,
    flash: false
  }

  constructor(props) {
    super(props)
    this.initDir()
  }

  initDir = _.once(async () => {
    if (!(await RNFS.exists(CAMERA_DIR))) await RNFS.mkdir(CAMERA_DIR)
  })

  handleTakePicture = async () => {
    this.setState({ pictureLoading: true })
    let data
    try {
      data = await this.cameraRef.takePictureAsync(this.props.pictureOptions)
    } catch (ex) {
      console.error(ex)
    }
    this.setState({ pictureLoading: false })
    if (data) {
      // Turns out the camera photo is stored in a cache folder that might get cleared out
      // So move it asap to something hopefully more stable
      const filename = this.props.getPictureName(data.uri.split('/').pop())
      const relativeUri = RELATIVE_CAMERA_DIR + '/' + filename
      const uri = RNFS.DocumentDirectoryPath + '/' + relativeUri
      // console.log('rnfs path', data.uri, await RNFS.exists(data.uri))
      await RNFS.moveFile(data.uri, uri)
      this.props.onPicture(Object.assign({}, data, { uri, relativeUri }))
    }
  }

  handleCameraPress = ({ nativeEvent: { locationX, locationY } }) => {
    // this does not seem to do anything as of 1.9.0
    return
    this.setState({
      // https://github.com/react-native-community/react-native-camera/blob/master/docs/RNCamera.md#ios-autofocuspointofinterest
      // the values are always based on landscape, with the home on the right
      // so since we always use portrait, x/y are flipped
      autoFocusPointOfInterest: {
        y: 1 - locationX / Metrics.screenWidth,
        x: locationY / (Metrics.screenHeight - Metrics.statusBarHeight)
      }
    })
  }

  handleAutoFocus = () =>
    this.setState({
      autoFocus: !this.state.autoFocus,
      autoFocusPointOfInterest: null
    })

  renderGrid() {
    if (!this.props.grid) return

    return (
      <View style={Styles.gridRoot}>
        <View style={[Styles.gridItem, { left: '33%', bottom: 0 }]} />
        <View style={[Styles.gridItem, { left: '66%', bottom: 0 }]} />
        <View style={[Styles.gridItem, { top: '33%', right: 0 }]} />
        <View style={[Styles.gridItem, { top: '66%', right: 0 }]} />
      </View>
    )
  }

  render() {
    const {
      children,
      onPicture,
      pictureOptions,
      autoFocus: propsAutoFocus,
      leftButton,
      rightButton,
      grid,
      style,
      wrapperStyle,
      ...rest
    } = this.props
    const { autoFocus, autoFocusPointOfInterest, flash, pictureLoading } = this.state

    if (rest.barCodeTypes) {
      console.warn('Camera.barCodeTypes is overwritten. Update the Camera file if you need more/less')
    }

    return (
      <RNCamera
        {...rest}
        barCodeTypes={BARCODE_TYPES}
        ref={(cameraRef) => (this.cameraRef = cameraRef)}
        style={[Styles.root, wrapperStyle]}
        flashMode={RNCamera.Constants.FlashMode[flash ? 'on' : 'off']}
        autoFocus={RNCamera.Constants.AutoFocus[autoFocus ? 'on' : 'off']}
        autoFocusPointOfInterest={autoFocusPointOfInterest}
        forceUpOrientation
        captureAudio={false}
      >
        <TouchableWithoutFeedback onPress={this.handleCameraPress}>
          <View style={[Styles.content, style]}>
            {children}
            {this.renderGrid()}
            {!onPicture || grid ? null : <View style={{ flex: 1 }} />}
            {!onPicture ? null : (
              <View style={Styles.buttons}>
                <View style={Styles.leftColumn}>{leftButton}</View>
                <View style={Styles.centerColumn}>
                  <TouchableOpacity style={[Styles.button]} onPress={pictureLoading ? null : this.handleTakePicture}>
                    {pictureLoading ? (
                      <ActivityIndicator size="large" style={{ marginLeft: 3, marginTop: 3 }} />
                    ) : (
                      <View style={Styles.buttonInnerRing} />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={Styles.rightColumn}>{rightButton}</View>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </RNCamera>
    )
  }
}

import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../Themes'
import { makeVariations } from '../Utils/Styles'

const Styles = StyleSheet.create({
  root: {
    position: 'relative',
    flex: 1,
    alignItems: 'stretch',
    width: Metrics.screenWidth,
    backgroundColor: Colors.transparent
  },
  touchableWrapper: {
    position: 'absolute',
    zIndex: 1,
    top: 50,
    right: 0,
    bottom: 80,
    left: 0,
    backgroundColor: 'red'
  },
  content: {
    position: 'relative',
    zIndex: 2,
    flex: 1,
    alignItems: 'center'
  },
  buttons: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  ...makeVariations(
    [
      'leftColumn',
      {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
      }
    ],
    ['rightColumn', { justifyContent: 'flex-end' }],
    [
      'centerColumn',
      {
        flex: 0,
        justifyContent: 'center',
        marginHorizontal: 10,
        width: 60
      }
    ]
  ),
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonLoading: {
    backgroundColor: Colors.darkGray
  },
  buttonInnerRing: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: Colors.primaryDark,
    borderWidth: 1,
    position: 'absolute'
  },
  gridRoot: {
    position: 'relative',
    flex: 1,
    alignSelf: 'stretch'
  },
  gridItem: {
    flex: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: 'rgba(125, 125, 125, 0.5)',
    minWidth: 1,
    minHeight: 1
  }
})
