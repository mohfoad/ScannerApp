import React from 'react'
import PropTypes from 'prop-types'
import {Animated, Keyboard, View, Text, ScrollView, TouchableOpacity, AsyncStorage} from 'react-native'
import {isEmpty, pathOr} from 'ramda'

import {withNavigationFocus} from 'react-navigation-is-focused-hoc'
import {connect} from 'react-redux'
import _, {get as _get} from 'lodash'
import * as Animatable from 'react-native-animatable'

import {Metrics, Images, Colors} from '../../Themes'
import {keyboardDidShow, keyboardDidHide} from '../../Lib/ComponentEventHandlers'
import Button from '../../Components/Button'
import BarcodeModal from '../../Modals/BarcodeModal'
import SageActions, {MODE_ENUM} from '../../Redux/SageRedux'
import BarcodeVerdict from '../BarcodeVerdict'
import Stats from '../Stats'
import Camera from '../../Components/Camera'
import UpcUtils from '../../Utils/UpcUtils'

// React Apollo
import {graphql} from 'react-apollo/index'
import gql from 'graphql-tag'
import {compose, withPropsOnChange, withState} from 'recompose'
import * as sharedQueries from '../../GraphQL/Shared/queries'
import withData from '../../Decorators/withData'
import getBarcodeWithDefaults from '../../Utils/getBarcodeWithDefaults'

// Styles
import Styles from '../Styles/ScannerScreenStyles'
import {RNCamera} from 'react-native-camera'
import {withAuth, withCreateAccount, withLogin} from '../../GraphQL/Account/decorators'
import withApollo from '../../Decorators/withApollo';

const barcodeFrameBounds = {
    width: Metrics.barcodeWidth,
    height: Metrics.barcodeHeight,
    left: Metrics.screenWidth / 2 - Metrics.barcodeWidth / 2,
    top: Metrics.screenHeight / 2 - Metrics.barcodeHeight / 2
}

const baseBarcodeFrameOffset = Metrics.screenHeight / 2 - Metrics.barcodeHeight / 2

