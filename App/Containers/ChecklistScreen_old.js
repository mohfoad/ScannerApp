import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Picker } from 'react-native'
import _ from 'lodash'
import PropTypes from 'prop-types'

import withData from '../Decorators/withData'
import { MODE_ENUM } from '../Redux/SageRedux'
import BackAndHelpNavigationBar from '../Components/BackAndHelpNavigationBar'
import FlatList from '../Components/FlatList'
import InlineSelect from '../Components/InlineSelect'
import BarcodeVerdict from './BarcodeVerdict'

const SORT_OPTIONS = [
  {
    key: 'brand',
    label: 'Brand',
    compare: (a, b) => (a.brand || '').localeCompare(b.brand || '')
  },
  {
    key: 'name',
    label: 'Name',
    compare: (a, b) => (a.name || '').localeCompare(b.name || '')
  },
  {
    key: 'category',
    label: 'Category',
    compare: (a, b) => (a.category || '').localeCompare(b.category || '')
  },
  {
    key: 'upc',
    label: 'UPC',
    compare: (a, b) => (a.upc || '').localeCompare(b.upc || '')
  }
]

class ChecklistScreen extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      result: PropTypes.shape({
        upc: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }

  getState = ({
    data: {
      result: { upc }
    }
  }) => ({
    upc: null,
    filterOptions: {
      ..._.groupBy(upc, 'storeStatus'),
      all: _.map(upc)
    },
    filter: 'pending',
    sort: 'brand'
  })

  state = this.getState(this.props)

  componentWillReceiveProps (next) {
    if (next.data && next.data.result !== this.props.data.result) {
      this.setState(this.getState(next))
    }
  }

  renderItem = ({ upc, name, brand, status, category }) => (
    <TouchableOpacity style={Styles.item} onPress={() => this.setState({ upc })}>
      <View style={Styles.itemNameContainer}>
        <Text style={Styles.itemName} numberOfLines={1}>
          {name}
        </Text>
        {brand ? (
          <Text style={Styles.itemBrand} numberOfLines={1}>
            {brand}
          </Text>
        ) : null}
      </View>
      <View style={{ flex: 0 }}>
        {category ? <Text style={[Styles.itemCategory, { color: getCategoryColor(category) }]}>{category}</Text> : null}
        <Text style={Styles.itemUpc}>{upc}</Text>
      </View>
    </TouchableOpacity>
  )

  render () {
    const { navigation } = this.props
    const { upc, filterOptions, filter, sort } = this.state

    const sortedData = filterOptions[filter] || []

    return (
      <BackAndHelpNavigationBar navigation={this.props.navigation} style={Styles.root} title='Checklist'>
        {upc ? (
          <BarcodeVerdict
            barcode={upc}
            onClose={() => this.setState({ upc: null })}
            navigate={navigation.navigate}
            mode={MODE_ENUM.runner}
          />
        ) : null}
        <InlineSelect
          compact
          value={filter}
          options={[
            // { key: 'all', label: 'all' },
            { key: 'pending', label: `Pending (${_.size(filterOptions.pending)})` },
            { key: 'cart', label: `Cart (${_.size(filterOptions.cart)})` },
            { key: 'done', label: `Done (${_.size(filterOptions.done)})` }
          ]}
          onChange={(filter) => this.setState({ filter })}
          style={Styles.filters}
        />
        {/* <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>Sort:</Text>
            <Picker
              selectedValue={sort}
              onValueChange={sort => this.setState({ sort })}
              style={{ height: 50, width: 300 }}
            >
              {SORT_OPTIONS.map(({ key, label }) =>
                <Picker.Item key={key} label={label} value={key} />
              )}
            </Picker>
          </View>
        </View> */}
        <FlatList key={`${filter}-${sort}`} data={sortedData} renderItem={this.renderItem} itemHeight={50} />
      </BackAndHelpNavigationBar>
    )
  }
}

export default withData(ChecklistScreen)

import { StyleSheet } from 'react-native'
import { Metrics, Colors, Fonts, ApplicationStyles } from '../Themes'

const CATEGORY_COLORS = [
  Colors.lightBlue,
  Colors.yellowAccent,
  Colors.green,
  Colors.magenta,
  Colors.darkBlue,
  Colors.purple,
  Colors.red
]
const colorMap = {}
let colorIndex = 0
const getCategoryColor = (name) =>
  (colorMap[name] = colorMap[name] || CATEGORY_COLORS[colorIndex++ % CATEGORY_COLORS.length])

const Styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.background
  },
  filters: {
    margin: Metrics.baseMargin
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 20
  },
  itemNameContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  itemName: {
    color: Colors.text
  },
  itemUpc: {
    ...Fonts.style.monospace,
    flex: 0,
    fontWeight: 'bold',
    color: Colors.text
  },
  itemBrand: {
    ...Fonts.style.tiny,
    color: Colors.darkGray
  },
  itemCategory: {
    ...Fonts.style.medium,
    flex: 0,
    fontWeight: 'bold',
    textAlign: 'right',
    color: Colors.text
  }
})
