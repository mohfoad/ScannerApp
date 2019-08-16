import { StyleSheet } from 'react-native';
import { Metrics, Fonts } from '../../Themes';
import * as scale from '../../Utils/Scale';

export default StyleSheet.create({
    container: {
        flex: 1
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    manualRefresh: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: 168 * scale.widthRatio,
        height: 28 * scale.heightRatio,
        marginTop: 7 * scale.heightRatio,
        borderRadius: 4 * scale.heightRatio,
        backgroundColor: '#4a7ffb'
    },
    refreshText: {
        color: '#fbfbfc',
        fontFamily: Fonts.type.bold,
        fontSize: 11 * scale.widthRatio,
        fontWeight: '600',
        letterSpacing: -0.08 * scale.widthRatio
    },
    captureStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 8 * scale.heightRatio
    },
    warning: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    warningImage: {
        width: 15 * scale.widthRatio,
        height: 12 * scale.widthRatio
    },
    warningResult: {
        marginLeft: 5 * scale.widthRatio,
        color: '#f54370',
        fontFamily: Fonts.type.bold,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '600',
        letterSpacing: -0.09 * scale.widthRatio
    },
    pending: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15 * scale.widthRatio
    },
    pendingImage: {
        width: 14 * scale.widthRatio,
        height: 12 * scale.widthRatio
    },
    pendingResult: {
        marginLeft: 5 * scale.widthRatio,
        color: 'rgba(31, 41, 82, 0.5)',
        fontFamily: Fonts.type.bold,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '600',
        letterSpacing: -0.09 * scale.widthRatio,
    },
    tabContainer: {
        flex: 1,
        marginTop: 35 * scale.heightRatio,
    },
    tabBar: {
        flexDirection: 'row',
        width: '100%',
        height: 40,
        borderBottomWidth: scale.heightRatio,
        borderColor: 'rgba(0,0,0,0.1)'
    },
    tabItem: {
        position: 'relative',
        width: '25%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabTitle: {
        fontFamily: Fonts.type.bold,
        fontSize: 10 * scale.widthRatio,
        fontWeight: '700',
    },
    tabIndicator: {
        position: 'absolute',
        width: '100%',
        height: 2,
        bottom: 0
    },
    tabView: {
        width: scale.deviceWidth
    },
    syncRowContainer: {
        paddingHorizontal: 15 * scale.widthRatio,
        paddingVertical: 17 * scale.heightRatio,
        borderColor: '#ededed',
        borderStyle: 'solid',
        borderBottomWidth: 1,
    },
    syncRowUp: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    syncDetail: {

    },
    syncId: {
        marginBottom: scale.heightRatio,
        color: '#1f2952',
        fontFamily: Fonts.type.bold,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '600',
        letterSpacing: -0.1 * scale.widthRatio,
    },
    syncName: {
        opacity: 0.5,
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 12 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.09 * scale.widthRatio,
    },
    syncStatus: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80 * scale.widthRatio,
        height: 18 * scale.heightRatio,
        borderRadius: 9 * scale.heightRatio,
    },
    syncStatusText: {
        color: '#ffffff',
        fontFamily: Fonts.type.bold,
        fontSize: 10 * scale.widthRatio,
        fontWeight: '600',
        letterSpacing: -0.36 * scale.widthRatio,
    },
    errorText: {
        color: '#f54370',
        fontFamily: Fonts.type.bold,
        fontSize: 10 * scale.widthRatio,
        fontWeight: '600',
        letterSpacing: -0.36 * scale.widthRatio,
        lineHeight: 16 * scale.heightRatio,
    },
    syncRowDown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10 * scale.heightRatio
    },
    syncFailedImage: {
        width: 48 * scale.widthRatio,
        height: 49 * scale.widthRatio
    }
});
