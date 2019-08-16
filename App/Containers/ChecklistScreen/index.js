import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableOpacity, FlatList, TextInput, StatusBar, ScrollView} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import _ from 'lodash';
import InfiniteScroll from 'react-native-infinite-scroll';
import Highlighter from 'react-native-highlight-words';
import withData from '../../Decorators/withData';
import toTitleCase from '../../Utils/toTitleCase';
import getBarcodeWithDefaults from '../../Utils/getBarcodeWithDefaults';

import BarcodeVerdict from '../BarcodeVerdict';
import CloseButton from '../../Components/CloseButton';
import Camera from '../../Components/Camera';
import InlineSelect from '../../Components/InlineSelect';
import * as scale from '../../Utils/Scale';
import styles from './styles';
import { Images } from '../../Themes';

const SORT_OPTIONS = [
    {key: 'name', label: 'Name'},
    {key: 'category', label: 'Category'},
    {key: 'priority', label: 'Priority'}
];

class Index extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            originListArr: [],
            checklistArr: [],
            page: 0,
            sort: 'category',
            barcode: null,
            searchText: '',
            onFocusFlag: false,
            loadNum: 10
        };
    }

    componentDidMount() {
        const { data } = this.props;
        const originListArr = _.filter(data.result.upc, (x) => x.storeStatus === 'pending');
        this.setState({ originListArr, checklistArr: originListArr });
        // const sortedList = this.sortByTab(originListArr, this.state.sort);
    }

    sortByTab = (list, tab) => {
        return list.sort((a, b) => (a[tab] > b[tab]) ? 1 : ((b[tab] > a[tab]) ? -1 : 0));
    };

    handleClose = () => this.props.navigation.goBack();

    handleBarCodeReadThrottled = _.throttle(({data, type}) => {
        if (this.state.barcode === data) return;
        this.setState({barcode: data})
    }, 500);

    handleSortChange = (sort) => {
        this.setState({ sort }, () => {
            this.setState({ checklistArr: this.sortByTab(this.state.checklistArr, this.state.sort) });
        });
    };

    setBarcode = (barcode) => this.setState({ barcode });

    onChangeSearchText = searchText => {
        this.setState({ searchText });
        if (searchText === '') {
            this.setState({ checklistArr: this.state.originListArr });
            return;
        }
        let checklistArr = _.filter(this.state.originListArr, (x) => {
            if (x.name && x.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) return true;
            if (x.category && x.category.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) return true;
            return !!(x.upc && x.upc.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);

        });
        this.setState({ checklistArr })
    };

    onFocus = () => this.setState({ onFocusFlag: true });

    onBlur = () => this.setState({ onFocusFlag: false });

    removeSearchText = () => this.setState({ searchText: '' });

    loadMorePage = () => this.setState({ loadNum: this.state.loadNum + 10 });

    render() {
        const {data} = this.props;
        const { sort, barcode } = this.state;

        if (data.loading && !data.result) {
            return (
                <View style={styles.root}>
                    <Text>loading...</Text>
                </View>
            )
        }

        if (barcode) {
            return (
                <View style={styles.root}>
                    <BarcodeVerdict
                        barcode={getBarcodeWithDefaults(data, barcode)}
                        onClose={() => this.setState({barcode: null})}
                    />
                </View>
            )
        }

        // let list = _.filter(data.result.upc, (x) => x.storeStatus === 'pending');
        // const v = (obj, k = sort) =>
        //     (k === 'aisle'
        //         ? obj.location &&
        //         obj.location.aisle &&
        //         obj.location.aisle.replace(/\d+/g, (x) => String.fromCharCode(65 + parseInt(x, 10)))
        //         : obj[k]) || 'zzzz';
        // list = list.sort((a, b) =>
        //     v(a) === v(b)
        //         ? sort === 'name'
        //         ? v(a, 'category').localeCompare(v(b, 'category'))
        //         : v(a, 'name').localeCompare(v(b, 'name'))
        //         : v(a).localeCompare(v(b))
        // );

        StatusBar.setBarStyle('light-content', true);
        return (
            <View style={styles.root}>
                <View style={styles.nav}>
                    <Text style={styles.navTitle}>Products: {this.state.checklistArr.length} pending</Text>
                    <CloseButton onPress={this.handleClose}/>
                </View>

                <View
                    style={
                        [
                            styles.searchInputWrapper,
                            {
                                backgroundColor: this.state.onFocusFlag ? '#ffffff' : '#f1f1f2',
                                borderColor: this.state.onFocusFlag ? '#4a7ffb' : '#f1f1f2'
                            }
                        ]
                    }
                >
                    <Feather
                        style={{paddingHorizontal: 8 * scale.widthRatio}}
                        size={18 * scale.heightRatio}
                        color={'#AAAAAA'}
                        name={'search'}
                    />
                    <TextInput
                        placeholder={'Search by name, brand or UPC'}
                        value={this.state.searchText}
                        onChangeText={this.onChangeSearchText}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        style={styles.searchInputText}
                    />
                    {
                        this.state.searchText.length !== 0 &&
                        <TouchableOpacity style={styles.removeSearchTextWrapper} onPress={this.removeSearchText}>
                            <Animatable.Image source={Images.search_close} style={styles.removeSearchText} />
                        </TouchableOpacity>
                    }
                </View>

                <View style={styles.sort}>
                    <Text style={styles.sortText}>Sort by:</Text>
                    <InlineSelect
                        compact
                        value={sort}
                        options={SORT_OPTIONS}
                        onChange={this.handleSortChange}
                        style={styles.sortSelect}
                    />
                </View>

                <InfiniteScroll
                    horizontal={false}  //true - if you want in horizontal
                    onLoadMoreAsync={this.loadMorePage}
                    distanceFromEnd={10} // distance in density-independent pixels from the right end
                    style={styles.infiniteScrollView}
                >
                    {
                        this.state.checklistArr.slice(0, this.state.loadNum).map((checklist, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.checklistItem, { backgroundColor: index % 2 === 0 ? '#edeef2' : '#ffffff' }]}
                                    onPress={() => this.setBarcode(checklist.upc)}
                                >
                                    <View style={styles.checklistName}>
                                        <Highlighter
                                            highlightStyle={{ backgroundColor: '#00dc92', opacity: 0.25 }}
                                            style={styles.name}
                                            searchWords={[this.state.searchText]}
                                            textToHighlight={checklist.name}
                                        />
                                        <Highlighter
                                            highlightStyle={{ backgroundColor: '#00dc92', opacity: 0.25 }}
                                            style={styles.location}
                                            searchWords={[this.state.searchText]}
                                            textToHighlight={checklist.priority}
                                        />
                                    </View>
                                    <View style={styles.checklistCategory}>
                                        <Highlighter
                                            highlightStyle={{ backgroundColor: '#00dc92', opacity: 0.25 }}
                                            style={styles.categoryName}
                                            searchWords={[this.state.searchText]}
                                            textToHighlight={`${checklist.priority}/${checklist.subcategory}`}
                                        />
                                        <Highlighter
                                            highlightStyle={{ backgroundColor: '#00dc92', opacity: 0.25 }}
                                            style={styles.upcTitle}
                                            searchWords={[this.state.searchText]}
                                            textToHighlight={checklist.upc}
                                        />
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </InfiniteScroll>

                <Camera autoFocus wrapperStyle={styles.camera} onBarCodeRead={this.handleBarCodeReadThrottled}>
                    <View style={styles.cameraContent}>
                        <Text style={styles.cameraText}>Barcode Scanner</Text>
                    </View>
                </Camera>
            </View>
        )
    }
}

export default withData(Index)