class Index extends React.Component {
    static propTypes = {
        mode: PropTypes.string.isRequired,
        setMode: PropTypes.func.isRequired,
        setBarcode: PropTypes.func.isRequired,
        tag: PropTypes.string,
        data: PropTypes.shape({
            result: PropTypes.object,
            loading: PropTypes.bool.isRequired
        }).isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            visibleHeight: Metrics.screenHeight,
            modalVisible: false,
            slideAnimation: new Animated.Value(barcodeFrameBounds.top),
            heightAnimation: new Animated.Value(Metrics.screenHeight),
            opacityAnimation: new Animated.Value(0),
            possibleUpcs: [],
            barcodeCounter: 0,
            nextBarcode: null
        }
    }

    componentWillMount() {
        // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
        // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow.bind(this))
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide.bind(this))
    }

    async componentDidMount() {
        Animated.timing(this.state.slideAnimation, {
            duration: 250,
            toValue: this.state.visibleHeight / 2 - Metrics.barcodeHeight / 2
        }).start();
    }

    animateBarcodeFrame = () => {
        Animated.parallel([
            Animated.timing(this.state.heightAnimation, {
                duration: 250,
                toValue: this.getContainerHeight()
            }),
            Animated.timing(this.state.slideAnimation, {
                duration: 250,
                toValue: this.getBarcodeFrameOffset()
            })
        ]).start()
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
        this.setState({modalVisible: false})
    }

    componentWillReceiveProps({barcode, mode, isFocused}) {
        if (barcode && barcode !== this.props.barcode) {
            if (mode === MODE_ENUM.runner) {
            } else if (mode === MODE_ENUM.photographer) {
            }
        }
        if (this.props.isFocused !== true && isFocused === true) {
            this.setBarcodeWithDefaults(null)
            this.props.unblockNavigation()
        } else if (this.props.isFocused === true && isFocused !== true) {
            this.setState({modalVisible: false})
        }
    }

    setBarcodeWithDefaults(barcode) {
        const {setBarcode, data} = this.props
        // const { format, standard } = UpcUtils.standardize(barcode)
        // console.log('setting code: og and new one:', barcode, standard, format)
        setBarcode(getBarcodeWithDefaults(data, barcode))
    }

    handlePressEnterBarcodeManually = () => {
        this.setState(
            {
                modalVisible: true
            },
            this.animateBarcodeFrame
        )
    }

    handleBarCodeRead = ({data, type}) => {
        const {mode} = this.props
        Animated.timing(this.state.opacityAnimation, {
            duration: 250,
            toValue: 1
        }).start()

        this.setState({modalVisible: false}, this.animateBarcodeFrame)
        const {standard} = UpcUtils.standardize(data)

        this.setBarcodeWithDefaults(standard)
        if (mode === MODE_ENUM.photographer) {
            this.navigate('Index', {transition: 'slideInTransition'})
        }
    }

    handleBarCodeReadThrottled = _.throttle(this.handleBarCodeRead, 1000)

    navigate(...args) {
        if (this._navigationBlocked) return
        this.blockNavigation(1200)
        this.props.navigation.navigate(...args)
    }

    blockNavigation = (time) => {
        if (this._navigationBlocked) return
        this._navigationBlocked = true
        setTimeout(() => {
            delete this._navigationBlocked
        }, time)
    }

    handleAccount = () => {
        this.navigate('SettingsScreen', {transition: 'slideInTopTransition'})
    }

    handleChecklist = () => this.navigate('ChecklistScreen', {transition: 'slideInTopTransition'})

    handleSync = () => this.navigate('SyncScreen', {transition: 'slideInTopTransition'})

    getModalOffset = () => (this.state.modalVisible ? Metrics.modalHeight : 0)
    getBarcodeFrameOffset = () => baseBarcodeFrameOffset - this.getModalOffset() / 2
    getContainerHeight = () =>
        (this.state.modalVisible ? this.state.visibleHeight : Metrics.screenHeight) - this.getModalOffset()

    handleModeToggle = () =>
        this.props.setMode(this.props.mode === MODE_ENUM.photographer ? MODE_ENUM.runner : MODE_ENUM.photographer)

    isBarcodeDone = (barcode) => {
        const doneUpcs = pathOr([], ['data', 'result', 'doneUPCs'], this.props)
        return doneUpcs.includes(barcode)
    }

    render() {
        const {mode, barcode, data, navigation} = this.props
        const isBarcodeDone = this.isBarcodeDone(barcode)
        return (
            <Animatable.View style={{height: this.state.heightAnimation}}>
                {!barcode || mode !== MODE_ENUM.runner ? null : (
                    <BarcodeVerdict
                        doneOverride={isBarcodeDone}
                        barcode={barcode}
                        onClose={() => this.setBarcodeWithDefaults(null)}
                    />
                )}

                <BarcodeModal
                    barcode={this.state.nextBarcode}
                    visible={this.state.modalVisible}
                    barcodeCounter={this.state.barcodeCounter}
                    handleChangeBarcodeFromParent={(barcodeData) => {
                        if (barcodeData) {
                            const barcode = '' + barcodeData;
                            const possibleAllUpcs = pathOr({}, ['data', 'result', 'upc'], this.props)
                            const doneUpcs = pathOr([], ['data', 'result', 'doneUPCs'], this.props)
                            const possibleUpcs = _.uniqBy(
                                Object.values(possibleAllUpcs)
                                    .concat(doneUpcs.map(upc => ({upc, storeStatus: 'done'}))),
                                'upc'
                            )
                                .map(x => ({
                                    ...x,
                                    index: x.upc.indexOf(barcode),
                                }))
                                .filter(x => x.index >= 0)
                                .sort((a, b) =>
                                    a.storeStatus === b.storeStatus
                                        ? a.index !== b.index
                                        ? a.index - b.index
                                        : parseInt(a) - parseInt(b)
                                        : a.storeStatus === 'pending'
                                        ? -1
                                        : b.storeStatus === 'pending'
                                            ? 1
                                            : 0
                                )
                                .slice(0, 20)
                                .map(obj => {
                                    const index = obj.upc.indexOf(barcode)
                                    return {
                                        ...obj,
                                        parts: [
                                            obj.upc.slice(0, index),
                                            obj.upc.slice(index, index + barcode.length),
                                            obj.upc.slice(index + barcode.length + 1),
                                        ],
                                    };
                                });

                            this.setState(
                                {possibleUpcs},
                                () => this.setBarcodeWithDefaults(barcodeData)
                            )
                        }
                    }}
                    handleCloseFromParent={(barcodeData) => {
                        this.setState(
                            {
                                modalVisible: false,
                                possibleUpcs: []
                            },
                            () => {
                                this.setState({visibleHeight: Metrics.screenHeight}, () => this.animateBarcodeFrame())
                                if (barcodeData) {
                                    this.setBarcodeWithDefaults(barcodeData)
                                    if (mode === MODE_ENUM.photographer) {
                                        this.navigate('Index', {transition: 'slideInTransition'})
                                    }
                                }
                            }
                        )
                    }}
                >
                    <View
                        style={{
                            width: Metrics.screenWidth,
                            height: 160
                        }}
                    >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{}}
                            contentContainerStyle={{
                                flexGrow: 1
                            }}
                        >
                            {this.state.possibleUpcs.map(({upc, storeStatus, parts}, idx) =>
                                <TouchableOpacity
                                    key={upc}
                                    style={{}}
                                    onPress={() => {
                                        this.setState({barcodeCounter: this.state.barcodeCounter + 1, nextBarcode: upc})
                                        this.setBarcodeWithDefaults(upc)
                                    }}
                                >
                                    <View
                                        key={`possibleUpc${idx}`}
                                        style={{
                                            height: 48,
                                            padding: Metrics.basePadding,
                                            width: Metrics.screenWidth,
                                            backgroundColor: Colors.white,
                                            borderBottomColor: Colors.darkGray,
                                            borderBottomWidth: 1,
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text style={storeStatus !== 'pending' ? {color: 'red'} : null}>
                                            <Text>{parts[0]}</Text>
                                            <Text style={{fontWeight: 'bold'}}>{parts[1]}</Text>
                                            <Text>{parts[2]}</Text>
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </View>
                </BarcodeModal>
                <Animated.View
                    contentContainerStyle={Styles.container}
                    style={[Styles.cameraContainer, {height: this.state.heightAnimation}]}
                >
                    {!navigation.isFocused() ? null : (
                        <Camera
                            autoFocus
                            style={[Styles.camera, {height: this.getContainerHeight()}]}
                            onBarCodeRead={this.handleBarCodeReadThrottled}
                        >
                            <View style={Styles.topActions}>
                                <Button style={Styles.accountButton} image={Images.account}
                                        onPress={this.handleAccount}/>
                                <Status onPress={this.handleSync} data={data}/>
                                <Button
                                    style={Styles[`modeButton_${mode}`]}
                                    textStyle={Styles[`modeButtonText_${mode}`]}
                                    text={mode === MODE_ENUM.photographer ? 'PHOTO' : 'RUNNER'}
                                    onPress={this.handleModeToggle}
                                />
                            </View>

                            <Stats data={data}/>

                            <Animatable.Image
                                transition="opacity"
                                duration={300}
                                source={Images.barcodeGuide}
                                style={[Styles.barcodeGuideImage, {opacity: this.state.modalVisible ? 0 : 1}]}
                                resizeMode="cover"
                            />
                            <Animatable.Text
                                transition="opacity"
                                key={`barcodeData`}
                                style={[Styles.barcodeDataText, {opacity: this.state.modalVisible ? 0 : 1}]}
                            >
                                {'CENTER BARCODE IN WINDOW'}
                            </Animatable.Text>
                            <Animated.View
                                ref={(bf) => {
                                    this.barcodeFrame = bf
                                }}
                                style={[
                                    Styles.barcodeFrame,
                                    {
                                        left: Metrics.screenWidth / 2 - Metrics.barcodeWidth / 2,
                                        top: this.state.slideAnimation,
                                        opacity: 1
                                    }
                                ]}
                                pointerEvents={`none`}
                            />
                            <Button
                                style={Styles.manuallyEnterBarcodeButton}
                                onPress={this.handlePressEnterBarcodeManually}
                                text={'Manually Enter Barcode'}
                            />
                        </Camera>
                    )}
                </Animated.View>
            </Animatable.View>
        )
    }
}

const enhance = compose(
    connect(
        ({sage: {mode = MODE_ENUM.runner, barcode, tag}}) => ({mode, barcode, tag}),
        {
            setMode: SageActions.setMode,
            setBarcode: SageActions.setBarcode
        }
    ),
    withData,
    withAuth,
    withPropsOnChange(
        (props, nextProps) =>
            _get(props, 'auth.session.isAuthenticated', false) !== _get(nextProps, 'auth.session.isAuthenticated', false),
        ({auth}) => ({isAuthenticated: _get(auth, 'session.isAuthenticated', false)})
    ),
    withLogin,
    withCreateAccount
);

export default enhance(withNavigationFocus(Index, 'Index'))

class Status extends React.PureComponent {
    static propTypes = {
        data: PropTypes.shape({
            loading: PropTypes.bool.isRequired,
            getUPC: PropTypes.func.isRequired,
            result: PropTypes.object
        }).isRequired,
        onPress: PropTypes.func.isRequired
    }

    getState = ({data}) => ({
        time: this.getTime(data)
    })

    state = this.getState(this.props)

    componentWillReceiveProps(nextProps) {
        this.setState(this.getState(nextProps))
    }

    componentWillMount() {
        this.interval = setInterval(() => this.setState(this.getState(this.props)), 60 * 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    getTime(data) {
        if (!data) return 'n/a'
        if (data.loading) return 'syncing...'
        if (!data.result || !data.result.date) return 'n/a'

        const diff = (Date.now() - new Date(data.result.date).getTime()) / 1000
        const h = Math.floor(diff / 3600)
        const m = Math.round((diff % 3600) / 60)
        const str = !h ? (m < 2 ? 'just now' : `${m}mins ago`) : `${h}h ${m}m ago`

        return `Last Sync:\n${str}`
    }

    render() {
        const {data, onPress} = this.props
        const {time} = this.state

        if (!data) return null

        return (
            <TouchableOpacity style={Styles.status} onPress={onPress}>
                <Text style={Styles.statusText}>{time}</Text>
            </TouchableOpacity>
        )
    }
}
