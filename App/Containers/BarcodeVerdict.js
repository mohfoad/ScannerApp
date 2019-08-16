import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { compose, withPropsOnChange } from 'recompose'
import { connect } from 'react-redux'
import _ from 'lodash'
import Immutable from 'seamless-immutable'

import { withAuth } from '../GraphQL/Account/decorators'
import { withUpcData } from '../Decorators/withData'
import { makeVariations } from '../Utils/Styles'
import { Metrics, Colors, Fonts } from '../Themes'
import { MODE_ENUM } from '../Redux/SageRedux'
import AlertActions from '../Redux/AlertRedux'
import CloseButton from '../Components/CloseButton'
import Button from '../Components/Button'
import InlineSelect from '../Components/InlineSelect'

const PACKAING_TYPES_OPTIONS = [
  { key: 'box', label: 'Box' },
  { key: 'can', label: 'Can' },
  { key: 'wrapper', label: 'Wrapper' }
]

const YES_NO_OPTIONS = [{ key: true, label: 'Yes' }, { key: false, label: 'No' }]

const LABEL_FORMAT_OPTIONS = [
  { key: null, label: 'No Nutrition' },
  { key: 'current', label: 'Old' },
  { key: 'future', label: 'New' }
]

const DEFAULT_DATA = Immutable({ _isNull: true, upc: null, storeStatus: 'none' })

