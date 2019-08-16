import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { View, ScrollView } from 'react-native'

// Our current version of react-native does not have FlatList
//  This is a simple implementation
export default class FlatList extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    // only supports fixed item heights
    itemHeight: PropTypes.number.isRequired
  }

  state = {
    start: 0,
    end: 20,
    height: 0
  }

  componentWillReceiveProps = ({ data }) => {
    if (data !== this.props.data) {
      // no need to reset height, not sure if onLayout fires again
      this.setState({ start: 0, end: 20 })
    }
  }

  onLayout = ({
    nativeEvent: {
      layout: { height }
    }
  }) => {
    this.setState({ height })
  }

  onScroll = ({
    nativeEvent: {
      layout,
      contentOffset: { y }
    }
  }) => {
    const { itemHeight, data } = this.props
    const { height } = this.state
    const padding = 10
    const itemsToRender = Math.ceil(height / itemHeight) + padding * 2
    const start = Math.max(0, Math.floor(y / itemHeight) - padding)
    const end = Math.min(data.length, start + itemsToRender)

    if (start !== this.state.start || end !== this.state.end) this.setState({ start, end })
  }

  render () {
    const { data, renderItem, itemHeight, style, ...rest } = this.props
    const { start, end } = this.state

    return (
      <View {...rest} style={[style, { flex: 1 }]}>
        <ScrollView onScroll={this.onScroll} onLayout={this.onLayout} scrollEventThrottle={8} style={{ flex: 1 }}>
          <View style={{ flex: 0, height: start * itemHeight }} />
          {data.slice(start, end).map((obj, index) => (
            <View key={start + index} style={{ height: itemHeight }}>
              {renderItem(obj, index)}
            </View>
          ))}
          <View style={{ flex: 0, height: (data.length - end) * itemHeight }} />
        </ScrollView>
      </View>
    )
  }
}
