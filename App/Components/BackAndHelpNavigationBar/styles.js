import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

export default {
    ...ApplicationStyles.screen,
    compact: {
        ...ApplicationStyles.mainContainerWithoutNavBar,
        position: 'relative',
        marginTop: Metrics.statusBarHeight,
        height: Metrics.screenHeight
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: Colors.lightGray,
        height: Metrics.breadcrumbHeight,
        width: Metrics.screenWidth,
        paddingTop: Metrics.statusBarHeight,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1
    },
    leftButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Metrics.buttonHeight
    },
    leftButton_compact: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: Metrics.buttonHeight
    },
    title: {
        flex: 6,
        height: Metrics.navBarHeight,
        width: Metrics.buttonHeight,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleText: {
        ...Fonts.style.heading,
        color: Colors.primaryDark
    },
    rightButton: showInfo => ({
        flex: 1,
        height: Metrics.navBarHeight,
        width: Metrics.buttonHeight,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: showInfo ? 1 : 0
    }),
    back: {
        width: 12,
        height: 24,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    info: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginRight: Metrics.baseMargin
    },
    leftRightButton: {
        width: 50,
        justifyContent: 'center',
        height: Metrics.buttonHeight
    }
}
