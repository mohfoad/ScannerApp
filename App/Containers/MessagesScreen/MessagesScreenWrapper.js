import React from 'react';
import {connect} from 'react-redux'
import MessagesScreen from './index';

class MessagesScreenWrapper extends React.Component {
    render() {
        return <MessagesScreen {...this.props} />
    }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MessagesScreenWrapper)
