import {StyleSheet} from 'react-native';
import {makeVariations} from '../../Utils/Styles';
import {Metrics, Colors, Fonts} from '../../Themes';

export default StyleSheet.create({
    root: {
        backgroundColor: Colors.background
    },
    content: {
        flex: 1,
        justifyContent: 'center'
    },
    syncButton: {
        marginVertical: Metrics.doubleBaseMargin
    },
    title: {
        ...Fonts.style.bigHeading,
        marginBottom: Metrics.baseMargin,
        textAlign: 'center'
    },
    ...makeVariations(
        [
            'done',
            {
                backgroundColor: Colors.green,
                marginTop: Metrics.doubleBaseMargin,
                padding: Metrics.doubleBaseMargin
            }
        ],
        ['error', {backgroundColor: Colors.error}]
    ),
    ...makeVariations(
        [
            'doneText',
            {
                ...Fonts.style.bigHeading,
                color: Colors.white,
                textAlign: 'center',
                fontWeight: 'bold'
            }
        ],
        [
            'errorText',
            {
                ...Fonts.style.monospace,
                fontSize: Fonts.size.h6
                // fontWeight: 'normal',
            }
        ]
    )
});
