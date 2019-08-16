import React from 'react';
import EnterCodeScreen from './index';
import {connect} from 'react-redux';
import {withAuth} from '../../GraphQL/Account/decorators'

class EnterCodeScreenWrapper extends React.Component {
    render() {
        return <EnterCodeScreen {...this.props} />
    }
}

const mapStateToProps = (state) => {
    return {
    }
};

const mapDispatchToProps = (dispatch) => ({});

export default withAuth(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(EnterCodeScreenWrapper)
);
