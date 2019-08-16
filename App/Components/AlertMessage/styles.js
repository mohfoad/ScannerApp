import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginVertical: Metrics.section,
        backgroundColor: Colors.white
    },
    contentContainer: {
        alignSelf: 'center',
        alignItems: 'center'
    },
    message: {
        ...Fonts.style.heading,
        marginTop: Metrics.baseMargin,
        marginHorizontal: Metrics.baseMargin,
        textAlign: 'center',
        color: Colors.darkGray
    },
    icon: {
        color: Colors.darkGray
    }
})
