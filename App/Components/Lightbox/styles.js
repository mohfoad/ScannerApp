import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
    titleBar: {
        width: Metrics.screenWidth,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: Metrics.breadcrumbHeight,
        paddingTop: Metrics.statusBarHeight,
        flexDirection: 'row'
    },
    title: {
        ...Fonts.style.heading,
        color: Colors.white
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: Colors.primary
    },
    moveBox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    loadingImgView: {
        width: Metrics.screenWidth,
        height: Metrics.screenHeight,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingImg: {
        width: Metrics.screenWidth,
        height: Metrics.screenHeight
    },
    loadedImg: {
        width: Metrics.screenWidth,
        height: Metrics.screenHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    failedImg: {
        width: Metrics.screenWidth
    },
    loading: {
        position: 'absolute',
        top: Metrics.screenHeight / 2 - 20 - Metrics.breadcrumbHeight / 2,
        left: Metrics.screenWidth / 2 - 20
    },
    common: {
        position: 'absolute',
        zIndex: 22,
        width: 30,
        height: 30,
        borderWidth: 3,
        borderRadius: 30
    },
    retakeButton: {
        marginBottom: Metrics.doubleBaseMargin,
        width: 110,
        height: 45,
        backgroundColor: Colors.white,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: Metrics.tripleBaseMargin - 2,
        left: Metrics.doubleBaseMargin
    },
    retakeButtonText: {
        ...Fonts.style.mediumBold,
        textAlign: 'center',
        color: Colors.primaryDark
    },
    deleteButton: {
        marginBottom: Metrics.doubleBaseMargin,
        width: 110,
        height: 45,
        backgroundColor: Colors.red,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: Metrics.tripleBaseMargin - 2,
        right: Metrics.doubleBaseMargin
    },
    deleteButtonText: {
        ...Fonts.style.mediumBold,
        textAlign: 'center',
        color: Colors.white
    },
    leftRightButton: {
        width: 50,
        justifyContent: 'center',
        height: Metrics.buttonHeight
    },
    closeButton: {
        flex: 1,
        height: Metrics.navBarHeight,
        width: Metrics.buttonHeight,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    close: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginRight: Metrics.baseMargin
    },
    leftSpacer: {
        flex: 1
    },
    titleWrapper: {
        flex: 6,
        height: Metrics.navBarHeight,
        alignItems: 'center',
        justifyContent: 'center'
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
    camera: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: Metrics.screenWidth,
        height: Metrics.screenHeight - Metrics.breadcrumbHeight,
        backgroundColor: Colors.transparent
    },
    fakePreviewTinyText: {
        ...Fonts.style.tinyBold,
        textAlign: 'center',
        color: Colors.white,
        width: 200
    },
    bottomGuideText: {
        ...Fonts.style.small,
        width: 280,
        marginBottom: Metrics.doubleBaseMargin,
        textAlign: 'center',
        color: Colors.white
    },
    photoGuideImageWrapper: {
        position: 'absolute',
        width: 100,
        alignItems: 'center',
        top: Metrics.doubleBaseMargin + Metrics.breadcrumbHeight,
        left: Metrics.screenWidth / 2 - 50
    },
    photoGuideImage: {
        width: 42,
        height: 42,
        marginBottom: Metrics.baseMargin
    },
    photoOutlineGuide: {
        width: 250,
        height: 250,
        borderColor: Colors.white,
        borderRadius: Metrics.baseBorderRadius,
        borderWidth: 1,
        position: 'absolute',
        top: Metrics.doubleBaseMargin + Metrics.breadcrumbHeight * 2,
        left: Metrics.screenWidth / 2 - 125
    },
    buttonWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: Metrics.screenWidth / 2 + 30, // results in centered capture button
        alignSelf: 'flex-end'
    },
    captureButton: {
        marginBottom: Metrics.doubleBaseMargin,
        width: 60,
        height: 60,
        backgroundColor: Colors.white,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cancelButton: {
        marginBottom: Metrics.doubleBaseMargin,
        width: 110,
        height: 45,
        backgroundColor: Colors.white,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Metrics.doubleBaseMargin
    },
    cancelButtonText: {
        ...Fonts.style.mediumBold,
        textAlign: 'center',
        color: Colors.primaryDark
    },
    captureButtonInnerRing: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderColor: Colors.primaryDark,
        borderWidth: 1,
        position: 'absolute'
    },
    photosContentContainer: {
        height: 90,
        position: 'absolute',
        top: 0,
        left: 0,
        width: Metrics.screenWidth,
        backgroundColor: Colors.white,
        flexDirection: 'row'
    },
    photoLabelContainer: {
        paddingHorizontal: Metrics.doubleBasePadding,
        flex: 0.25,
        flexDirection: 'row'
    },
    photoLabel: {
        ...Fonts.style.smallBold,
        color: Colors.primaryDark,
        flex: 1,
        alignSelf: 'center'
    },
    photosContent: {
        backgroundColor: Colors.transparent,
        height: 90,
        width: Metrics.screenWidth,
        flex: 4,
        overflow: 'hidden'
    },
    photosWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    photoData: {
        flexGrow: 1,
        ...Fonts.style.smallBold,
        padding: Metrics.basePadding,
        color: Colors.white
    },
    productThumb: {
        height: 70 - Metrics.baseMargin * 2,
        width: 70 - Metrics.baseMargin * 2,
        marginTop: Metrics.doubleBaseMargin,
        marginRight: Metrics.baseMargin,
        marginLeft: 5,
        borderRadius: Metrics.baseBorderRadius
    }
})
