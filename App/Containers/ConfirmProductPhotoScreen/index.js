import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native'
import { pathOr } from 'ramda'

import { get as _get } from 'lodash'

import { Image } from 'react-native-animatable'
import { createImageProgress } from 'react-native-image-progress'
import ProgressCircle from 'react-native-progress/Circle'

import dateFormat from 'dateformat'
import { Transitions, Images, Colors } from '../../Themes'

import Button from '../../Components/Button'
import Lightbox from '../../Components/Lightbox'

// React Apollo
import { graphql } from 'react-apollo/index'
import { compose, withPropsOnChange } from 'recompose'
// import sanitizeApolloResult from '../Lib/SanitizeApolloResult'
import { withAuth } from '../../GraphQL/Account/decorators'
import { withProductCreate, withProductUpdate, withProductTouch } from '../../GraphQL/Shared/decorators'
import * as sharedQueries from '../../GraphQL/Shared/queries'

// Styles
import Styles from '../Styles/ConfirmProductPhotosScreenStyles'

const ProgressImage = createImageProgress(Image)
const progressIndicatorProps = {
  size: 30,
  indeterminate: true,
  color: Colors.secondary,
  borderWidth: 3
}

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      index: 0,
      shown: false,
      loading: false
    }
    this.showLightbox = (index) => {
      this.setState({
        index,
        shown: true
      })
    }
    this.hideLightbox = () => {
      this.setState({
        index: 0,
        shown: false
      })
    }
  }

  handlePressConfirmProduct = async () => {
    const { product } = this.props
    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          await this.props.productTouch({ variables: { _id: product._id } })
          console.log('product confirmed')
          const msg = `Product confirmed`
          this.setState({ loading: false })
          this.props.populateAlert(msg)
          this.props.handleNextStep()
        } catch (e) {
          // @TODO: handle error case
          console.log(e)
          this.setState({ loading: false })
          const msg = `Error confirming product`
          this.props.populateAlert(msg, 'error')
        }
      }
    )
  };

  handlePressNewProduct = () => {
    this.props.navigation.navigate('NewProductScreen', {
      shouldUpdate: true,
      transition: 'slideInTransition',
      barcode: this.props.barcode
    })
  };

  renderProductText (productText) {
    return <Text style={Styles.boldLabel}>{productText}</Text>
  }

  renderPhotoPreview = (imagePath, key, idx = 1) => {
    return (
      <TouchableOpacity key={key} onPress={() => this.showLightbox(idx)}>
        <ProgressImage
          indicator={ProgressCircle}
          indicatorProps={progressIndicatorProps}
          animation={Transitions.pulseFadeIn}
          useNativeDriver
          duration={1000}
          source={{ uri: imagePath }}
          style={Styles.productThumb}
          resizeMode='cover'
        />
      </TouchableOpacity>
    )
  };

  renderPhotos = () => {
    const { product, navigation } = this.props
    const { index, shown } = this.state
    const renderedPhotos = pathOr([], ['mediaList'], product).map((photo, idx) => {
      const source = pathOr(null, ['thumbnail'], photo)
      return (
        <View key={`productPhoto${idx}`} style={Styles.productThumbWrapper()}>
          {source ? this.renderPhotoPreview(source, `capturedImage${idx}`, idx) : this.renderProductText(product.name)}
        </View>
      )
    })
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}
      >
        {renderedPhotos}
        <Lightbox
          navigation={navigation}
          shown={shown}
          imageUrls={pathOr([], ['mediaList'], product).map((url) => url.source)}
          onClose={this.hideLightbox}
          index={index}
        />
      </View>
    )
  };

  renderConfirmProductPhotosScreen () {
    const { product } = this.props
    const { loading } = this.state

    const touchDate = Date.parse(product.lastTouchedDate) || Date.now()
    const lastTouchedHumanReadable = product.lastTouchedDate ? dateFormat(touchDate, 'mmmm d, yyyy') : 'never'

    return (
      <Animated.View style={Styles.container}>
        <View style={Styles.headingWrapper}>
          <ProgressImage
            indicator={ProgressCircle}
            indicatorProps={progressIndicatorProps}
            animation={Transitions.pulseFadeIn}
            duration={600}
            source={Images.checkProduct}
            style={Styles.checkProduct}
            resizeMode='cover'
          />
          <Text style={Styles.productNameLabel}>{product.name}</Text>
          <Text style={Styles.lastCapturedLabel}>{`LAST CAPTURED: ${lastTouchedHumanReadable.toUpperCase()}`}</Text>
          <Text style={Styles.label}>Is the product up to date?</Text>
        </View>
        <View style={Styles.form}>
          <View style={Styles.productPhotosContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[Styles.section]}>
              {this.renderPhotos()}
            </ScrollView>
          </View>
          <Button
            loading={loading}
            style={Styles.confirmProductButton}
            onPress={this.handlePressConfirmProduct}
            text={'Yes, Up to Date'}
            image={Images.yesUpToDate}
            dark
          />
          <Button
            loading={loading}
            style={Styles.newProductButton}
            onPress={this.handlePressNewProduct}
            text={'No, Needs an Update'}
            image={Images.noNeedsAnUpdate}
            inverted
          />
        </View>
      </Animated.View>
    )
  }

  render () {
    const { title } = this.props
    return (
      <View style={Styles.container} title={title}>
        {this.renderConfirmProductPhotosScreen()}
      </View>
    )
  }
}

const enhance = compose(
  withAuth,
  withProductCreate,
  withProductUpdate,
  withProductTouch,
  graphql(sharedQueries.productData, {
    name: 'productData',
    options: (props) => {
      return {
        variables: {
          query: { upcFormats: props.barcode }
        }
      }
    }
  }),
  withPropsOnChange(['auth'], ({ auth }) => {
    return {}
  }),
  withPropsOnChange(
    (props, nextProps) =>
      nextProps.barcode && props.barcode !== nextProps.barcode && !_get(nextProps, 'productData.loading', true),
    ({ productData, ...restProps }) => {
      const product = pathOr({}, ['productQuery', (productData.productQuery || []).length - 1], productData)
      return {
        product,
        matchCount: 1
      }
    }
  )
)

export default enhance(Index)
