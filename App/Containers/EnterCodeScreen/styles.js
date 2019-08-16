import { StyleSheet } from 'react-native';
import { Metrics, Images, Colors, Fonts, ApplicationStyles } from '../../Themes';
import * as scale from '../../Utils/Scale';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary
    },
    promptRow: {
        marginTop: 39 * scale.heightRatio,
        marginBottom: 97 * scale.heightRatio
    },
    prompt: {
        ...Fonts.style.normal,
        marginTop: 12 * scale.heightRatio,
        alignSelf: 'center',
        width: 180 * scale.widthRatio,
        color: Colors.white,
        textAlign: 'center',
        fontFamily: Fonts.type.bold,
        fontSize: 16 * scale.widthRatio,
        fontWeight: '400'
    },
    promptTitle: {
        marginTop: 13 * scale.heightRatio,
        color: Colors.white,
        fontFamily: Fonts.type.bold,
        fontSize: 24 * scale.widthRatio,
        fontWeight: '700',
        letterSpacing: -0.7 * scale.widthRatio,
        textAlign: 'center'
    },
    title: {
        ...Fonts.style.bigHeading,
        textAlign: 'center',
        marginTop: Metrics.doubleBaseMargin,
        marginBottom: Metrics.doubleBaseMargin * 2,
        color: Colors.white,
    },
    inputTitle: {
        alignSelf: 'flex-start',
        color: Colors.white,
        marginTop: Metrics.baseMargin,
        marginLeft: Metrics.baseMargin,
        fontWeight: 'bold'
    },
    link: {
        color: Colors.white,
        textAlign: 'center',
        marginTop: Metrics.doubleBaseMargin,
        fontFamily: Fonts.type.bold,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '600',
        textDecorationLine: 'underline'
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
    lockImageWrapper: {
        alignSelf: 'center',
        width: 23 * scale.widthRatio,
        height: 31 * scale.widthRatio
    },
    lock: {
        width: '100%',
        height: '100%'
    },
    form: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexGrow: 1
    },
    buttonWrapper: {
        marginTop: 108 * scale.heightRatio
    },
    inputQuestion: {
        color: Colors.white,
        fontFamily: Fonts.type.base,
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 20
    },
    requestLink: {
        color: '#00dc92',
        fontFamily: Fonts.type.regular,
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 20
    }
});