class BarcodeVerdict extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    barcode: PropTypes.string,
    noCloseButton: PropTypes.bool,

    // global redux mode can be overwritten
    mode: PropTypes.oneOf(Object.keys(MODE_ENUM)),

    // from decorators:

    data: PropTypes.shape({
      name: PropTypes.string,
      brand: PropTypes.string,
      upc: PropTypes.string,
      storeStatus: PropTypes.oneOf(['pending', 'cart', 'done', 'none']).isRequired
    }).isRequired,
    updateUpc: PropTypes.func.isRequired,

    mode: PropTypes.oneOf(Object.keys(MODE_ENUM)).isRequired,
    alertPopulate: PropTypes.func.isRequired
  }

  async update(diff) {
    let { mode, data, updateUpc } = this.props

    if (data._isNull) {
      data = _.omit(data, ['_isNull'])
      if (data.storeStatus === 'none') data.storeStatus = 'pending'
      await updateUpc(data)
    }

    if (mode === MODE_ENUM.photographer && data.storeStatus === 'cart') {
      diff = { storeStatus: 'pending', ...diff };
    }

    return updateUpc(diff)
  }

  handleAddToCart = async () => {
    const { alertPopulate, onClose } = this.props
    await this.update({ storeStatus: 'cart' })
    alertPopulate('Added to cart', 'success', 'Status')
    onClose()
  }

  handleNotInStock = async () => {
    const { alertPopulate, onClose, auth } = this.props
    await this.update({
      outOfStock: {
        store: auth.session.user.photoEntry.store,
        date: new Date().toISOString(),
        user: auth.session.user._id
      }
    })
    alertPopulate('Marked as out of stock', 'success', 'Status')
    onClose()
  }

  renderPhotographerMode() {
    const {
      data: { storeStatus, payload = {} },
      onClose,
      doneOverride
    } = this.props

    const getQuestionHandler = (key) => (value) =>
      payload[key] === value ? null : this.update({ payload: { ...payload, [key]: value } })

    // const isDone = storeStatus === 'done'
    const isDone = doneOverride

    return (
      <View style={{ flex: 1 }}>
        {!isDone ? null : (
          <View style={Styles.warningContainer}>
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>❕</Text>
            <Text style={Styles.warningText}>
              Product has been photographed.
              {'\n'}
              Retake images if necessary.
            </Text>
          </View>
        )}
        <View style={Styles.question_row}>
          <Text style={Styles.questionHeader_row}>Supplement Facts Panel?</Text>
          <InlineSelect
            value={payload.isSupplement}
            options={YES_NO_OPTIONS}
            onChange={getQuestionHandler('isSupplement')}
            style={{ flex: 1 }}
          />
        </View>

        <View style={Styles.question}>
          <Text style={Styles.questionHeader}>Nutrition Label Format?</Text>
          <InlineSelect
            value={payload.nutritionLabelFormat}
            options={LABEL_FORMAT_OPTIONS}
            onChange={getQuestionHandler('nutritionLabelFormat')}
            style={{ flex: 0 }}
          />
        </View>

        <View style={Styles.question_row}>
          <Text style={Styles.questionHeader_row}>Dual-panel label?</Text>
          <InlineSelect
            value={payload.dualPanel}
            options={YES_NO_OPTIONS}
            onChange={getQuestionHandler('dualPanel')}
            style={{ flex: 1 }}
          />
        </View>

        <View style={Styles.question_row}>
          <Text style={Styles.questionHeader_row}>More than one NFP{'\n'}on the package?</Text>
          <InlineSelect
            value={payload.multiplePanels}
            options={YES_NO_OPTIONS}
            onChange={getQuestionHandler('multiplePanels')}
            style={{ flex: 1 }}
          />
        </View>

        <View style={{ flex: 1 }} />

        <Button
          center
          dark
          disabled={
            payload.isSupplement == null ||
            payload.multiplePanels == null ||
            payload.dualPanel == null ||
            payload.nutritionLabelFormat === undefined
          }
          onPress={onClose}
          style={{ marginBottom: Metrics.doubleBaseMargin }}
        >
          {isDone ? 'Retake' : 'Take Photos'}
        </Button>
      </View>
    )
  }

  renderRunnerMode() {
    const { data, onClose, doneOverride = false } = this.props

    const AddToCartButton = (
      <Button center inverted onPress={this.handleAddToCart}>
        Add to cart
      </Button>
    )

    const CloseButton = (
      <Button center dark onPress={onClose}>
        Close
      </Button>
    )

    const description = (heading, subHeading, info) => (
      <View style={Styles.description}>
        <Text style={Styles.heading}>{heading}</Text>
        {!subHeading ? null : <Text style={Styles.subHeading}>{subHeading}</Text>}
      </View>
    )

    let outOfStockMessage = null
    if (data.outOfStock) {
      outOfStockMessage = ['This was Out of Stock']
      if (data.outOfStock.date) {
        const arr = new Date(data.outOfStock.date).toString().split(' ')
        outOfStockMessage.push(
          'on ' +
            [
              ...arr.slice(0, 3),
              arr[4]
                .split(':')
                .slice(0, -1)
                .join(':')
            ].join(' ')
        )
      }
      if (_.get(data.outOfStock, 'user.displayName')) {
        outOfStockMessage.push(`by ${data.outOfStock.user.displayName}`)
      }
      if (data.outOfStock.store) outOfStockMessage.push(`in ${data.outOfStock.store}`)
      outOfStockMessage = outOfStockMessage.join('\n')
    }

    // console.log('barcode verdict data and doneOverride', data, doneOverride)
    return (
      <View style={{ flex: 1 }}>
        {doneOverride
          ? description('Product captured', 'Do not add to cart')
          : data.storeStatus === 'pending'
          ? description('Add to Cart', outOfStockMessage)
          : data.storeStatus === 'cart'
          ? description('In Cart', 'Pending photography')
          : data.storeStatus === 'done'
          ? description('Product captured', 'Do not add to cart')
          : description('Add to Cart', outOfStockMessage)}
        {data.storeStatus === 'pending' && !doneOverride ? (
          <View style={{ marginTop: Metrics.doubleBaseMargin }}>
            <Button center red onPress={this.handleNotInStock}>
              Out of Stock
            </Button>
            <View style={{ height: 40 }} />
            {AddToCartButton}
          </View>
        ) : data.storeStatus === 'none' || doneOverride ? (
          <View style={{ marginTop: Metrics.doubleBaseMargin }}>
            {AddToCartButton}
            <View style={{ height: 40 }} />
            {CloseButton}
          </View>
        ) : (
          CloseButton
        )}
      </View>
    )
  }

  renderDatapoints() {
    const { data } = this.props

    const datapoints = [
      ['UPC', data.upc],
      ['Label Name', data.labelName],
      ['Category', data.category],
      ['Subcategory', data.subcategory],
      ['Location', !data.location ? null : `${data.location.aisle} - ${_.capitalize(data.location.side)}`]
    ].filter((x) => x[1])

    return (
      <View style={{ marginTop: Metrics.doubleBaseMargin }}>
        {datapoints.map(([label, value]) => (
          <View key={`${label}${value}`} style={{ flexDirection: 'row' }}>
            <Text style={{ color: 'white', fontWeight: 'bold', width: 100 }}>{label}:</Text>
            <Text style={{ color: 'white' }}>{value}</Text>
          </View>
        ))}
      </View>
    )
  }

  render() {
    const { data, onClose, mode, noCloseButton, style, doneOverride = false } = this.props

    if (!data) return null

    const isDone = data.storeStatus === 'done'
    const isNone = data.storeStatus === 'none'
    const isPhotographer = mode === MODE_ENUM.photographer

    return (
      <View
        style={[
          isPhotographer
            ? Styles.root_photographer
            : doneOverride
            ? Styles['root_none']
            : isNone && !doneOverride
            ? Styles['root_pending']
            : Styles['root_' + data.storeStatus],
          isDone && Styles.root_none,
          style,
          { paddingTop: Metrics.doubleBasePadding }
        ]}
      >
        {noCloseButton ? null : (
          <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginTop: Metrics.doubleBaseMargin }}>
            <CloseButton onPress={onClose} />
          </View>
        )}
        <View style={[Styles.nameHeader, isPhotographer && { marginTop: Metrics.doubleBaseMargin }]}>
          <Text style={Styles.name} numberOfLines={2}>
            {data.name}
          </Text>
          {!data.brand ? null : (
            <Text style={Styles.brand} numberOfLines={1}>
              by {data.brand}
            </Text>
          )}
          {this.renderDatapoints()}
        </View>
        {isPhotographer ? this.renderPhotographerMode() : mode === MODE_ENUM.runner ? this.renderRunnerMode() : null}
      </View>
    )
  }
}

