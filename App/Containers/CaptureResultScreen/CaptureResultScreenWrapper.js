import React, { Component } from 'react';
import { connect } from 'react-redux';
import CaptureResultScreen from './index';

class CaptureResultScreenWrapper extends Component {
    render() {
        const { navigation } = this.props;
        return (
            <CaptureResultScreen
                navigation={navigation}
            />
        )
    }
}

const mapStateToProps = (state) =>({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CaptureResultScreenWrapper);
