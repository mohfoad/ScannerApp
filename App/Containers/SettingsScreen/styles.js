import {StyleSheet} from 'react-native';
import {Colors, Metrics, ApplicationStyles, Fonts} from '../../Themes';
import * as scale from '../../Utils/Scale';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 15 * scale.widthRatio
    },
    userInfo: {

    },
    userName: {
        textTransform: 'uppercase',
        opacity: 0.5,
        color: '#1f2952',
        fontFamily: Fonts.type.bold,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '600'
    },
    account: {
        marginTop: 5 * scale.heightRatio,
        color: '#1f2952',
        fontFamily: Fonts.type.bold,
        fontSize: 28 * scale.widthRatio,
        fontWeight: '700',
        letterSpacing: -0.5 * scale.widthRatio,
        lineHeight: 30 * scale.heightRatio
    },
    modeSelect: {
        marginTop: 31 * scale.heightRatio,
        paddingBottom: 20 * scale.heightRatio,
        borderColor: '#ededed',
        borderStyle: 'solid',
        borderBottomWidth: 1 * scale.heightRatio
    },
    modeTitle: {
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.1 * scale.widthRatio
    },
    modeDescription: {
        opacity: 0.5,
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.09 * scale.widthRatio
    },
    modeSelectTabContainer: {
        marginTop: 15 * scale.heightRatio
    },
    tabContainerStyle: {
        width: 228 * scale.widthRatio,
        height: 28 * scale.heightRatio
    },
    activeTabStyle: {
        backgroundColor: '#4a7ffb',
        borderColor: '#4a7ffb'
    },
    tabStyle: {
        borderColor: '#4a7ffb'
    },
    activeTabTextStyle: {
        color: Colors.white,
        fontFamily: Fonts.type.bold,
        fontSize: 11 * scale.widthRatio,
        fontWeight: '600',
        letterSpacing: -0.08 * scale.widthRatio
    },
    tabTextStyle: {
        color: '#4a7ffb',
        fontFamily: Fonts.type.bold,
        fontSize: 11 * scale.widthRatio,
        fontWeight: '600',
        letterSpacing: -0.08 * scale.widthRatio
    },
    storeSelect: {
        paddingVertical: 15 * scale.heightRatio,
        borderColor: '#ededed',
        borderStyle: 'solid',
        borderBottomWidth: scale.heightRatio
    },
    storeTitleText: {
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.1 * scale.widthRatio
    },
    selectStorePart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    storeDescriptionText: {
        opacity: 0.5,
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.09 * scale.widthRatio
    },
    storeSelectMoveButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 137 * scale.widthRatio,
        height: 28 * scale.heightRatio,
        borderRadius: 4 * scale.heightRatio,
        backgroundColor: '#4a7ffb'
    },
    storeSelectMoveButtonText: {
        color: '#fbfbfc',
        fontFamily: Fonts.type.bold,
        fontSize: 11 * scale.widthRatio,
        fontWeight: '600',
        letterSpacing: -0.08 * scale.widthRatio
    },
    getUpgrade: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15 * scale.heightRatio,
        borderColor: '#ededed',
        borderStyle: 'solid',
        borderBottomWidth: scale.heightRatio
    },
    upgradeTitle: {

    },
    upgradeTitleText: {
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.1 * scale.widthRatio
    },
    upgradeDescriptionText: {
        opacity: 0.5,
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.09 * scale.widthRatio
    },
    upgradeMoveButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 137 * scale.widthRatio,
        height: 28 * scale.heightRatio,
        borderRadius: 4 * scale.heightRatio,
        backgroundColor: '#4a7ffb'
    },
    upgradeMoveButtonText: {
        color: '#fbfbfc',
        fontFamily: Fonts.type.bold,
        fontSize: 11 * scale.widthRatio,
        fontWeight: '600',
        letterSpacing: -0.08 * scale.widthRatio
    },
    productCaptureSelect: {
        paddingVertical: 15 * scale.heightRatio,
        borderColor: '#ededed',
        borderStyle: 'solid',
        borderBottomWidth: scale.heightRatio
    },
    productCaptureSelectTitle: {
        color: '#1f2952',
        fontFamily: Fonts.type.bold,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.1 * scale.widthRatio
    },
    productCaptureSelectDescription: {
        marginTop: 2 * scale.heightRatio,
        opacity: 0.5,
        color: '#1f2952',
        fontFamily: Fonts.type.bold,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.09 * scale.widthRatio
    },
    productCaptureSelectTabContainer: {
        marginTop: 13 * scale.heightRatio
    },
    sessionCaptureStatus: {
        paddingVertical: 15 * scale.heightRatio,
        borderColor: '#ededed',
        borderStyle: 'solid',
        borderBottomWidth: scale.heightRatio
    },
    sessionCaptureMoveDetailButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sessionCaptureMoveDetailButtonTextContainer: {

    },
    sessionCaptureMoveDetailButtonText: {
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.1 * scale.widthRatio
    },
    arrowIcon: {
        width: 8 * scale.widthRatio,
        height: 14 * scale.widthRatio
    },
    sessionCaptureDetail: {
        marginTop: 2 * scale.heightRatio,
        opacity: 0.5,
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.09 * scale.widthRatio
    },
    barStyle: {
        marginTop: 13 * scale.heightRatio,
        width: 240 * scale.widthRatio,
        height: 6 * scale.heightRatio,
        borderRadius: 3 * scale.heightRatio,
        backgroundColor: '#ccc'
    },
    activeBarStyle: {
        width: 130 * scale.widthRatio,
        height: 6 * scale.heightRatio,
        borderRadius: 3 * scale.heightRatio,
        backgroundColor: '#00dc92'
    },
    statusDetail: {
        marginTop: 3 * scale.heightRatio,
        opacity: 0.5,
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.09 * scale.widthRatio
    },
    manualSyncButton: {
        marginTop: 14 * scale.heightRatio,
        justifyContent: 'center',
        alignItems: 'center',
        width: 168 * scale.widthRatio,
        height: 28 * scale.heightRatio,
        borderRadius: 4 * scale.heightRatio,
        backgroundColor: '#4a7ffb'
    },
    manualSyncButtonText: {
        color: '#fbfbfc',
        fontFamily: Fonts.type.bold,
        fontSize: 11 * scale.widthRatio,
        fontWeight: '600',
        letterSpacing: -0.08 * scale.widthRatio
    },
    messageSection: {
        paddingVertical: 15 * scale.heightRatio,
        borderColor: '#ededed',
        borderStyle: 'solid',
        borderBottomWidth: scale.heightRatio
    },
    messageStatus: {

    },
    messageStatusText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    messageStatusTitleTextContainer: {

    },
    messageStatusTitleText: {
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.1 * scale.widthRatio
    },
    messageStatusDetail: {
        marginTop: 3 * scale.heightRatio,
        opacity: 0.5,
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.09 * scale.widthRatio
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 15 * scale.heightRatio,
        borderColor: '#ededed',
        borderStyle: 'solid',
        borderBottomWidth: scale.heightRatio
    },
    leftIcon: {
        marginRight: 14 * scale.widthRatio
    },
    rightText: {
        fontFamily: Fonts.type.base,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '400'
    }
});
