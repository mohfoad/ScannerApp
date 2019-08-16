import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: Metrics.halfBasePadding,
        paddingHorizontal: Metrics.basePadding,
        marginTop: Metrics.baseMargin,
        borderRadius: Metrics.baseBorderRadius,
        borderColor: Colors.gray,
        borderWidth: 1,
        flexDirection: 'row'
    },
    containerInvalid: {
        borderColor: Colors.error
    },
    labelContainer: {
        flex: 10,
        justifyContent: 'center'
    },
    label: {
        ...Fonts.style.normal,
        color: Colors.gray
    },
    icon: {
        flex: 1
    },
    modalPickerOption: {
        padding: Metrics.basePadding
    },
    modalPickerCancel: {
        padding: Metrics.basePadding
    }
})
