import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import BarcodeActions from '../../Redux/BarcodeRedux'

// Styles
import Styles from './styles'
import { Images } from '../../Themes'
import * as Animatable from 'react-native-animatable'

class BackAndHelpNavigationBar extends React.Component {
    goBack = () => {
        const { onBack, confirmBack, navigation } = this.props
        const exec = () => {
            onBack()
            navigation.goBack()
        }
        const alertData = confirmBack && confirmBack(exec)

        if (alertData) Alert.alert(...alertData)
        else exec()
    }

    goToInfo = () => {
        if (!this.props.showInfo) {
            return null
        }
        // show info view with correct state
        this.props.navigation.navigate('InfoScreen', { transition: 'slideInTopTransition' })
    }

    render () {
        const { title, showInfo, compact, hideBack, style } = this.props

        if (compact) {
            return (
                <View style={[Styles.compact, style]}>
                    <View style={Styles.leftButton_compact}>
                        {hideBack ? null : (
                            <TouchableOpacity onPress={this.goBack} style={Styles.leftRightButton}>
                                <Animatable.Image animation={'fadeIn'} duration={300} source={Images.backWhite} style={Styles.back} />
                            </TouchableOpacity>
                        )}
                    </View>
                    {this.props.children}
                </View>
            )
        }

        return (
            <View style={[Styles.mainContainerWithoutNavBar, style]}>
                <View style={Styles.navBar}>
                    <View style={Styles.leftButton}>
                        {hideBack ? null : (
                            <TouchableOpacity onPress={this.goBack} style={Styles.leftRightButton}>
                                <Animatable.Image animation={'fadeIn'} duration={300} source={Images.back} style={Styles.back} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={Styles.title}>
                        <Text style={Styles.titleText}>{title}</Text>
                    </View>
                    <View style={Styles.rightButton(showInfo)}>
                        <TouchableOpacity onPress={this.goToInfo} style={Styles.leftRightButton}>
                            <Animatable.Image animation={'fadeIn'} duration={300} source={Images.info} style={Styles.info} />
                        </TouchableOpacity>
                    </View>
                </View>
                {this.props.children}
            </View>
        )
    }
}

BackAndHelpNavigationBar.propTypes = {
    title: PropTypes.string,
    showInfo: PropTypes.bool,
    children: PropTypes.any,
    navigation: PropTypes.any,
    onBack: PropTypes.func.isRequired,
    confirmBack: PropTypes.func,
    hideBack: PropTypes.bool
}

BackAndHelpNavigationBar.defaultProps = {
    showInfo: false,
    onBack: () => {}
}

const mapStateToProps = (state) => ({
    currentBarcode: state.barcode.currentBarcode
})

const mapDispatchToProps = (dispatch) => ({
    resetBarcode: () => dispatch(BarcodeActions.barcodeResetSuccess())
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BackAndHelpNavigationBar)
