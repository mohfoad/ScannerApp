import { StyleSheet } from 'react-native';
import { Metrics, Fonts } from '../../Themes';
import * as scale from '../../Utils/Scale';

export  default StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        height: Metrics.screenHeight
    },
    imageWrapper: {
        width: 30 * scale.widthRatio,
        height: 28 * scale.widthRatio,
        marginTop: 39 * scale.heightRatio
    },
    store: {
        width: '100%',
        height: '100%'
    },
    welcomeTextWrapper: {
        marginHorizontal: 100 * scale.widthRatio,
        flexDirection: 'row'
    },
    welcomeText: {
        flex: 1,
        flexWrap: 'wrap',
        marginTop: 14 * scale.heightRatio,
        color: '#1f2952',
        fontSize: 24 * scale.widthRatio,
        fontWeight: '700',
        letterSpacing: -0.7,
        fontFamily: Fonts.type.bold,
        textAlign: 'center'
    },
    selectText: {
        width: 199 * scale.widthRatio,
        marginTop: 15 * scale.heightRatio,
        marginBottom: 34 * scale.heightRatio,
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontWeight: '400',
        fontSize: 16 * scale.widthRatio,
        textAlign: 'center'
    },
    selectOption: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 320 * scale.widthRatio,
        height: 106 * scale.heightRatio,
        marginBottom: 25 * scale.heightRatio,
        paddingHorizontal: 24 * scale.widthRatio,
        shadowColor: 'rgba(0, 0, 0, 0.12)',
        shadowOffset: {
            width: 2,
            height: 0
        },
        shadowRadius: 8 * scale.heightRatio,
        borderRadius: 4 * scale.heightRatio,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#eaeaea'
    },
    option: {
        width: '100%',
        height: '100%'
    },
    upText: {
        marginTop: 2 * scale.heightRatio,
        color: '#1f2952',
        fontFamily: Fonts.type.bold,
        fontSize: 16 * scale.widthRatio,
        fontWeight: '700'
    },
    bottomText: {
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '400'
    },
    placeholderText: {
        opacity: 0.5,
        color: '#1f2952',
        fontFamily: Fonts.type.bold,
        fontSize: 16,
        fontWeight: '700',
    },
    text: {
        marginLeft: 27 * scale.widthRatio
    },
    finishButton: {
        marginTop: 162 * scale.heightRatio,
        justifyContent: 'center',
        alignItems: 'center',
        width: 300 * scale.widthRatio,
        height: 48 * scale.heightRatio,
        borderRadius: 4 * scale.widthRatio,
        backgroundColor: '#4a7ffb',
    },
    finishText: {
        color: '#fbfbfc',
        fontFamily: Fonts.type.bold,
        fontSize: 18 * scale.widthRatio,
        fontWeight: '700',
    },
    textGroup: {
        position: 'absolute',
        bottom: 53 * scale.heightRatio
    },
    text1: {
        textAlign: 'center'
    },
    text2: {
        textAlign: 'center',
        color: '#00dc92',
        fontFamily: Fonts.type.base,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '400',
        lineHeight: 20 * scale.heightRatio,
    },
    underLine: {
        height: 1 * scale.heightRatio,
        borderColor: '#00dc92',
        borderStyle: 'solid',
        borderBottomWidth: 1 * scale.heightRatio
    }
});
