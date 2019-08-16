import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { compose } from 'recompose'
import _ from 'lodash'

import withApollo from '../../Decorators/withApollo'
import { withAuth } from '../../GraphQL/Account/decorators'
import toTitleCase from '../../Utils/toTitleCase'

import CloseButton from '../../Components/CloseButton'
import Button from '../../Components/Button'
import Storage from '../../Utils/Storage'

class Index extends PureComponent {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    prPartners: PropTypes.object.isRequired,
    prStores: PropTypes.object.isRequired,
    prUserUpdate: PropTypes.func.isRequired
  }

  state = {
    loading: true
  }

  async selectStore(store) {
    this.setState({ loading: true })
    await this.props.prUserUpdate({ store })
    this.setState({ loading: false })
    Storage.fetch() // doing this async. Also accessing Storage directly (instead of withData) to not pre-load data on init
  }

  async selectPartner(partner) {
    this.setState({ loading: true })
    await this.props.prUserUpdate({ partner })
    this.setState({ loading: false })
    Storage.fetch() // doing this async. Also accessing Storage directly (instead of withData) to not pre-load data on init
  }

  handleClose = () => this.props.navigation.navigate('StoreSelectorScreen', { transition: 'card' })

  render() {
    const { prStores, prPartners, auth } = this.props
    console.log('prpartners', prPartners)
    const current = _.get(auth, 'session.user.photoEntry.partner')
    return (
      <ScrollView style={Styles.root}>
        {current ? <CloseButton absolute onPress={this.handleClose} style={{ top: -40, right: -20 }} /> : null}
        <Text style={Styles.title}>Select your partner</Text>
        {_.sortBy(_.get(prPartners, 'result'), 'name').map(({ key, name }) => (
          <TouchableOpacity
            key={key}
            style={[Styles.store, current === key && Styles.storeSelected]}
            onPress={() => this.selectPartner(key)}
          >
            <Text style={Styles.storeText}>{toTitleCase(name)}</Text>
            <View style={{ flex: 1 }} />
            {/* <Text style={Styles.stateText}>
              {toTitleCase(city)}, {state}
            </Text> */}
          </TouchableOpacity>
        ))}

        <Button disabled={!current} center onPress={this.handleClose} style={{ marginVertical: Metrics.baseMargin }}>
          Done
        </Button>
      </ScrollView>
    )
  }
}

export default compose(
  withAuth,
  withApollo('query prStores', null, null, null, { renderLoading: 'default', fetchPolicy: 'network-only' }),
  withApollo('query prPartners', null, null, null, { renderLoading: 'default', fetchPolicy: 'network-only' }),
  withApollo(
    'mutation prUserUpdate',
    { store: 'String', partner: 'String' },
    '... Session',
    require('../../GraphQL/Account/fragments/session').default
  )
)(Index)

import { StyleSheet } from 'react-native'
import { Metrics, Colors, Fonts } from '../../Themes'

const Styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.primary,
    paddingTop: Metrics.navBarHeight,
    height: Metrics.screenHeight,
    padding: Metrics.doubleBaseMargin
  },
  title: {
    ...Fonts.style.bigHeading,
    textAlign: 'center',
    marginBottom: Metrics.doubleBaseMargin * 2,
    color: 'white'
  },
  store: {
    flexDirection: 'row',
    padding: Metrics.baseMargin * 1.5,
    backgroundColor: 'white',
    marginBottom: Metrics.baseMargin * 1.5,
    borderRadius: 4
  },
  storeSelected: {
    backgroundColor: Colors.secondary
  },
  storeText: {
    fontWeight: 'bold'
  },
  stateText: {
    ...Fonts.style.small
  }
})
