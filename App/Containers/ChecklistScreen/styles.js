import {StyleSheet} from 'react-native'
import {Metrics, Colors, Fonts} from '../../Themes'
import {setBarcode} from '../../Redux/SageRedux'
import * as scale from '../../Utils/Scale'

export default StyleSheet.create({
    root: {
        backgroundColor: Colors.white,
        height: Metrics.screenHeight
    },
    nav: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.blueGray1,
        paddingTop: 25 * scale.heightRatio,
        paddingBottom: 4 * scale.heightRatio
    },
    navTitle: {
        ...Fonts.style.heading,
        color: '#ffffff',
        fontFamily: Fonts.type.bold,
        fontSize: 18 * scale.widthRatio,
        fontWeight: '700',
        letterSpacing: 0.21 * scale.widthRatio,
        lineHeight: 41 * scale.heightRatio
    },
    searchInputWrapper: {
        position: 'relative',
        marginTop: 12 * scale.heightRatio,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        width: 348 * scale.widthRatio,
        height: 36 * scale.heightRatio,
        borderRadius: 4 * scale.heightRatio,
        borderStyle: 'solid',
        borderWidth: scale.widthRatio
    },
    searchInputText: {
        color: '#1f2952',
        fontFamily: Fonts.type.bold,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '600',
        letterSpacing: -0.12 * scale.widthRatio
    },
    removeSearchTextWrapper: {
        position: 'absolute',
        right: 10 * scale.widthRatio,
        width: 16 * scale.widthRatio,
        height: 16 * scale.widthRatio
    },
    removeSearchText: {
        width: '100%',
        height: '100%'
    },
    list: {
        flex: 1
    },
    item: {
        marginBottom: Metrics.baseMargin + Metrics.halfBaseMargin,
        paddingHorizontal: Metrics.baseMargin
    },
    itemName: {
        flex: 1,
        fontWeight: 'bold'
    },
    itemLocation: {
        flex: 0
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemInfo: {
        backgroundColor: '#ddd',
        paddingVertical: 2 * scale.heightRatio
    },
    category: {
        flex: 1
    },
    upc: {
        ...Fonts.style.monospace
    },
    camera: {
        flex: 0,
        height: 150,
        width: Metrics.screenWidth
    },
    cameraContent: {
        alignSelf: 'stretch',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 2 * scale.widthRatio
    },
    cameraText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    sort: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Metrics.baseMargin,
        marginVertical: Metrics.baseMargin
    },
    sortText: {
        marginRight: Metrics.baseMargin,
        fontWeight: 'bold'
    },
    sortSelect: {
        flex: 1
    },
    pagination: {
        marginTop: Metrics.baseMargin
    },
    paginationIndex: {
        flex: 1,
        marginHorizontal: Metrics.baseMargin,
        alignItems: 'center'
    },
    button: {
        flex: 0,
        padding: Metrics.baseMargin,
        margin: Metrics.baseMargin / 2,
        backgroundColor: Colors.green,
        borderRadius: 4 * scale.heightRatio,
        width: 100 * scale.widthRatio,
        alignItems: 'center'
    },
    buttonDisabled: {
        backgroundColor: Colors.gray
    },
    infiniteScrollView: {
        flex: 1
    },
    checklistItem: {
        // alignItems: 'center',
        paddingHorizontal: 8 * scale.widthRatio,
        paddingVertical: 8 * scale.heightRatio,
        borderColor: '#e6eaee',
        borderStyle: 'solid',
        borderWidth: scale.widthRatio
    },
    checklistName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    name: {
        color: '#1f2952',
        fontFamily: Fonts.type.bold,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '700',
        letterSpacing: -0.1 * scale.widthRatio
    },
    location: {
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.1 * scale.widthRatio
    },
    checklistCategory: {
        marginTop: 2 * scale.heightRatio,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    categoryName: {
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: -0.1 * scale.widthRatio
    },
    upcTitle: {
        color: '#1f2952',
        fontFamily: Fonts.type.base,
        fontSize: 14 * scale.widthRatio,
        fontWeight: '400',
        letterSpacing: 0.5 * scale.widthRatio
    }
})
