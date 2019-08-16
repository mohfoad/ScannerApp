import { StyleSheet } from 'react-native';
import { Metrics, Fonts } from '../../Themes';
import * as scale from '../../Utils/Scale';

export default StyleSheet.create({
    title: {
        position: 'relative',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25 * scale.heightRatio
    },
    titleText: {
        color: '#242e5b',
        fontFamily: Fonts.type.bold,
        fontSize: 18 * scale.widthRatio,
        fontWeight: '700',
        letterSpacing: 0.21,
        lineHeight: 41 * scale.heightRatio,
    },
    closeImageWrapper: {
        position: 'absolute',
        width: 24 * scale.widthRatio,
        height: 24 * scale.widthRatio,
        right: 24 * scale.widthRatio
    },
    close: {
        width: '100%',
        height: '100%'
    }
});
