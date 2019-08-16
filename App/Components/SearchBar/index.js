import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import Styles from './styles'
import { Colors, Metrics } from '../../Themes'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default class SearchBar extends React.Component {
    static propTypes = {
        onSearch: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        searchTerm: PropTypes.string
    }

    render () {
        const { onSearch, onCancel, searchTerm } = this.props
        const onSubmitEditing = () => onSearch(searchTerm)
        return (
            <View style={Styles.container}>
                <Icon name='search' size={Metrics.icons.tiny} style={Styles.searchIcon} />
                <TextInput
                    ref='searchText'
                    autoFocus
                    placeholder='Search'
                    placeholderTextColor={Colors.white}
                    underlineColorAndroid='transparent'
                    style={Styles.searchInput}
                    value={this.props.searchTerm}
                    onChangeText={onSearch}
                    autoCapitalize='none'
                    onSubmitEditing={onSubmitEditing}
                    returnKeyType={'search'}
                    autoCorrect={false}
                    selectionColor={Colors.white}
                />
                <TouchableOpacity onPress={onCancel} style={Styles.cancelButton}>
                    <Text style={Styles.buttonLabel}>Cancel</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
