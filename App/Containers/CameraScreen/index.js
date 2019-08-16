import React from 'react'
import PropTypes from 'prop-types'
import { ScrollView, View, Text, Animated, TouchableOpacity, Keyboard, LayoutAnimation, Image } from 'react-native'
import * as Animatable from 'react-native-animatable'
import ImageViewer from 'react-native-image-zoom-viewer/built/index'
import _ from 'lodash'
import RNFS from 'react-native-fs'

import { Metrics, Images, Colors } from '../../Themes'
import Button from '../../Components/Button'
import { keyboardDidShow, keyboardDidHide } from '../../Lib/ComponentEventHandlers'

import ProgressCircle from 'react-native-progress/Circle'
import Camera from '../../Components/Camera'
import BarcodeVerdict from '../BarcodeVerdict'
import { MODE_ENUM } from '../../Redux/SageRedux'

// Styles
import Styles from '../Styles/CameraScreenStyles'

export default class Index extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      upc: PropTypes.string,
      photos: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.oneOf(['glamor', 'closeup']).isRequired,
          url: PropTypes.string, // legacy prop
          relativeUri: PropTypes.string.isRequired
        })
      )
    }).isRequired,
    updateUpc: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      heightAnimation: new Animated.Value(Metrics.screenHeight - Metrics.statusBarHeight),
      preview: null,
      photoMode: 'glamor',
      showVerdict: true
    }
  }

  componentWillMount() {
    // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
    // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow.bind(this))
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide.bind(this))
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  handleDone = () => {
    const { navigation, updateUpc } = this.props
    updateUpc({ storeStatus: 'done' })
    navigation.goBack()
  }

  handlePhotoMode = () => this.setState({ photoMode: this.state.photoMode === 'glamor' ? 'closeup' : 'glamor' })

  handlePicture = async ({ width, height, uri, relativeUri }) => {
    const { data, updateUpc } = this.props
    const {
      currentPic: { key, type, label }
    } = this.getCurrentPic()
    const photos = _.get(data, ['photos'], [])
    await updateUpc({
      photos: [...photos, { key, type, label, uri, relativeUri, width, height }]
    })
    this.setState({ preview: photos.length })
  }

  getPictureName = (current) => {
    const {
      data: { upc }
    } = this.props
    const {
      currentPic: { key, type }
    } = this.getCurrentPic()

    return `upc_${upc}_${type}_${key}_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, '-')}_${current}`
  }

  getCurrentPic() {
    const {
      data: { payload = {}, photos = [] }
    } = this.props
    const { photoMode } = this.state

    const requirements = [{ key: 'frontPackageGlamor', type: 'glamor', label: 'Front Package' }]

    if (payload.nutritionLabelFormat != null) {
      requirements.push(
        ...[
          { key: 'nutritionGlamor', type: 'glamor', label: 'SIDE 1 - Nutrition Info' },
          { key: 'nutritionCloseup', type: 'closeup', label: 'Nutrition Close-Up' },
          { key: 'ingredientsCloseup', type: 'closeup', label: 'Ingredients Close-Up' }
        ]
      )
    }

    if (payload.isSupplement === true) {
      requirements.push({ key: 'supplementsCloseup', type: 'closeup', label: 'Supplement Facts Close-Up' })
    }

    const counts = {
      glamor: _.filter(photos, { type: 'glamor' }).length,
      closeup: _.filter(photos, { type: 'closeup' }).length
    }
    const currentPic = _.find(requirements, (x) => x.type === photoMode && !_.find(photos, { key: x.key })) || {
      key: `${photoMode}${counts[photoMode]}`,
      type: photoMode,
      label: photoMode === 'glamor' ? `SIDE ${counts.glamor}` : `CLOSE-UP ${counts.closeup + 1}`
    }

    return {
      requirements,
      counts,
      currentPic
    }
  }

  renderPreview() {
    const { data } = this.props
    const { preview } = this.state

    if (preview == null) return null

    const photos = data.photos || []

    return (
      <View style={Styles.preview}>
        <ImageViewer
          index={preview}
          imageUrls={photos.map((x) => ({ ...x, url: x.uri }))}
          style={Styles.previewImage}
          enableSwipeDown
          onSwipeDown={() => this.setState({ preview: null })}
          renderIndicator={(index, total) => {
            const { type, label } = _.get(data, ['photos', index - 1]) || {}
            return (
              <View style={Styles.imageIndicator}>
                <Text style={Styles.title}>
                  {total < 2 ? '' : `[${index} / ${total}]`} {label}
                </Text>
                <Text style={[Styles.subTitle, Styles[`subTitle_${type}`]]}>
                  {type === 'glamor' ? 'Glamor Shot' : 'Close-Up Shot'}
                </Text>
              </View>
            )
          }}
          footerContainerStyle={Styles.imageFooter}
          renderFooter={(index) => [
            <Button
              key={1}
              style={[Styles.doneButton, Styles.retakeButton, { marginBottom: 10 }]}
              textStyle={[Styles.doneButtonText, Styles.retakeButtonText]}
              text="DELETE"
              onPress={() => {
                this.props.updateUpc({ photos: photos.filter((a, i) => i !== index) })
                this.setState({ preview: null })
                RNFS.unlink(photos[index].uri)
              }}
            />,
            <Separator key={2} />,
            <Button
              key={3}
              style={[Styles.doneButton, { marginRight: 20, marginBottom: 10 }]}
              textStyle={Styles.doneButtonText}
              text="OK"
              onPress={() => this.setState({ preview: null })}
            />
          ]}
        />
      </View>
    )
  }

  render() {
    const {
      data: { upc, payload = {}, photos = [] }
    } = this.props
    const { photoMode, showVerdict } = this.state
    const { currentPic, requirements } = this.getCurrentPic()
    const needsCloseups = requirements.some((x) => x.type === 'closeup' && !_.find(photos, { key: x.key }))
    const needsGlamor = requirements.some((x) => x.type === 'glamor' && !_.find(photos, { key: x.key }))

    return (
      <Animated.View style={[{ height: this.state.heightAnimation }, this.state.preview != null && { zIndex: 100 }]}>
        <Animated.View
          contentContainerStyle={Styles.container}
          style={[Styles.container, Styles.cameraContainer, { height: this.state.heightAnimation }]}
        >
          {this.renderPreview()}
          {!photos.length ? null : (
            <TouchableOpacity
              style={Styles.previewPhotosContainer}
              onPress={() => this.setState({ preview: photos.length - 1 })}
            >
              <Image style={Styles.previewPhotos} source={{ uri: photos[photos.length - 1].uri }} resizeMode="cover" />
            </TouchableOpacity>
          )}
          {!showVerdict ? null : (
            <BarcodeVerdict
              noCloseButton
              barcode={upc}
              onClose={() => this.setState({ showVerdict: false })}
              mode={MODE_ENUM.photographer}
              style={{ paddingTop: 50 }}
            />
          )}
          <Camera
            grid
            onPicture={this.handlePicture}
            getPictureName={this.getPictureName}
            leftButton={
              <Button
                style={[Styles.photoMode, photoMode === 'closeup' && Styles.photoMode_closeup]}
                textStyle={[Styles.photoModeText, photoMode === 'closeup' && Styles.photoModeText_closeup]}
                text={photoMode === 'closeup' ? 'Closeup Shot' : 'Glamour Shot'}
                onPress={this.handlePhotoMode}
              />
            }
            rightButton={
              photos.length < 1 ||
              (photoMode === 'glamor' && needsGlamor) ||
              (photoMode === 'closeup' && needsCloseups) ? null : needsCloseups ? (
                <Button
                  style={[Styles.doneButton]}
                  textStyle={[Styles.doneButtonText]}
                  text="Take Closeups"
                  onPress={() => this.setState({ photoMode: 'closeup' })}
                />
              ) : needsGlamor ? (
                <Button
                  style={[Styles.doneButton]}
                  textStyle={[Styles.doneButtonText]}
                  text="Take Glamor"
                  onPress={() => this.setState({ photoMode: 'glamor' })}
                />
              ) : (
                <Button
                  style={Styles.doneButton}
                  textStyle={Styles.doneButtonText}
                  text="DONE"
                  onPress={this.handleDone}
                />
              )
            }
          >
            <View style={Styles[`photoGuideImageWrapper_${photoMode}`]}>
              <TouchableOpacity onPress={() => this.setState({ showVerdict: true })}>
                <Text style={Styles.title_black}>{currentPic.label}</Text>
                <Text style={Styles.subTitle_black}>{photoMode === 'closeup' ? 'Close-Up Shot' : 'Glamour Shot'}</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </Animated.View>
      </Animated.View>
    )
  }
}

const Separator = () => <View style={{ flex: 1 }} />
