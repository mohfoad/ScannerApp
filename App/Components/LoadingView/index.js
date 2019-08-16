import React from 'react'
import PropTypes from 'prop-types'
import { ActivityIndicator, View } from 'react-native'
import Styles, { activityIndicatorColor } from './styles'

export default class LoadingView extends React.Component {
    render () {
        return (
            <View style={[Styles.container, this.props.style]}>
                <ActivityIndicator size={'large'} color={activityIndicatorColor} />
            </View>
        )
    }
}
