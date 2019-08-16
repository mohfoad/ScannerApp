import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
    View,
    Text,
    Modal,
    PanResponder,
    Easing,
    TouchableOpacity,
    Animated,
    // LayoutAnimation,
    ScrollView,
    Image as ReactNativeImage,
    AlertIOS
} from 'react-native'

import { get as _get } from 'lodash'
import { pathOr } from 'ramda'
import Styles from './styles'
import Button from '../Button'
import ApplicationActions from '../../Redux/ApplicationRedux'
import SageActions from '../../Redux/SageRedux'

import { createImageProgress } from 'react-native-image-progress'
import ProgressCircle from 'react-native-progress/Circle'

import { Metrics, Images, Colors } from '../../Themes'
import * as Animatable from 'react-native-animatable'

import { RNCamera } from 'react-native-camera'

// show a default image if image is loaded fail
const fetchImageFailedUrl = 'https://sageproject.com/dist/e4d578d96808edacfeb19b6dc814b4d5.png'
const previewTitles = ['HERO: FRONT', 'SIDE 1', 'SIDE 2', 'SIDE 3']

const ProgressImage = createImageProgress(Animatable.Image)
const progressIndicatorProps = {
    size: 40,
    indeterminate: true,
    color: Colors.secondary,
    borderWidth: 4
}

const smallProgressIndicatorProps = {
    size: 10,
    indeterminate: true,
    color: Colors.secondary,
    borderWidth: 1
}

class Lightbox extends Component {
    constructor (props) {
        super(props)

        this.state = {
            curIndex: 0,
            midIndex: 0,
            maxIndex: 0,
            imagesInfo: [],
            imageLoaded: false, // whether image loaded fail or success, it'll be true
            loadedImages: {},
            // Animated of view
            fadeAnim: new Animated.Value(0), // opacity for container
            scalable: new Animated.Value(1) // scale for container
        }

        // image gesture responder
        this.imagePanResponder = null

        // whether is click
        this.isClick = true

        // last click time
        this.lastClickTime = 0

        // timer for click
        this.clickTimer = null

        // the benchmark position of moveBox
        this.standardPositionX = 0

        // the position of moveBox,for toggle image
        this.positionX = 0
        this.animatedPositionX = new Animated.Value(0)

        // scale the image for double click
        this.imgScale = 1

        // the whole offset of drag when scale
        this.horizontalWholeCounter = 0

        // the max offset of drag
        this.maxOffsetX = 0

        // layout info of image
        this.layoutImage = {}

        // whether reached the drag border when drag the image
        this.isReachedBorder = false

        // pinch for zoom image
        this.zoomCurrentDistance = 0
        this.zoomLastDistance = undefined
    }

