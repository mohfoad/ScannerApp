const type = {
    base: 'AvertaStd-Regular',
    bold: 'AvertaStd-Bold',
    emphasis: 'AvertaStd-ThinItalic'
};

const size = {
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 22,
    h5: 20,
    h6: 18,
    normal: 16,
    medium: 14,
    small: 12,
    tiny: 10,
    realTiny: 8
};

const style = {
    normal: {
        fontFamily: type.base,
        fontSize: size.normal
    },
    big: {
        fontFamily: type.base,
        fontSize: size.h4
    },
    heading: {
        fontFamily: type.bold,
        fontSize: size.h6
    },
    bigHeading: {
        fontFamily: type.bold,
        fontSize: size.h4
    },
    description: {
        fontFamily: type.base,
        fontSize: size.medium
    },
    bigDescription: {
        fontFamily: type.base,
        fontSize: size.h3
    },
    medium: {
        fontFamily: type.base,
        fontSize: size.medium
    },
    mediumBold: {
        fontFamily: type.bold,
        fontSize: size.medium
    },
    small: {
        fontFamily: type.base,
        fontSize: size.small
    },
    smallBold: {
        fontFamily: type.bold,
        fontSize: size.small
    },
    tiny: {
        fontFamily: type.base,
        fontSize: size.tiny
    },
    realTiny: {
        fontFamily: type.base,
        fontSize: size.realTiny
    },
    tinyBold: {
        fontFamily: type.bold,
        fontSize: size.tiny
    },
    realTinyBold: {
        fontFamily: type.bold,
        fontSize: size.realTiny
    },
    monospace: {
        fontFamily: 'Courier New',
        fontSize: size.medium
    }
};

export default {
    style,
    type,
    size
}
