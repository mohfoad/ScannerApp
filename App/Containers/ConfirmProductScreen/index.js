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
import { withProductCreate, withProductUpdate } from '../../GraphQL/Shared/decorators'
import * as sharedQueries from '../../GraphQL/Shared/queries'

// Styles
import Styles from '../Styles/ConfirmProductScreenStyles'

const ProgressImage = createImageProgress(Image)
const progressIndicatorProps = {
  size: 20,
  indeterminate: true,
  color: Colors.secondary,
  borderWidth: 2
}

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      index: 0,
      shown: false
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

  handlePressConfirmProduct = () => {
    this.props.navigation.navigate('ConfirmProductPhotosScreen', {
      barcode: this.props.barcode,
      transition: 'slideInTransition'
    })
  };

  handlePressNewProduct = () => {
    this.props.navigation.navigate('NewProductScreen', {
      barcode: this.props.barcode,
      transition: 'slideInTransition'
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
          duration={600}
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

  renderConfirmProductScreen () {
    const { matchCount, product } = this.props

    const source = pathOr(null, ['image', 'thumbnail'], product)
    const mediaList = pathOr([], ['mediaList'], product)
    const nowDate = Date.now()
    const touchDate = Date.parse(product.lastTouchedDate) || Date.now()
    const oneMonth = 2628000000
    const sixMonths = oneMonth * 6
    const shouldUpdate = touchDate + sixMonths < nowDate
    const lastTouchedHumanReadable = product.lastTouchedDate ? dateFormat(touchDate, 'mmmm d, yyyy') : 'never'

    return (
      <Animated.View style={Styles.container}>
        <View style={Styles.form}>
          <Text style={Styles.boldLabel}>
            {matchCount} {matchCount === 1 ? `MATCH FOUND` : `MATCHES FOUND`}
          </Text>
          <Text style={Styles.label}>
            {matchCount === 1
              ? `This product matches an existing scan`
              : `This product matches multiple existing scans`}
          </Text>
          <View style={Styles.productCard}>
            <View style={Styles.productNameRow}>
              <View style={Styles.productNameThumbWrapper}>
                {source ? (
                  <ProgressImage
                    indicator={ProgressCircle}
                    indicatorProps={progressIndicatorProps}
                    source={{ uri: source }}
                    style={Styles.productNameThumb}
                    useNativeDriver
                    resizeMode='cover'
                    animation={Transitions.pulseFadeIn}
                    duration={600}
                  />
                ) : (
                  this.renderProductText(product.name)
                )}
              </View>
              <View style={Styles.productNameLabelWrapper}>
                <Text style={Styles.productNameLabel}>{product.name}</Text>
                <Text style={Styles.productBrandLabel}>{product.bandID}</Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[Styles.section, Styles.productPhotosContainer]}
            >
              {this.renderPhotos()}
            </ScrollView>
            <View style={Styles.photoCountWrapper(shouldUpdate)}>
              <Text style={Styles.numberOfPhotosText}>{`${mediaList.length} PHOTO${
                mediaList.length > 1 ? 'S' : ''
              } TOTAL`}</Text>
              <Text style={Styles.shouldUpdateText}>{`${
                shouldUpdate ? 'Needs recapture - ' : ''
              }Last updated ${lastTouchedHumanReadable}`}</Text>
            </View>
          </View>
          <Button
            style={Styles.confirmProductButton}
            onPress={this.handlePressConfirmProduct}
            text={'Existing product'}
            image={Images.existingProduct}
            dark
          />
          <Button
            style={Styles.newProductButton}
            onPress={this.handlePressNewProduct}
            text={'New product'}
            image={Images.newProduct}
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
        {this.renderConfirmProductScreen()}
      </View>
    )
  }
}

const enhance = compose(
  withAuth,
  withProductCreate,
  withProductUpdate,
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
      const matchCount = pathOr([], ['productQuery'], productData).length
      return {
        product,
        matchCount
      }
    }
  )
)

export default enhance(Index)
