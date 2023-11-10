import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Spinner } from 'native-base';
import { connect } from 'react-redux';
import axios from 'axios';
import Cart from './../../shop-stories/screens/Cart';
import { retrieveCart } from './../../common/shop/shopActions';
import ShopHeader from './../../common/shop/components/ShopHeader/ShopHeader';
import i18n from '../../common/i18n';
import ShopLoginModal from './../../common/shop/components/ShopLoginModal';
import { loginCustomer } from './../../common/shop/shopCustomerAuth/actions';
import { baseShopServerApi } from '../../common/appConstants';
import { SECONDARY_COLOR } from '../../utilities/Theme';
import EmptyComponent from '../../common/components/EmptyComponent';

const http = axios.create({
    baseURL: baseShopServerApi,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});

interface Props {
    screenProps: any;
    retrieveCart: Function;
    cart: any;
    navigation: any;
    loginCustomer: Function;
    cartSettings: any;
}
interface State {
    cartItems: any;
    ready: boolean;
    showLoginModal: boolean;
    isLoggedIn: boolean;
}

export class CartContainer extends Component<Props, State> {

    storeUnSubscribe: Function = null;
    state = {
        cartItems: this.props.cart.cart.products,
        ready: false,
        showLoginModal: false,
        isLoggedIn: false,
    }

    static navigationOptions = {
        drawerLabel: EmptyComponent,
    };

    _setLoginModalVisibility(visibility: boolean) {
        this.setState({ showLoginModal: visibility });
    }

    componentWillMount() {
        this.props.retrieveCart();

        this.setState({ cartItems: this.props.cart.cart.products });

        const { store } = this.props.screenProps;
        this.checkIfCustomerLoggedIn();

        this.storeUnSubscribe = store.subscribe(() => {

            let cart = store.getState().cart.cart;

            let isLoggedIn = store.getState().shopCustomerAuth.isLoggedIn;

            let cartItems = cart.products || [];

            this.setState({ cartItems: cartItems, isLoggedIn });

        });
    }

    checkIfCustomerLoggedIn() {
        const { screenProps: { store }, loginCustomer } = this.props;

        let shopToken = store.getState().shopAuth.shopAuthData.access_token;
        http.get('account', {
            headers: {
                Authorization: `Bearer ${shopToken}`
            }
        }).then(({ data }) => {
            if (data.success) {
                this.setState({ ready: true });
                loginCustomer(data.data);
            } else {
                this.setState({ showLoginModal: true });
            }
        }).catch(() => {
            //this.setState({ showLoginModal: true });
        });
    }

    componentWillUnmount() {
        this.storeUnSubscribe();
    }

    render() {
        const { navigation, screenProps: { store } } = this.props;

        let page = navigation.getParam('page') || 'checkout';

        if (!this.state.ready) {
            <View style={styles.container}>
                <ShopHeader navigation={navigation} />
                <Spinner color={SECONDARY_COLOR} style={{ flex: 1, alignSelf: 'center' }} />
            </View>
        }

        return (
            <View style={styles.container}>
                <ShopHeader navigation={navigation} />
                <Text style={styles.cartTitle}>{i18n.t('shop.cart_title')}</Text>
                <Cart
                    navigation={navigation}
                    setModalVisibility={(value: boolean) => this._setLoginModalVisibility(value)}
                    isLoggedIn={this.state.isLoggedIn}
                    store={store}
                    items={this.state.cartItems} />

                {
                    page !== "cart" ?
                        <ShopLoginModal
                            navigation={navigation}
                            setModalVisibility={(value: boolean) => this._setLoginModalVisibility(value)}
                            visible={this.state.showLoginModal}
                            store={store} /> : null
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cartTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        marginTop: 15,
        marginBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
    }
});

const mapDispatchToProps = (dispatch: Function) => {
    return {
        retrieveCart: () => dispatch(retrieveCart()),
        loginCustomer: (userDate: any) => dispatch(loginCustomer(userDate)),
    };
}

const mapStateToProps = (state: any) => {
    const { cart, cartSettings } = state;
    return { cart, cartSettings };
}

export default connect(mapStateToProps, mapDispatchToProps)(CartContainer);
