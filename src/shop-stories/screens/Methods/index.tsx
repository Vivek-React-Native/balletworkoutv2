import React, { Component } from 'react';
import { View, StyleSheet, Text, Linking, ScrollView } from 'react-native';
import ShippingMethods, { CALLBACK_ENUMS_SHIPPING_METHOD } from './components/ShippingMethods';
import PaymentMethods, { CALLBACK_ENUMS_PAYMENT_METHOD } from './components/PaymentMethods';
import Loader from '../../../common/components/Loader';
import { SECONDARY_COLOR, PRIMARY_COLOR, LIGHT_GREY_1 } from '../../../utilities/Theme';
import { Left, CheckBox, Body, Button, Toast } from 'native-base';
import i18n from '../../../common/i18n';
import CartTotals from './components/CartTotals';
import axios from 'axios';
import { baseShopServerApi } from '../../../common/appConstants';

const CALLBACK_ENUMS = {
    ...CALLBACK_ENUMS_SHIPPING_METHOD,
    ...CALLBACK_ENUMS_PAYMENT_METHOD
};

interface Props {
    navigation: any;
    callbackHandler: Function;
    isLoading: boolean;
    store: any;
}
interface State {
    selectedShippingMethod: any;
    selectedPaymentMethod: any;
    shippingMethods: any;
    paymentMethods: any;
    paymentMethodAgree: string;
}

export default class Methods extends Component<Props, State> {

    unSubscribeStore: Function;

    state = {
        selectedShippingMethod: "",
        selectedPaymentMethod: "",
        shippingMethods: {},
        paymentMethods: {},
        paymentMethodAgree: "0",
    };

    componentWillMount() {
        const { store } = this.props;

        this.setCartSettings(false);
        this.unSubscribeStore = store.subscribe(() => {
            this.setCartSettings();
        });
    }

    setCartSettings(setShipping: boolean = true) {
        const { store } = this.props;
        let cartSettings = store.getState().cartSettings;
        this.setState({
            shippingMethods: Object.keys(cartSettings.shippingMethods).length === 0 ? [] : cartSettings.shippingMethods.shipping_methods,
            paymentMethods: Object.keys(cartSettings.paymentMethods).length === 0 ? [] : cartSettings.paymentMethods.payment_methods,
            selectedShippingMethod: Object.keys(cartSettings.shippingMethods).length === 0 ? "" : cartSettings.shippingMethods.code,
            selectedPaymentMethod: Object.keys(cartSettings.paymentMethods).length === 0 ? "" : cartSettings.paymentMethods.code,
        });
    }

    viewCallback(type: string, data: any) {
        switch (type) {
            case CALLBACK_ENUMS.SELECT_SHIPPING_METHOD:
                this.props.callbackHandler(type, data);
                break;
            case CALLBACK_ENUMS.SELECT_PAYMENT_METHOD:
                this.props.callbackHandler(type, data);
                break;
        }
    }

