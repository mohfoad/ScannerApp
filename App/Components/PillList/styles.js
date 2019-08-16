import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
    root: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    option: {
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Metrics.doubleBaseMargin,
        marginRight: Metrics.baseMargin,
        marginBottom: Metrics.baseMargin,
        backgroundColor: Colors.white,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 40,
        height: 40
    },
    selected: {
        backgroundColor: Colors.green
    },
    text: {
        color: Colors.text
    },
    text_compact: {
        ...Fonts.style.small
    }
})
