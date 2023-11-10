import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import CartItem from './components/CartItem';
import { updateCartItem, removeCartItem } from './../../../common/shop/shopActions';
import { HEIGHT, PRIMARY_COLOR, LIGHT_GREY_1 } from '../../../utilities/Theme';
import { Button } from 'native-base';
import Addresses, { CALLBACK_ENUMS_ADDRESSES } from './components/Addresses';
import { fetchShippingAddressses, fetchPaymentAddressses, selectShippingAddress, selectPaymentAddress } from './../../../shop-containers/CartContainer/actions';
import i18n from '../../../common/i18n';
import Loader from '../../../common/components/Loader';

const CALLBACK_ENUMS = {
    ...CALLBACK_ENUMS_ADDRESSES
};

interface Props {
    items: any;
    store: any;
    updateCartItem: Function;
    removeCartItem: Function;
    isLoggedIn: boolean;
    setModalVisibility: Function;
    cartSettings: any;
    cart: any;
    fetchShippingAddressses: Function;
    fetchPaymentAddressses: Function;
    selectShippingAddress: Function;
    selectPaymentAddress: Function;
    navigation: any;
}
interface State {
    selectedPaymentAddress: string;
    selectedShippingAddress: string;
    selectedShippingMethod: string;
    selectedPaymentMethod: string;
    shippingAddresses: any;
    paymentAddresses: any;
    isLoading: boolean;
}

export class Cart extends Component<Props, State> {

    storeUnSubscribe: Function;

    state = {
        selectedPaymentAddress: '',
        selectedShippingAddress: '',
        selectedShippingMethod: '',
        selectedPaymentMethod: '',
        shippingAddresses: [],
        paymentAddresses: [],
        isLoading: this.props.cart.isLoading,
    }

    viewCallback(type: string, data: any) {

        const { selectShippingAddress, selectPaymentAddress } = this.props;

        switch (type) {
            case CALLBACK_ENUMS.SELECT_SHIPPING_ADDRESS:
                this.setState({ selectedShippingAddress: data.address_id });
                selectShippingAddress(data);
                break;
            case CALLBACK_ENUMS.SELECT_PAYMENT_ADDRESS:
                this.setState({ selectedPaymentAddress: data.address_id });
                selectPaymentAddress(data);
                break;
        }

    }

    componentWillMount() {
        const { store, fetchPaymentAddressses, fetchShippingAddressses } = this.props;

        fetchShippingAddressses();
        fetchPaymentAddressses();

        this.setCartSettings();

        this.storeUnSubscribe = store.subscribe(() => {
            this.setCartSettings();

            let state = store.getState();

            let isLoading = state.cart.isLoading || state.cartSettings.isLoading;

            this.setState({ isLoading });

        });
    }

    setCartSettings() {
        const { store } = this.props;

        let cartSettings = store.getState().cartSettings;

        this.setState({
            selectedPaymentAddress: Object.keys(cartSettings.paymentAddresses).length === 0 ? '' : cartSettings.paymentAddresses.address_id,
            selectedShippingAddress: Object.keys(cartSettings.shippingAddresses).length === 0 ? '' : cartSettings.shippingAddresses.address_id,
            selectedShippingMethod: Object.keys(cartSettings.shippingMethods).length === 0 ? '' : cartSettings.shippingMethods.code,
            selectedPaymentMethod: Object.keys(cartSettings.paymentMethods).length === 0 ? '' : cartSettings.paymentMethods.code,
            shippingAddresses: Object.keys(cartSettings.shippingAddresses).length === 0 ? [] : cartSettings.shippingAddresses.addresses,
            paymentAddresses: Object.keys(cartSettings.paymentAddresses).length === 0 ? [] : cartSettings.paymentAddresses.addresses,
        });
    }

    _updateItem(item:any) {
        this.props.updateCartItem(item);
    }

    _removeItem(item: any) {
        this.props.removeCartItem(item);
    }

    _renderCartItem(item: any) {
        return (
            <CartItem
                key={item.key}
                updateItem={this._updateItem.bind(this)}
                removeItem={this._removeItem.bind(this)}
                item={item} />
        );
    }

