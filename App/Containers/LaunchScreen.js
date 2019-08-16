import React from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Image, View, TouchableOpacity } from 'react-native'
import { Images } from '../Themes'

// Styles
import Styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends React.Component {
  componentDidMount () {
    setTimeout(() => {
      this.props.navigation.navigate('LoginScreen')
    }, 1000)
  }

  handlePressLogo = () => {
    this.props.navigation.navigate('LoginScreen')
  }

  render () {
    return (
      <View style={Styles.mainContainer}>
        <ScrollView contentContainerStyle={Styles.container}>
          <TouchableOpacity onPress={this.handlePressLogo}>
            <Image source={Images.logo} style={Styles.logo} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}