export default compose(
  connect(
    ({ sage: { mode: reduxMode, barcode: reduxBarcode, tag } }, { barcode, mode }) => ({
      mode: mode || reduxMode,
      upc: barcode || reduxBarcode,
      tag
    }),
    {
      alertPopulate: AlertActions.alertPopulate
    }
  ),
  withUpcData,
  withAuth
)(BarcodeVerdict)

const Styles = StyleSheet.create({
  ...makeVariations(
    [
      'root_pending',
      {
        position: 'absolute',
        zIndex: 1000,
        top: -Metrics.statusBarHeight,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: Colors.green,
        paddingTop: Metrics.statusBarHeight,
        paddingBottom: Metrics.baseMargin
      }
    ],
    ['root_cart', { backgroundColor: Colors.yellowAccent }],
    ['root_done', { backgroundColor: Colors.blue }],
    ['root_none', { backgroundColor: Colors.magenta }],
    [
      'root_photographer',
      {
        backgroundColor: Colors.blue
      }
    ]
  ),
  description: {
    flex: 1,
    paddingTop: Metrics.doubleBaseMargin,
    paddingHorizontal: 20
  },
  ...makeVariations(
    [
      'question',
      {
        flex: 0,
        marginBottom: Metrics.baseMargin * 2,
        marginHorizontal: Metrics.doubleBaseMargin
      }
    ],
    [
      'question_row',
      {
        flexDirection: 'row',
        alignItems: 'center'
      }
    ]
  ),
  ...makeVariations(
    [
      'questionHeader',
      {
        ...Fonts.style.heading,
        flex: 0,
        marginBottom: Metrics.baseMargin,
        color: Colors.white
      }
    ],
    [
      'questionHeader_row',
      {
        marginBottom: 0,
        maxWidth: 250,
        marginRight: Metrics.baseMargin
      }
    ]
  ),
  nameHeader: {
    backgroundColor: Colors.transparentGray,
    padding: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin
  },
  name: {
    ...Fonts.style.big,
    color: Colors.white,
    textAlign: 'center'
  },
  brand: {
    ...Fonts.style.normal,
    color: Colors.white,
    textAlign: 'center',
    marginTop: 10
  },
  upc: {
    ...Fonts.style.normal,
    color: Colors.white,
    textAlign: 'center',
    marginTop: Metrics.baseMargin
  },
  heading: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: Fonts.size.h1,
    textAlign: 'center'
  },
  subHeading: {
    color: Colors.white,
    fontSize: Fonts.size.h3,
    marginTop: Metrics.baseMargin,
    textAlign: 'center'
  },
  warningContainer: {
    flexDirection: 'row',
    marginBottom: Metrics.baseMargin,
    justifyContent: 'center'
  },
  warningText: {
    ...Fonts.style.medium,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})
