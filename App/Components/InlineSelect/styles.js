import {StyleSheet} from 'react-native';
import {Metrics, Colors, Fonts} from '../../Themes';
import * as scale from '../../Utils/Scale';

export default StyleSheet.create({
    root: {
        flexDirection: 'row',
        borderWidth: 1 * scale.widthRatio,
        borderColor: '#4a7ffb',
        borderRadius: 4 * scale.heightRatio,
        backgroundColor: Colors.white,
        overflow: 'hidden'
    },
    option: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // padding: Metrics.baseMargin
    },
    option_compact: {
        paddingVertical: 7 * scale.heightRatio,
        paddingHorizontal: 10 * scale.widthRatio
    },
    optionBorder: {
        borderRightWidth: 1 * scale.heightRatio,
        borderColor: '#4a7ffb'
    },
    selected: {
        backgroundColor: '#4a7ffb'
    },
    text: {
        color: Colors.text
    },
    text_compact: {
        ...Fonts.style.small,
        textTransform: 'uppercase'
    }
});
