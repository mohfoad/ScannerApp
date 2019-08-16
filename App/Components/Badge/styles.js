import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
    badge: {
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        right: 0
    },
    badgeText: {
        ...Fonts.style.tiny,
        top: 1,
        color: Colors.white,
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical: Metrics.baseMargin
    },
    badgeHidden: {
        height: 0,
        opacity: 0
    }
})
