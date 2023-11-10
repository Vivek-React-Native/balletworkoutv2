import React, { Component } from 'react';
import { WebView, View } from 'react-native';
import { Toast } from 'native-base';
import { baseShopServerApi } from '../../common/appConstants';
import ShopHeader from '../../common/shop/components/ShopHeader/ShopHeader';
import EmptyComponent from '../../common/components/EmptyComponent';
import axios from 'axios';
import i18n from '../../common/i18n';

interface Props {
    navigation: any;
    screenProps: any;
};
interface State { };

export default class PaymentContainer extends Component<Props, State> {

    static navigationOptions = {
        drawerLabel: EmptyComponent,
    };

    handleNavigationState(state: any) {
        let url = state.url;
        let cartPage = /(checkout\/checkout|checkout\/cart)/;
        let successPage = /(checkout\/success)/

        if (cartPage.test(url)) {
            this.props.navigation.navigate('cartMethods');
        } else if(successPage.test(url)) {
            this.putOrder();
        }
    }

    putOrder() {
        const { screenProps: { store } } = this.props;

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
                    paymentMethod: 'online',
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
        const { screenProps: { store } } = this.props;

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

    render() {

        const { screenProps: { store } } = this.props;

        let shopToken = store.getState().shopAuth.shopAuthData.access_token;

        return (
            <View style={{flex: 1}}>
            <ShopHeader hasBackButton={false} navigation={this.props.navigation}/>
                <WebView
                    originWhitelist={['*']}
                    source={{
                        uri: baseShopServerApi + 'pay',
                        headers: {
                            Authorization: `Bearer ${shopToken}`
                        }
                    }}
                    onNavigationStateChange={(state: any) => this.handleNavigationState(state)}
                    javaScriptEnabled={true}
                    startInLoadingState={true} />
            </View>
        );
    }

}
