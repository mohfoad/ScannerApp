import {StyleSheet} from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Metrics.halfBaseMargin,
        backgroundColor: Colors.transparent,
        flexDirection: 'row',
        width: Metrics.screenWidth - Metrics.baseMargin
    },
    searchInput: {
        ...Fonts.style.normal,
        flex: 5,
        height: Metrics.searchBarHeight,
        alignSelf: 'center',
        padding: Metrics.halfBaseMargin,
        textAlign: 'left',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.white,
        paddingLeft: 30,
        color: Colors.white,
        flexDirection: 'row'
    },
    searchIcon: {
        left: Metrics.doubleBaseMargin,
        alignSelf: 'center',
        color: Colors.white,
        backgroundColor: Colors.transparent
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Metrics.baseMargin
    },
    buttonLabel: {
        ...Fonts.style.normal,
        color: Colors.white
    }
})
