import {StyleSheet} from 'react-native';
import {Metrics, Colors, Fonts, ApplicationStyles} from '../../Themes';
import * as scale from "../../Utils/Scale";

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    root: {
        flex: 1,
        padding: Metrics.doubleBaseMargin,
        paddingTop: Metrics.doubleBaseMargin + Metrics.statusBarHeight,
        backgroundColor: Colors.primary
    },
    promptRow: {
        paddingTop: Metrics.doubleBasePadding,
        paddingBottom: Metrics.basePadding,
        paddingHorizontal: Metrics.doubleBasePadding,
        marginTop: 20,
        alignSelf: 'flex-start'
    },
    fullNamRow: {
        paddingBottom: Metrics.basePadding,
        marginTop: 27 * scale.heightRatio,
        marginBottom: 10 * scale.heightRatio
    },
    emailRow: {
        paddingTop: 0,
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
    title: {
        ...Fonts.style.bigHeading,
        textAlign: 'center',
        marginTop: Metrics.doubleBaseMargin,
        marginBottom: Metrics.doubleBaseMargin * 2,
        color: 'white'
    },
    inputTitle: {
        color: 'white',
        marginTop: Metrics.baseMargin,
        marginLeft: Metrics.baseMargin,
        fontWeight: 'bold'
    },
    link: {
        color: 'white',
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginTop: Metrics.doubleBaseMargin
    },
    button: {
        borderWidth: 0,
        marginVertical: Metrics.doubleBaseMargin
    },
    errorRow: {
        width: Metrics.inputWidth,
        padding: Metrics.basePadding,
        backgroundColor: Colors.pink,
        borderRadius: Metrics.baseBorderRadius,
        flexDirection: 'row',
        alignItems: 'center'
    },
    errorText: {
        ...Fonts.style.small,
        color: Colors.white,
        width: 220,
        marginLeft: Metrics.baseMargin
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
});
