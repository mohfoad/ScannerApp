const colors = {
    white: 'rgb(255, 255, 255)',
    lightGray: '#F8F8F8',
    pillGray: '#EEEFF2',
    gray: '#EAEAEA',
    twentyPercentWhite: 'rgba(255, 255, 255, 0.2)',
    blueGray: 'rgba(31, 41, 82, 0.5)',
    blueGray1: 'rgb(31, 41, 82)',
    darkGray: 'rgb(112, 112, 112)',
    black: 'rgb(0, 0, 0)',
    transparentGray: 'rgba(50, 50, 50, 0.4)',
    transparent: 'rgba(0, 0, 0, 0)',
    clear: 'rgba(0, 0, 0, 0)',
    offWhite: 'rgb(246, 246, 246)',
    offBlack: 'rgb(10, 10, 10)',
    green: 'rgb(0, 224, 139)',
    lightBlue: 'rgb(0, 197, 254)',
    blue: 'rgb(82, 123, 246)',
    purple: 'rgb(177, 88, 255)',
    magenta: 'rgb(255, 37, 110)',
    yellow: '#FFDF42',
    red: 'rgb(200, 0, 0)',
    darkBlue: '#1F2750',
    purpleAccent: 'rgb(79, 39, 237)',
    magentaAccent: 'rgb(255, 120, 94)',
    yellowAccent: 'rgb(255, 125, 0)',
    drawer: 'rgba(30, 30, 29, 0.95)',
    border: 'rgb(224, 224, 224)',
    error: 'rgba(200, 0, 0, 0.8)',
    windowTint: 'rgba(0, 0, 0, 0.4)',
    twitter: 'rgb(1, 159, 233)',
    facebook: 'rgb(46, 77, 167)',
    google: 'rgb(215, 15, 37)',
    text: 'rgb(30, 30, 30)',
    greenText: 'rgb(235, 254, 247)',
    blueText: 'rgb(237, 251, 255)',
    background: 'rgb(240, 240, 240)',
    pink: '#F83F6E'
};

const mappedColors = {
    ...colors,
    ...{
        primary: colors.blue,
        secondary: colors.green,
        primaryDark: colors.darkBlue,
        primaryLight: colors.lightBlue
    }
};

export default mappedColors
