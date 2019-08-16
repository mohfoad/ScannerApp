import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, ActivityIndicator, StatusBar, ScrollView} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { compose, withPropsOnChange } from 'recompose';
import { get as _get } from 'lodash';

import { withAuth, withCreateAccount, withLogin } from '../../GraphQL/Account/decorators';
import withApollo from '../../Decorators/withApollo';
import { CustomHeader } from '../../Components/CustomHeader';
import { Images } from '../../Themes';

import styles from './styles';

const messages1 = [];

const messages2 = [
    {
        upc: '0011110896872',
        labelName: 'Krogera? Black Beans; 2/9/17 2:32pm',
        imageUrl: Images.product_image,
        status: 'Product Rejected',
        description: 'The picture was over-exposed (too much light), and taken at the wrong angle.  '
    },
    {
        upc: '0011110896872',
        labelName: 'Krogera? Black Beans; 2/9/17 2:32pm',
        imageUrl: Images.product_image,
        status: 'Product Rejected',
        description: 'The picture was over-exposed (too much light), and taken at the wrong angle.  '
    }
];

class MessagesScreen extends Component {
    static propsTypes = {

    };

    constructor(props) {
        super(props);

        this.state = {}
    }

    handleClose = () => {
        this.props.navigation.goBack();
    };

    render() {

        StatusBar.setBarStyle('dark-content', true);
        return (
            <Animatable.View style={styles.container}>
                <CustomHeader
                    title={'Your Messages'}
                    onClose={this.handleClose}
                />
                <Animatable.View style={styles.innerContainer}>
                    <TouchableOpacity style={styles.messageSupport}>
                        <Animatable.Text style={styles.messageSupportText}>MESSAGE SUPPORT</Animatable.Text>
                    </TouchableOpacity>
                    <Animatable.Text style={styles.messageNumText}>Your Messages ({messages2.length})</Animatable.Text>
                </Animatable.View>
                <ScrollView style={styles.messageDetail}>
                    {
                        messages2.length === 0 ?
                            <Animatable.View style={styles.emptyBox}>
                                <Animatable.View style={styles.emptyMessageImageWrapper}>
                                    <Animatable.Image style={{ width: '100%', height: '100%' }} source={Images.not_found} />
                                </Animatable.View>
                                <Animatable.Text style={styles.emptyMessage}>No Messages Currently</Animatable.Text>
                            </Animatable.View> :
                            messages2.map((product, index) => {
                                return (
                                    <Animatable.View key={index} style={styles.productContainer}>
                                        <Animatable.View style={styles.rowDetail}>
                                            <Animatable.View style={styles.detail}>
                                                <Animatable.Text style={styles.productUpc}>{product.upc}</Animatable.Text>
                                                <Animatable.Text style={styles.productLabelName}>{product.labelName}</Animatable.Text>
                                            </Animatable.View>
                                            <TouchableOpacity style={styles.clearButtonWrapper}>
                                                <Animatable.Text style={styles.clearButtonText}>clear</Animatable.Text>
                                            </TouchableOpacity>
                                        </Animatable.View>
                                        <Animatable.View style={styles.reason}>
                                            <Animatable.Text style={styles.reasonTitle}>{product.status}</Animatable.Text>
                                            <Animatable.Text style={styles.reasonDescription}>{product.description}</Animatable.Text>
                                        </Animatable.View>
                                        <Animatable.View style={styles.productImageWrapper}>
                                            <Animatable.Image style={{ width: '100%', height: '100%' }} source={product.imageUrl} />
                                        </Animatable.View>
                                    </Animatable.View>
                                )
                            })
                    }
                </ScrollView>
            </Animatable.View>
        )
    }
}

const enhance = compose(
    withAuth,
    withPropsOnChange(
        (props, nextProps) =>
            _get(props, 'auth.session.isAuthenticated', false) !== _get(nextProps, 'auth.session.isAuthenticated', false),
        ({ auth }) => ({ isAuthenticated: _get(auth, 'session.isAuthenticated', false) })
    ),
    withLogin,
    withCreateAccount,
);

export default enhance(MessagesScreen);

