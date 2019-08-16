import PropTypes from 'prop-types'
import React from 'react'
import { View } from 'react-native'
import { compose, withPropsOnChange } from 'recompose'
import Carousel from 'react-native-snap-carousel'

import { get as _get } from 'lodash'
import * as Animatable from 'react-native-animatable'
import { Metrics, Images } from '../../Themes'
import Button from '../../Components/Button'

// React Apollo
import { withAuth } from '../../GraphQL/Account/decorators'

// Styles
import Styles from '../Styles/OnboardingScreenStyles'

class Index extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeSlide: 0
    }
  }

  static propTypes = {
    settingApplicationData: PropTypes.bool,
    resettingApplicationData: PropTypes.bool
  }

  handlePressLogin = async () => {
    this.props.handleReset()
    this.props.navigation.navigate('LoginScreen')
  }

  componentWillReceiveProps (newProps) {
    this.forceUpdate()
  }

  renderDots = () => {
    let out = []
    let times = 0
    while (times < 5) {
      out.push(
        <Animatable.View
          duration={300}
          transition={`borderColor`}
          key={`dot${times}`}
          style={[Styles.dot, times === this.state.activeSlide && Styles.activeDot]}
        />
      )
      times++
    }
    return out
  }

  handlePressGoBack = () => {
    this.props.navigation.goBack()
  }

  renderCarousel = (fromAccount = false) => {
    return (
      <Carousel
        ref={(carousel) => {
          this.carousel = carousel
        }}
        sliderWidth={Metrics.screenWidth}
        itemWidth={Metrics.screenWidth}
        onSnapToItem={(index) => {
          this.setState({ activeSlide: index })
        }}
      >
        <View style={Styles.slide}>
          <View style={Styles.promptRow}>
            <Animatable.Image
              source={Images.sageProject}
              style={Styles.logo}
              animation='fadeIn'
              delay={fromAccount ? 0 : 300}
            />
            <Animatable.Text style={Styles.prompt} animation='fadeIn' delay={fromAccount ? 0 : 900}>
              Welcome to the Digitization App
            </Animatable.Text>
          </View>
          <Animatable.Image
            animation={'fadeIn'}
            delay={fromAccount ? 0 : 1500}
            source={Images.onboarding1}
            style={Styles.onboarding1Image}
            resizeMode={'contain'}
          />
        </View>

        <View style={Styles.slide}>
          <Animatable.Image source={Images.onboarding2Animated} style={Styles.onboarding2Image} />
          <Animatable.Text style={Styles.heading}>Snapping Photos</Animatable.Text>
          <Animatable.Text style={Styles.description}>
            You’ll use this app to take photos of products from all sides.
          </Animatable.Text>
        </View>

        <View style={Styles.slide}>
          <Animatable.Image source={Images.onboarding3} style={Styles.onboarding3Image} />
          <Animatable.Text style={Styles.heading}>Capture all Product Information</Animatable.Text>
          <Animatable.Text style={Styles.description} animation='fadeIn'>
            You’ll want to make sure to capture all product sides that have info, including ingredients, nutrition,
            serving size, certifications, and more!
          </Animatable.Text>
        </View>

        <View style={Styles.slide}>
          <Animatable.Image source={Images.onboarding4} style={Styles.onboarding4Image} />
          <Animatable.Text style={Styles.heading}>Images & Data</Animatable.Text>
          <Animatable.Text style={Styles.description}>
            Make sure the photos are clear and complete — we’ll use the photos you take to create high-res imagery and
            tons of product data.
          </Animatable.Text>
        </View>

        <View style={Styles.slide}>
          <Animatable.Image source={Images.onboarding5} style={Styles.onboarding5Image} />
          <Animatable.Text style={Styles.heading}>Product Already Exist?</Animatable.Text>
          <Animatable.Text style={Styles.description}>
            If a product already exists and the packaging looks the same, feel free to skip and move to the next. If the
            packaging has changed, recapture it!
          </Animatable.Text>
          <Animatable.Text style={Styles.secondaryHeading}>Ready? Let’s go!</Animatable.Text>
        </View>
      </Carousel>
    )
  }

  render () {
    const { settingApplicationData, navigation } = this.props

    const { fromAccount = false } = navigation.state.params || {}

    return (
      <View style={[Styles.container, Styles.onboardingContainer]}>
        {this.renderCarousel(fromAccount)}
        <Animatable.View style={Styles.dotsWrapper} animation='fadeIn' delay={fromAccount ? 0 : 1200}>
          {this.renderDots()}
        </Animatable.View>
        <View style={Styles.form}>
          <Animatable.View style={[Styles.loginRow]} animation='fadeIn' delay={fromAccount ? 0 : 1500}>
            <Button
              loading={settingApplicationData}
              onPress={fromAccount ? this.handlePressGoBack : this.handlePressLogin}
              text={fromAccount ? 'Back to Account' : 'Sign in'}
              inverted
              style={Styles.button}
            />
          </Animatable.View>
        </View>
      </View>
    )
  }
}

const enhance = compose(
  withAuth,
  withPropsOnChange(
    (props, nextProps) =>
      _get(props, 'auth.session.isAuthenticated', false) !== _get(nextProps, 'auth.session.isAuthenticated', false),
    ({ auth }) => ({ isAuthenticated: _get(auth, 'session.isAuthenticated', false) })
  )
)

export default enhance(Index)