    handleCloseClick = () => {
        this.clickTimer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(this.state.fadeAnim, {
                    toValue: 0,
                    duration: 250,
                    easing: Easing.spring
                }),
                Animated.timing(this.state.scalable, {
                    toValue: 1, // set to 0 for scale down effect
                    duration: 250,
                    easing: Easing.spring
                })
            ]).start(() => {
                this.setState({
                    isRetaking: false,
                    loadImgSuccess: false
                })
                this.props.onClose()
            })
        }, 200)
    }

    componentWillMount () {
        this.imagePanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true, // to trigger multiple touches, this method should return false
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onPanResponderGrant: (evt, gestureState) => {
                this.zoomLastDistance = undefined
                if (evt.nativeEvent.changedTouches.length <= 1) {
                    // single touch
                    this.isClick = true
                } else {
                    // multiple touches
                    this.isClick = false
                    this.lastClickTime = 0
                }
            },
            onPanResponderMove: (evt, gestureState) => {
                let touches = evt.nativeEvent.changedTouches
                let curIndex = this.state.curIndex
                let imageInfo = this.state.imagesInfo[curIndex]

                if (touches.length <= 1) {
                    // reset the value of lastClickTime
                    if (this.isClick) {
                        this.isClick = false
                        this.lastClickTime = 0
                    }

                    if (this.imgScale === 3.0) {
                        let { width } = this.layoutImage[curIndex]
                        this.maxOffsetX = Math.ceil((width * 0.5) / 2 - 30)

                        let x = gestureState.dx + this.horizontalWholeCounter
                        this.isReachedBorder = false

                        if (x >= this.maxOffsetX && gestureState.dx > 0) {
                            // drag left
                            this.isReachedBorder = true
                            x = this.maxOffsetX
                        }

                        if (x <= -this.maxOffsetX && gestureState.dx < 0) {
                            // drag right
                            this.isReachedBorder = true
                            x = -this.maxOffsetX
                        }

                        !this.isReachedBorder && imageInfo.animatedX.setValue(x)

                        if (this.isReachedBorder) {
                            // offset the moveBox
                            this.positionX = gestureState.dx + this.standardPositionX
                            this.animatedPositionX.setValue(this.positionX)
                        }
                    } else {
                        // offset the moveBox
                        this.positionX = gestureState.dx + this.standardPositionX
                        this.animatedPositionX.setValue(this.positionX)
                    }
                } else {
                    let minX, maxX
                    let minY, maxY

                    if (touches[0].locationX > touches[1].locationX) {
                        minX = touches[1].pageX
                        maxX = touches[0].pageX
                    } else {
                        minX = touches[0].pageX
                        maxX = touches[1].pageX
                    }

                    if (touches[0].locationY > touches[1].locationY) {
                        minY = touches[1].pageY
                        maxY = touches[0].pageY
                    } else {
                        minY = touches[0].pageY
                        maxY = touches[1].pageY
                    }

                    const widthDistance = maxX - minX
                    const heightDistance = maxY - minY
                    const diagonalDistance = Math.sqrt(widthDistance * widthDistance + heightDistance * heightDistance)
                    this.zoomCurrentDistance = Number(diagonalDistance.toFixed(1))

                    if (this.zoomLastDistance !== undefined) {
                        let distanceDiff = (this.zoomCurrentDistance - this.zoomLastDistance) / 200
                        let zoom = this.imgScale + distanceDiff

                        // ZOOM BOUNDS SETTINGS
                        if (zoom < 1) {
                            zoom = 1
                        }
                        if (zoom > 3.0) {
                            zoom = 3.0
                        }

                        this.imgScale = zoom
                        imageInfo.scalable.setValue(this.imgScale)
                    }
                    this.zoomLastDistance = this.zoomCurrentDistance
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (evt.nativeEvent.changedTouches.length <= 1) {
                    if (this.isClick) {
                        if (this.lastClickTime && new Date().getTime() - this.lastClickTime < 300) {
                            clearTimeout(this.clickTimer)
                            let curIndex = this.state.curIndex
                            let imageInfo = this.state.imagesInfo[curIndex]

                            if (this.imgScale === 1) {
                                this.imgScale = 3.0
                            } else {
                                this.imgScale = 1
                                imageInfo.animatedX.setValue(0)
                            }

                            Animated.timing(imageInfo.scalable, {
                                toValue: this.imgScale,
                                duration: 250
                            }).start(() => {
                                this.horizontalWholeCounter = 0
                                this.maxOffsetX = 0
                                this.isReachedBorder = false
                            })

                            this.lastClickTime = 0
                            return
                        }
                        this.lastClickTime = new Date().getTime()
                    }

                    if (this.imgScale === 3.0) {
                        if (!this.isReachedBorder) {
                            this.horizontalWholeCounter += gestureState.dx
                            return
                        }
                    }

                    // left slide
                    if (gestureState.dx < -100) {
                        this.next(this.state.curIndex)
                    } else {
                        this.resetPosition()
                    }

                    // right slide
                    if (gestureState.dx > 100) {
                        this.prev(this.state.curIndex)
                    } else {
                        this.resetPosition()
                    }
                } else {
                    console.log('multiple touches')
                }
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // another component has become the responder, current gesture will be cancelled
            }
        })
    }

    componentDidMount () {
        if (this.props.shown) {
            // initial state data
            this.init(this.props)
        }
    }

    componentWillReceiveProps (nextProps) {
        if (!this.props.shown && nextProps.shown) {
            // initial state data
            this.init(nextProps)
        }
    }

    handleRetakePress = () => {
        this.setState({ isRetaking: true })
    }

    handleDeletePress = () => {
        AlertIOS.alert('Confirm Deletion', 'Are you sure you want to delete this photo?', [
            {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => console.log('Cancel Pressed')
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    const { photos, setApplicationData } = this.props
                    const { imagesInfo, curIndex } = this.state
                    const newPhotos = photos.slice(0, curIndex).concat(photos.slice(curIndex + 1))
                    const newImagesInfo = imagesInfo.slice(0, curIndex).concat(imagesInfo.slice(curIndex + 1))
                    const newCurIndex = curIndex >= newImagesInfo.length ? newImagesInfo.length - 1 : curIndex

                    this.setState(
                        {
                            imagesInfo: newImagesInfo,
                            curIndex: newCurIndex
                        },
                        () => {
                            setApplicationData('photos', newPhotos)
                        }
                    )
                }
            }
        ])
    }

    handleCancelPress = () => {
        this.setState({ isRetaking: false }, this.handleCloseClick)
    }

    /**
     * render image list for preview
     */
    getImageList () {
        const { imageUrls } = this.props

        const ImageLists = imageUrls.map((imageUrl, index) => {
            const imageInfo = this.state.imagesInfo[index]

            let width = imageInfo && imageInfo.width
            let height = imageInfo && imageInfo.height
            let scalable = imageInfo && imageInfo.scalable
            let animatedX = imageInfo && imageInfo.animatedX

            // zoom the image if image is too large
            if (width > Metrics.screenWidth) {
                const widthPixel = Metrics.screenWidth / width
                width *= widthPixel
                height *= widthPixel
            }

            if (height > Metrics.screenHeight) {
                const HeightPixel = Metrics.screenHeight / height
                width *= HeightPixel
                height *= HeightPixel
            }

            height += Metrics.breadcrumbHeight

            if (_get(imageInfo, 'status', false)) {
                switch (imageInfo.status) {
                    case 'loading':
                    case 'success':
                        return (
                            <Animatable.View
                                style={[Styles.loadedImg, { opacity: pathOr(false, [index], this.state.loadedImages) ? 1 : 1 }]}
                                key={index}
                                transition={'opacity'}
                            >
                                <Animated.View
                                    style={{
                                        width: width,
                                        height: height,
                                        transform: [{ scale: scalable }, { translateX: animatedX }]
                                    }}
                                >
                                    <ProgressImage
                                        indicator={ProgressCircle}
                                        indicatorProps={progressIndicatorProps}
                                        threshold={200}
                                        onLoad={(e) => {
                                            this.setState(
                                                {
                                                    loadedImages: {
                                                        ...this.state.loadedImages,
                                                        ...{
                                                            [index]: true
                                                        }
                                                    }
                                                },
                                                () => {
                                                    console.log(this.state.loadedImages)
                                                }
                                            )
                                        }}
                                        onLayout={(e) => {
                                            this.layoutImage[index] = e.nativeEvent.layout
                                        }}
                                        style={{ width: width, height: height }}
                                        source={{ uri: imageUrl }}
                                        animation={'fadeIn'}
                                        duration={600}
                                        resizeMode='contain'
                                    />
                                </Animated.View>
                            </Animatable.View>
                        )
                    case 'fail':
                        return (
                            <View style={Styles.failedImg} key={index}>
                                <Animatable.Image
                                    style={Styles.failedImg}
                                    source={{ uri: this.props.failedUrl ? this.props.failedUrl : fetchImageFailedUrl }}
                                    animation={'fadeIn'}
                                    useNativeDriver
                                    duration={1000}
                                />
                            </View>
                        )
                }
            } else {
                return null
            }
        })

        return ImageLists
    }

    renderPhotos = () => {
        const { imageUrls } = this.props

        return (
            <Animated.View
                style={[
                    Styles.container,
                    {
                        opacity: this.state.fadeAnim,
                        transform: [{ scale: this.state.scalable }]
                    }
                ]}
                {...this.imagePanResponder.panHandlers}
            >
                <Animated.View
                    style={[
                        Styles.moveBox,
                        {
                            width: imageUrls.length * Metrics.screenWidth,
                            transform: [{ translateX: this.animatedPositionX }]
                        }
                    ]}
                >
                    {this.state.imagesInfo.length > 0 ? this.getImageList() : null}
                </Animated.View>
            </Animated.View>
        )
    }

    renderPhotoPreview = (imagePath, key, idx = 1) => {
        return (
            <TouchableOpacity
                key={key}
                onPress={() => {
                    if (this.state.curIndex !== idx) {
                        if (this.state.curIndex < idx) {
                            this.standardPositionX -= Metrics.screenWidth
                        } else {
                            this.standardPositionX += Metrics.screenWidth
                        }
                        this.state.imagesInfo[idx].scalable.setValue(1)
                        this.state.imagesInfo[idx].animatedX.setValue(0)
                        this.setState({ curIndex: idx, imageLoaded: false }, this.callback)
                    }
                }}
            >
                <ProgressImage
                    indicator={ProgressCircle}
                    indicatorProps={smallProgressIndicatorProps}
                    threshold={200}
                    animation={'bounceIn'}
                    duration={600}
                    source={{ uri: imagePath }}
                    style={Styles.productThumb}
                    resizeMode='cover'
                />
            </TouchableOpacity>
        )
    }

    renderCameraPhotos = () => {
        const { photos } = this.props
        const renderedPhotos = photos.map((imagePath, idx) =>
            this.renderPhotoPreview(imagePath, `capturedImage${idx}`, idx)
        )

        return <View style={Styles.photosWrapper}>{renderedPhotos}</View>
    }

    renderCamera = () => {
        const { photos } = this.props

        const { isRetaking, curIndex } = this.state

        return (
            <Animatable.View
                transition={['opacity', 'top']}
                style={[
                    {
                        position: 'absolute',
                        height: Metrics.screenHeight - Metrics.breadcrumbHeight,
                        opacity: 1, // isRetaking ? 1 : 0,
                        top: isRetaking ? Metrics.breadcrumbHeight : Metrics.screenHeight
                    }
                ]}
                duration={600}
            >
                <RNCamera
                    ref={(cam) => {
                        this.retakeCamera = cam
                    }}
                    style={[Styles.camera]}
                    aspect={Camera.constants.Aspect.fill}
                    captureTarget={Camera.constants.CaptureTarget.disk}
                    forceUpOrientation
                    onFocusChanged={(nativeEvent) => {
                        console.log(nativeEvent)
                    }}
                >
                    <View pointerEvents={`none`} style={Styles.photoGuideImageWrapper}>
                        <Animatable.Image
                            animation={'fadeIn'}
                            duration={300}
                            source={Images.photoGuide}
                            style={Styles.photoGuideImage}
                            resizeMode='cover'
                        />
                        <Text style={Styles.fakePreviewTinyText}>
                            {curIndex < 3 ? `RETAKING ${previewTitles[curIndex]}` : `RETAKING SIDE ${curIndex + 1}`}
                        </Text>
                    </View>
                    <View style={Styles.photosContentContainer}>
                        <View style={Styles.photoLabelContainer}>
                            <Text style={Styles.photoLabel}>PHOTOS</Text>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={Styles.photosContent}
                            contentContainerStyle={Styles.photosContentContainer}
                        >
                            {this.renderCameraPhotos()}
                        </ScrollView>
                    </View>
                    <View pointerEvents={`none`} style={Styles.photoOutlineGuide} />
                    <Text pointerEvents={`none`} style={Styles.bottomGuideText}>
                        {photos.length === 0
                            ? 'Line up the product in center of the guiding lines, front-of-package forward (hero shot!)'
                            : 'Line up the product in center of the guiding lines. Photograph every side until all info is captured.'}
                    </Text>
                    <View style={Styles.buttonWrapper}>
                        <Button style={Styles.captureButton} onPress={this.retakePicture}>
                            <View style={Styles.captureButtonInnerRing} />
                        </Button>
                        <Animatable.View duration={300} transition={['opacity']}>
                            <Button
                                style={Styles.cancelButton}
                                textStyle={Styles.cancelButtonText}
                                text={'EXIT'}
                                onPress={this.handleCancelPress}
                            />
                        </Animatable.View>
                    </View>
                </RNCamera>
            </Animatable.View>
        )
    }

    retakePicture = () => {
        const options = {}
        this.retakeCamera
            .capture({
                metadata: options
            })
            .then((response) => {
                const { photos, setApplicationData, uploadMedia, populateAlert } = this.props

                const { curIndex } = this.state
                const newPhotos = photos.slice(0, curIndex).concat([response.path, ...photos.slice(curIndex + 1)])
                // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
                setApplicationData('photos', newPhotos)
                uploadMedia(response.path)
                if (populateAlert) {
                    populateAlert(`Photo retaken successfully`)
                }
            })
            .catch((err) => console.error(err))
    }

    renderBottomButtons = () => {
        const { hasDelete } = this.props

        const { isRetaking, fadeAnim } = this.state

        return (
            <Animated.View style={{ opacity: fadeAnim }}>
                {hasDelete ? (
                    <Animatable.View
                        key='retakeButton'
                        transition={['opacity', 'translateX']}
                        duration={600}
                        style={[
                            {
                                opacity: isRetaking ? 0 : 1,
                                transform: [{ translateX: isRetaking ? -300 : 0 }]
                            }
                        ]}
                    >
                        <Button
                            style={Styles.retakeButton}
                            textStyle={Styles.retakeButtonText}
                            text={'RETAKE'}
                            onPress={this.handleRetakePress}
                        />
                    </Animatable.View>
                ) : null}
                {hasDelete ? (
                    <Animatable.View
                        key='deleteButton'
                        transition={['opacity', 'translateX']}
                        duration={600}
                        style={[
                            {
                                opacity: isRetaking ? 0 : 1,
                                transform: [{ translateX: isRetaking ? 300 : 0 }]
                            }
                        ]}
                    >
                        <Button
                            style={Styles.deleteButton}
                            textStyle={Styles.deleteButtonText}
                            text={'DELETE'}
                            onPress={this.handleDeletePress}
                        />
                    </Animatable.View>
                ) : null}
            </Animated.View>
        )
    }

    render () {
        const { shown, imageUrls } = this.props

        const titleCopy = imageUrls.length > 0 ? `${this.state.curIndex + 1} / ${imageUrls.length}` : ``

        return (
            <Modal visible={shown} transparent animationType={'none'} onRequestClose={this.modalDismissed.bind(this)}>
                <Animated.View
                    style={[
                        Styles.titleBar,
                        {
                            opacity: this.state.fadeAnim
                        }
                    ]}
                >
                    <View style={Styles.leftSpacer} />
                    <View style={Styles.titleWrapper}>
                        <Text style={Styles.title}>{titleCopy}</Text>
                    </View>
                    <View style={Styles.closeButton}>
                        <TouchableOpacity onPress={this.handleCloseClick} style={Styles.leftRightButton}>
                            <Animatable.Image animation={'fadeIn'} duration={200} source={Images.close} style={Styles.close} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                {this.renderPhotos()}
                {this.renderCamera()}
                {this.renderBottomButtons()}
            </Modal>
        )
    }

    componentWillUnmount () {
        this.imagePanResponder = null
        this.clickTimer = null
        this.lastClickTime = undefined
        this.isClick = undefined

        this.standardPositionX = undefined
        this.animatedPositionX = null
        this.positionX = undefined

        this.imgScale = undefined
        this.horizontalWholeCounter = undefined
        this.maxOffsetX = undefined
        this.layoutImage = null
        this.isReachedBorder = undefined

        this.zoomCurrentDistance = undefined
        this.zoomLastDistance = undefined
    }

    /**
     * init data
     * @param props
     */
    init (props) {
        let { index, imageUrls, loadingOverride } = props
        let len = imageUrls.length
        let temp = []
        const adjustedIndex = Math.min(index, len - 1)
        console.log('init calle')

        imageUrls.forEach((url) => {
            temp.push({
                width: Metrics.screenWidth,
                height: Metrics.screenHeight - Metrics.breadcrumbHeight,
                status: loadingOverride || 'loading',
                url: url,
                scalable: new Animated.Value(1),
                animatedX: new Animated.Value(0)
            })
        })

        // reset
        this.layoutImage = {}

        this.setState(
            {
                curIndex: adjustedIndex,
                maxIndex: len - 1,
                midIndex: Math.floor((len - 1) / 2),
                imagesInfo: temp,
                imageLoaded: false,
                loadedImages: {}
            },
            () => {
                // fetch current image
                this.fetchImage(adjustedIndex)

                // show current image of position
                let offset = this.state.midIndex - this.state.curIndex
                this.positionX = offset * Metrics.screenWidth
                this.standardPositionX = len % 2 === 0 ? this.positionX + Metrics.screenWidth / 2 : this.positionX
                this.animatedPositionX.setValue(this.standardPositionX)

                Animated.parallel([
                    Animated.timing(this.state.fadeAnim, {
                        toValue: 1,
                        duration: 250,
                        easing: Easing.spring
                    }),
                    Animated.timing(this.state.scalable, {
                        toValue: 1,
                        duration: 250,
                        easing: Easing.spring
                    })
                ]).start(() => {
                    this.imgScale = 1
                })
            }
        )
    }

    /**
     * update imageInfo of state
     * @param index
     * @param imageInfo
     */
    updateImageInfo (index, imageInfo) {
        let imagesInfo = this.state.imagesInfo.slice()
        imagesInfo[index] = imageInfo
        this.setState({
            imagesInfo: imagesInfo,
            imageLoaded: true
        })
    }

    /**
     * fetch image from url
     * @param index current index of image
     */
    fetchImage (index) {
        if (this.state.imagesInfo.length === 0) {
            this.handleCloseClick()
            return
        }

        if (this.state.imagesInfo[index].status === 'success') {
            // already loaded
            this.setState({
                imageLoaded: true
            })
            return
        }

        const imageInfo = Object.assign({}, this.state.imagesInfo[index])
        const prefetchImagePromise = ReactNativeImage.prefetch(imageInfo.url)

        prefetchImagePromise.then(
            () => {
                ReactNativeImage.getSize(
                    imageInfo.url,
                    (width, height) => {
                        imageInfo.width = width
                        imageInfo.height = height
                        imageInfo.status = 'success'

                        this.updateImageInfo(index, imageInfo)
                    },
                    (error) => {
                        imageInfo.status = 'fail'
                        this.updateImageInfo(index, imageInfo)
                        console.log(error)
                    }
                )
            },
            () => {
                imageInfo.status = 'fail'
                this.updateImageInfo(index, imageInfo)
            }
        )
    }

    /**
     * reset the position of moveBox
     */
    resetPosition () {
        Animated.timing(this.animatedPositionX, {
            toValue: this.standardPositionX,
            duration: 250,
            easing: Easing.spring
        }).start(() => {
            this.positionX = this.standardPositionX
        })
    }

    /**
     * show next image
     * @param curIndex  current index of image's url in imageUrls
     */
    next (curIndex) {
        let url = this.props.imageUrls[curIndex + 1]

        if (url) {
            this.standardPositionX -= Metrics.screenWidth
            this.state.imagesInfo[curIndex].scalable.setValue(1)
            this.state.imagesInfo[curIndex].animatedX.setValue(0)
            this.setState(
                {
                    curIndex: curIndex + 1,
                    imageLoaded: false
                },
                this.callback
            )
        }
    }

    /**
     * show prev images
     * @param curIndex  current index of image's url in imageUrls
     */
    prev (curIndex) {
        let url = this.props.imageUrls[curIndex - 1]

        if (url) {
            this.standardPositionX += Metrics.screenWidth
            this.state.imagesInfo[curIndex].scalable.setValue(1)
            this.state.imagesInfo[curIndex].animatedX.setValue(0)
            this.setState(
                {
                    curIndex: curIndex - 1,
                    imageLoaded: false
                },
                this.callback
            )
        }
    }

    /**
     * the callback for state updated when toggle image
     */
    callback () {
        this.imgScale = 1
        this.horizontalWholeCounter = 0
        this.maxOffsetX = 0
        this.isReachedBorder = false
        this.fetchImage(this.state.curIndex)
        this.resetPosition()
    }

    /**
     * this callback is required for android
     * it's invoked when modal dismissed
     */
    modalDismissed () {}
}

Lightbox.propTypes = {
    shown: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    imageUrls: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    failedUrl: PropTypes.string,
    loadingOverride: PropTypes.string,
    hasDelete: PropTypes.bool
}

Lightbox.defaultProps = {
    hasDelete: false
}

const mapStateToProps = (state) => ({
    photos: pathOr([], ['photos'], state.application.data),
    uploadedRemoteMedia: pathOr([], ['uploadedRemoteMedia'], state.application.data)
})

const mapDispatchToProps = (dispatch) => ({
    uploadMedia: (file) => dispatch(SageActions.uploadMediaRequest(file)),
    setApplicationData: (key, value) => dispatch(ApplicationActions.applicationDataSetRequest(key, value))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lightbox)