    _renderCartContent() {

        const { navigation } = this.props;
        let page = navigation.getParam('page') || 'checkout';

        if (typeof this.props.items === 'undefined' || this.props.items.length === 0) {
            return (
                <Text style={{ alignSelf: 'center', fontFamily: "Montserrat-Regular" }}>{i18n.t('shop.empty_cart_text')}</Text>
            );
        } else if (typeof this.props.items !== 'undefined' && this.props.items.length > 0 && page === "checkout") {
            return (
                <ScrollView>
                    <Addresses
                        viewCallback={this.viewCallback.bind(this)}
                        shippingAddresses={this.state.shippingAddresses}
                        paymentAddresses={this.state.paymentAddresses}
                        shippingAddress={this.state.selectedShippingAddress}
                        paymentAddress={this.state.selectedPaymentAddress} />
                    {this.props.items.map((item: any, index: number) => this._renderCartItem(item))}
                </ScrollView>
            );
        } else if (typeof this.props.items !== 'undefined' && this.props.items.length > 0 && page === "cart") {
            return (
                <ScrollView>
                    {this.props.items.map((item: any, index: number) => this._renderCartItem(item))}
                </ScrollView>
            );
        }
    }

    _cartMethods() {
        if (!this.props.isLoggedIn) {
            this.props.setModalVisibility(true);
            return;
        } else {
            this.props.navigation.navigate('cartMethods');
        }
    }

    _checkout() {
        this.props.navigation.push('cart');
    }

    componentWillUnmount() {
        this.storeUnSubscribe();
    }

    render() {
        const { selectedPaymentAddress, selectedShippingAddress } = this.state;
        const { navigation } = this.props;
        let page = navigation.getParam('page') || 'checkout';
        return (
            <View style={styles.container}>
                {!this.state.isLoading || <Loader />}

                {this._renderCartContent()}

                {
                    typeof this.props.items !== 'undefined' && this.props.items.length > 0 && page === "checkout" ?
                        <View style={styles.proceedButtonWrapper}>
                            <Button full
                                style={!this.props.isLoggedIn && selectedPaymentAddress !== "" && selectedShippingAddress !== "" ? styles.proceedButtonDisabled : styles.proceedButton}
                                onPress={() => this._cartMethods()}
                                disabled={!this.props.isLoggedIn && selectedPaymentAddress !== "" && selectedShippingAddress !== ""}>
                                <Text style={styles.buttonText}>{i18n.t('shop.proceed_to_shipping_payment_methods_text').toUpperCase()}</Text>
                            </Button>
                        </View> : null
                }

                {
                    page !== "checkout" && typeof this.props.items !== 'undefined' && this.props.items.length > 0?
                        <View style={styles.proceedButtonWrapper}>
                            <Button full
                                style={styles.proceedButton}
                                onPress={() => this._checkout()}
                                disabled={!this.props.isLoggedIn && selectedPaymentAddress !== "" && selectedShippingAddress !== ""}>
                                <Text style={styles.buttonText}>{i18n.t('shop.checkout_btn').toUpperCase()}</Text>
                            </Button>
                        </View> : null
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContainer: {
        flex: 1,
        minHeight: HEIGHT
    },
    proceedButtonWrapper: {
        flex: 0,
    },
    proceedButton: {
        backgroundColor: PRIMARY_COLOR,
    },
    proceedButtonDisabled: {
        backgroundColor: LIGHT_GREY_1,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Montserrat-SemiBold',
    }
});

const mapStateToProps = (state: any) => {
    const { cart, cartSettings } = state;
    return { cart, cartSettings };
}

const mapDispatchToProps = (dispatch: Function) => {
    return {
        updateCartItem: (item: any) => dispatch(updateCartItem(item)),
        removeCartItem: (item: any) => dispatch(removeCartItem(item)),
        fetchShippingAddressses: () => dispatch(fetchShippingAddressses()),
        fetchPaymentAddressses: () => dispatch(fetchPaymentAddressses()),
        selectShippingAddress: (address: any) => dispatch(selectShippingAddress(address)),
        selectPaymentAddress: (address: any) => dispatch(selectPaymentAddress(address)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
