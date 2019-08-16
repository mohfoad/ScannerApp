import { StyleSheet } from 'react-native';
import { Metrics, Fonts } from '../../Themes';
import * as scale from '../../Utils/Scale';

export default StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        height: Metrics.screenHeight
    },
    imageWrapper: {
        width: 29 * scale.widthRatio,
        height: 28 * scale.widthRatio,
        marginTop: 41 * scale.heightRatio
    },
    barCode: {
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
        marginTop: 15 * scale.heightRatio,
        marginBottom: 34 * scale.heightRatio,
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontWeight: '400',
        fontSize: 16 * scale.widthRatio
    },
    selectOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        width: 150 * scale.widthRatio,
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
    arrowImageWrapper: {
        width: 7 * scale.widthRatio,
        height: 14 * scale.widthRatio
    },
    arrow: {
        width: '100%',
        height: '100%'
    },
    explanationText: {
        position: 'absolute',
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '400',
        lineHeight: 20 * scale.heightRatio,
        bottom: 73 * scale.heightRatio
    }
});