    handleClick = (url: string) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                // console.log("Don't know how to open URI: " + url);
            }
        });
    };

    proceedToPay() {

        const { store } = this.props;

        let shopToken = store.getState().shopAuth.shopAuthData.access_token;

        axios.post(baseShopServerApi + 'confirm', {}, {
            headers: {
                Authorization: `Bearer ${shopToken}`,
                "Content-Type": 'application/json',
            }
        }).then(({ data }) => {

            if (data.success) {
                if (this.state.selectedPaymentMethod === 'bank_transfer') {
                    this.bankTransferPutOrder();
                } else {
                    this.props.navigation.navigate('payment');
                }
            } else {
                Toast.show({
                    text: data.error,
                });
            }

        }).catch(({ response }) => {
            Toast.show({
                text: i18n.t('shop.server_error_while_confirm_order')
            });
        });
    }

    bankTransferPutOrder() {
        const { store } = this.props;

        let shopToken = store.getState().shopAuth.shopAuthData.access_token;

        axios.put(baseShopServerApi + 'confirm', {}, {
            headers: {
                Authorization: `Bearer ${shopToken}`,
                "Content-Type": 'application/json',
            }
        }).then(({ data }) => {

            if (data.success) {
                this.clearCart();
                this.props.navigation.navigate('orderPlaced', {
                    orderId: data.data.order_id,
                    paymentMethod: 'bank_transfer',
                });
            } else {
                Toast.show({
                    text: data.error,
                });
            }

        }).catch(({ response }) => {
            Toast.show({
                text: i18n.t('shop.server_error_while_confirm_order')
            });
        });
    }

    clearCart() {
        const { store } = this.props;

        let shopToken = store.getState().shopAuth.shopAuthData.access_token;
        axios.put(baseShopServerApi + 'confirm', {}, {
            headers: {
                Authorization: `Bearer ${shopToken}`,
                "Content-Type": 'application/json',
            }
        }).then(({ data }) => {

            if (!data.success) {
                Toast.show({
                    text: data.error,
                });
            }

        }).catch(({ response }) => {
            Toast.show({
                text: i18n.t('shop.server_error_while_confirm_order')
            });
        });
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    render() {
        const { store } = this.props;
        return (
            <View style={styles.container}>
                {!this.props.isLoading || <Loader color={SECONDARY_COLOR} />}
                <View style={styles.scrollViewWrapper}>
                    <ScrollView>
                        <ShippingMethods
                            viewCallback={this.viewCallback.bind(this)}
                            shippingMethod={this.state.selectedShippingMethod}
                            shippingMethods={this.state.shippingMethods} />

                        <PaymentMethods
                            viewCallback={this.viewCallback.bind(this)}
                            paymentMethod={this.state.selectedPaymentMethod}
                            paymentMethods={this.state.paymentMethods} />

                        <CartTotals store={store} />

                    </ScrollView>
                </View>

                <View style={styles.checkBoxContainer}>
                    <Left style={{ flex: 0.1 }}>
                        <CheckBox
                            color={SECONDARY_COLOR}
                            checked={this.state.paymentMethodAgree === "1"}
                            onPress={() => this.setState({ paymentMethodAgree: this.state.paymentMethodAgree === "1" ? "0" : "1" })} />
                    </Left>
                    <Body style={{ flex: 1 }}>
                        <Text style={styles.agreeText} >{i18n.t('shop.terms_and_condition_text_1')} <Text style={styles.termsLink} onPress={() => this.handleClick('http://tatevikballet.com/index.php?route=information/information&information_id=5')}>{i18n.t('shop.terms_and_condition_link_text')}</Text></Text>
                    </Body>
                </View>

                <View style={{ flex: 0 }}>
                    <Button
                        onPress={() => this.proceedToPay()}
                        style={this.state.paymentMethodAgree === "1" ? styles.paymentButton : styles.paymentButtonDisabled}
                        full
                        disabled={this.state.paymentMethodAgree !== "1"} >
                        <Text style={styles.paymentButtonText}>{i18n.t('shop.proceed_to_pay_button').toUpperCase()}</Text>
                    </Button>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    checkBoxContainer: {
        flex: 0,
        flexDirection: 'row',
        marginBottom: 15,
    },
    agreeText: {
        fontFamily: 'Montserrat-Regular'
    },
    checkboxWrapper: {
        alignItems: 'flex-start',
    },
    checkboxContentWrapper: {
        alignItems: 'flex-start',
    },
    scrollViewWrapper: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
    },
    paymentButton: {
        backgroundColor: PRIMARY_COLOR,
    },
    paymentButtonDisabled: {
        backgroundColor: LIGHT_GREY_1,
    },
    paymentButtonText: {
        color: '#fff',
        fontFamily: 'Montserrat-SemiBold'
    },
    termsLink: {
        color: PRIMARY_COLOR,
        fontFamily: 'Montserrat-SemiBold'
    },
});

export { CALLBACK_ENUMS as VIEW_CALLBACK_ENUMS };
