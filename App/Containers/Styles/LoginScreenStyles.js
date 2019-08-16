import {StyleSheet} from 'react-native';
import {Colors, Metrics, ApplicationStyles, Fonts} from '../../Themes';
import * as scale from '../../Utils/Scale';

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    container: {
        alignItems: 'center',
        width: Metrics.screenWidth
    },
    promptRow: {
        paddingTop: Metrics.doubleBasePadding,
        paddingBottom: Metrics.basePadding,
        paddingHorizontal: Metrics.doubleBasePadding,
        marginTop: 20,
        alignSelf: 'flex-start'
    },
    emailRow: {
        paddingBottom: Metrics.basePadding,
        marginBottom: 10 * scale.heightRatio
    },
    passwordRow: {
        paddingTop: 0,
        marginBottom: 10 * scale.heightRatio
    },
    prompt: {
        ...Fonts.style.normal,
        color: Colors.white
    },
    rowLabel: {
        ...Fonts.style.normal,
        color: Colors.white,
        paddingHorizontal: Metrics.basePadding,
        paddingBottom: 0,
        fontFamily: Fonts.type.bold,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '600',
    },
    textInput: {
        height: Metrics.inputHeight,
        color: Colors.black
    },
    textInputReadonly: {
        height: Metrics.inputHeight,
        color: Colors.gray
    },
    forgotPasswordRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Metrics.doubleBasePadding,
    },
    requiredText: {
        color: '#00dc92',
        fontFamily: Fonts.type.bold,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '600',
        lineHeight: 20 * scale.heightRatio,
    },
    loginRow: {
        paddingTop: Metrics.doubleBasePadding,
        paddingBottom: Metrics.doubleBasePadding,
        paddingHorizontal: Metrics.doubleBasePadding,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    loginButtonWrapper: {
        flex: 1
    },
    loginButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.darkGray,
        backgroundColor: Colors.lightGray,
        padding: Metrics.basePadding,
        borderRadius: Metrics.baseBorderRadius
    },
    cancelButton: {
        marginLeft: Metrics.baseMargin
    },
    loginText: {
        textAlign: 'center',
        color: Colors.black
    },
    topLogo: {
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    button: {
        borderWidth: 0,
        marginTop: Metrics.baseMargin
    },
    errorRow: {
        width: Metrics.inputWidth,
        padding: Metrics.basePadding,
        backgroundColor: Colors.pink,
        borderRadius: Metrics.baseBorderRadius,
        flexDirection: 'row',
        alignItems: 'center'
    },
    alert: {
        width: 18,
        height: 21
    },
    errorText: {
        ...Fonts.style.small,
        color: Colors.white,
        width: 220,
        marginLeft: Metrics.baseMargin
    },
    link: {
        color: 'white',
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    signUpLink: {
        color: '#fbfbfc',
        fontFamily: Fonts.type.bold,
        fontSize: 14 * scale.widthRatio,
        textAlign: 'center',
        fontWeight: '600',
        textDecorationLine: 'underline'
    },
    termsOfWebView: {
        width: 280 * scale.widthRatio,
        marginTop: 29 * scale.heightRatio,
        alignSelf: 'center'
    },
    termsText: {
        textAlign: 'center',
        color: '#ffffff',
        fontFamily: Fonts.type.base,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '400',
        lineHeight: 20 * scale.heightRatio,
    },
    webViewText: {
        color: '#00dc92',
        fontFamily: Fonts.type.base,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '400',
        lineHeight: 20 * scale.heightRatio,
        textDecorationLine: 'underline'
    }
})
