import React from 'react'
import { View, Text, Animated, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { connect } from 'react-redux'

import Modal from 'react-native-modal'

import { Metrics } from '../Themes/'
import { keyboardDidShow, keyboardDidHide } from '../Lib/ComponentEventHandlers'
import * as inputValidators from '../Lib/InputValidators'
import Button from '../Components/Button'
import ValidatedTextInput from '../Components/ValidatedTextInput'
import ValidatedFormScreen from '../Containers/ValidatedFormScreen'
import UpcUtils from '../Utils/UpcUtils'

// Styles
import Styles from './Styles/BarcodeModalStyles'

class BarcodeModal extends ValidatedFormScreen {
  constructor(props) {
    super(props)

    this.state = {
      offset: new Animated.Value(Metrics.screenHeight),
      opacity: new Animated.Value(0),
      visibleHeight: Metrics.screenHeight,
      modalVisible: props.visible,
      barcode: null
    }
  }

  componentWillReceiveProps(newProps) {
    this.forceUpdate()
    // Did the barcode set complete successfully?
    if (newProps.barcodeCounter !== this.props.barcodeCounter && newProps.barcode !== this.state.barcode) {
      this.setState({ barcode: newProps.barcode })
    }
    if (this.isSettingBarcode && this.props.isSettingBarcode && !newProps.isSettingBarcode) {
      // Close the modal if barcode set succeeded
      this.isSettingBarcode = false
      this.setState({ barcode: null }, () => {
        this.dismissModal()
      })
    }
  }

  componentWillMount() {
    // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow.bind(this))
    // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide.bind(this))
  }

  componentWillUnmount() {
    // this.keyboardDidShowListener.remove()
    // this.keyboardDidHideListener.remove()
  }

  dismissModal = (dontSubmit = false) => {
    const { barcode } = this.state
    const { currentBarcode } = this.props
    this.setState({ barcode: null }, () => {
      this.props.handleCloseFromParent(dontSubmit ? null : barcode || currentBarcode)
    })
  }

  handlePressDone = () => {
    this.isSettingBarcode = true
    this.dismissModal()
  }

  handlePossibleDismissal = (e) => {
    const { pageY: y } = e.nativeEvent
    // dismiss modal if the area above it is tapped
    if (this.state.visibleHeight - y > Metrics.modalHeight) {
      this.dismissModal(true)
    }
  }

  render() {
    const { barcode } = this.state
    const { currentBarcode, settingBarcode, visible } = this.props
    const editable = !settingBarcode
    const errorMessage = 'Required'

    return (
      <Modal
        style={Styles.modal}
        isVisible={visible}
        backdropOpacity={0}
        backdropTransitionInTiming={250}
        backdropTransitionOutTiming={250}
        animationInTiming={250}
        animationOutTiming={250}
      >
        <TouchableWithoutFeedback onPress={this.handlePossibleDismissal}>
          <View style={[Styles.container, { height: this.state.visibleHeight }]}>
            <View style={[Styles.modalContent]}>
              <View style={Styles.heading}>
                <Text style={Styles.headingText}>{'Manually Enter Barcode'}</Text>
              </View>
              <View style={{}}>{this.props.children}</View>
              <View style={Styles.form}>
                <ValidatedTextInput
                  placeholder={barcode || currentBarcode || 'Barcode'}
                  name="BARCODE"
                  required
                  maxLength={13}
                  editable={editable}
                  keyboardType="numeric"
                  returnKeyType="go"
                  index="barcode"
                  ref="barcode"
                  value={barcode}
                  onChange={(value) => {
                    const { format, standard } = UpcUtils.standardize(value)
                    this.setState({ barcode: value }, () => {
                      this.props.handleChangeBarcodeFromParent(value)
                    })
                  }}
                  validationFn={inputValidators.requiredValidator}
                  onValidityChange={this.handleValidityChange}
                  onSubmitEditing={this.handlePressDone}
                  errorMessage={errorMessage}
                  selectTextOnFocus
                  style={Styles.input}
                />
                <Button onPress={this.handlePressDone}>{'DONE'}</Button>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    currentBarcode: state.barcode.currentBarcode,
    settingBarcode: state.barcode.setting
  }
}

BarcodeModal.defaultProps = {
  children: null,
  barcodeCounter: 0
}

export default connect(mapStateToProps)(BarcodeModal)
