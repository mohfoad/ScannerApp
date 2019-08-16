import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes';
import * as scale from '../../Utils/Scale';

export default StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        height: 88 * scale.heightRatio,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 11 * scale.heightRatio,
        borderBottomWidth: 0.5 * scale.heightRatio,
        borderColor: 'rgba(0, 0, 0, 0.3)',
        backgroundColor: '#FFFFFF',
        shadowColor: "rgba(0, 0, 0, 0.3)",
        shadowOffset: {
            width: 0,
            height: 0.5
        },
        shadowRadius: 0,
        shadowOpacity: 1
    },
    backButton: {
        position: 'absolute',
        left: 20 * scale.widthRatio,
        bottom: 11 * scale.heightRatio,
        paddingHorizontal: 10 * scale.widthRatio
    },
    title: {
        fontSize: 17 * scale.widthRatio,
        fontFamily: "Lato",
        fontWeight: "600",
        fontStyle: "normal",
        lineHeight: 22 * scale.heightRatio,
        letterSpacing: -0.41,
        color: '#45464e'
    }
});
