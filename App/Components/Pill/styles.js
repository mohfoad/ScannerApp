import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
    pill: {
        borderRadius: 500,
        backgroundColor: Colors.pillGray,
        paddingHorizontal: Metrics.doubleBasePadding,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pillText: {
        ...Fonts.style.small,
        color: Colors.primaryDark,
        textAlign: 'center',
        marginVertical: Metrics.baseMargin
    },
    pillHidden: {
        height: 0,
        width: 0,
        opacity: 0
    },
    pillSelected: {
        backgroundColor: Colors.primaryDark
    },
    pillSelectedText: {
        color: Colors.white
    }
})
