import {Metrics, Colors, Fonts} from '../../Themes/';
import * as scale from '../../Utils/Scale';

export const defaultHeight = 44;
const fontSize = Fonts.style.normal.fontSize;

const baseStyle = (height = defaultHeight) => ({
    ...Fonts.style.normal,
    height: height,
    paddingHorizontal: Metrics.basePadding,
    backgroundColor: Colors.transparent,
    borderWidth: 0,
    borderRadius: Metrics.baseBorderRadius,
    color: Colors.black,
    zIndex: 999,
    overflow: 'visible'
});

const InputTextStyle = {
    container: (height = defaultHeight, focused, inverted = false, invertedColor = Colors.white, invertedFocusedColor = Colors.gray) => ({
        borderRadius: Metrics.baseBorderRadius,
        borderStyle: 'solid',
        borderWidth: inverted ? 0 : 1,
        borderBottomWidth: 1,
        borderColor: focused ? (inverted ? invertedFocusedColor : Colors.primary) : (inverted ? invertedColor : Colors.gray),
        height: height + 2, // borderWidth compensation hackery
        width: Metrics.inputWidth,
        marginHorizontal: Metrics.baseMargin,
        // marginBottom: Metrics.baseMargin
        marginBottom: 10 * scale.heightRatio
    }),
    input: (height = defaultHeight, inverted = false, invertedTextColor = Colors.white) => [
        baseStyle(height),
        {
            borderColor: Colors.transparent,
            color: inverted ? invertedTextColor : Colors.black,
            paddingLeft: inverted ? Metrics.halfBasePadding / 2 : Metrics.basePadding,
            width: Metrics.inputWidth - 2, // borderWidth compensation hackery
            borderStyle: 'solid',
            borderWidth: inverted ? 0 : 1,
            borderBottomWidth: 1,
        }
    ],
    validatedInput: {
        borderColor: Colors.darkGray
    },
    validatingInput: {
        borderColor: Colors.orange
    },
    errorContainer: (valid, hasValue, focused, validated, height = defaultHeight, inverted = false, invertedColor = Colors.white) => ([
        // baseStyle(height),
        // {
        //     height: defaultHeight + 2,
        //     lineHeight: defaultHeight,
        //     opacity: focused || (valid && hasValue) ? 0 : 1,
        //     zIndex: focused || validated ? 1 : 3,
        //     paddingLeft: inverted ? Metrics.halfBasePadding / 2 : Metrics.basePadding,
        //     color: valid ? Colors.white : (inverted ? invertedColor : Colors.secondary),
        //     borderWidth: inverted ? 0 : 1,
        //     borderBottomWidth: 1,
        //     borderColor: valid ? Colors.transparent : (inverted ? invertedColor : Colors.secondary),
        //     textAlign: 'left',
        //     width: Metrics.inputWidth
        // }
        {
            color: '#00dc92',
            fontFamily: Fonts.type.bold,
            fontSize: 12 * scale.widthRatio,
            fontWeight: '600',
            lineHeight: 20 * scale.heightRatio,
        }
    ]),
    required: (focused, valid, hasValue) => ({
        position: 'absolute',
        top: defaultHeight / 2 - fontSize / 2,
        right: fontSize / 2,
        fontWeight: 'normal',
        fontSize,
        height: 16,
        width: 16,
        backgroundColor: Colors.transparent,
        color: focused || !valid || hasValue ? Colors.transparent : Colors.secondary
    })
};

export default InputTextStyle
