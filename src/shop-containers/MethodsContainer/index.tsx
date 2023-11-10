import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import ShopHeader from '../../common/shop/components/ShopHeader/ShopHeader';
import Methods, { VIEW_CALLBACK_ENUMS } from '../../shop-stories/screens/Methods';
import { connect } from 'react-redux';
import { fetchShippingMethods, fetchPaymentMethods, selectShippingMethods, selectPaymentMethods } from './../CartContainer/actions';
import EmptyComponent from '../../common/components/EmptyComponent';

interface Props {
    navigation: any;
    cartSettings: any;
    fetchShippingMethods: Function;
    fetchPaymentMethods: Function;
    selectShippingMethods: Function;
    selectPaymentMethods: Function;
    screenProps: any;
}
interface State {
    isLoading: boolean;
}

export class MethodsContainer extends Component<Props, State> {

    static navigationOptions = {
        drawerLabel: EmptyComponent,
    };

    state = {
        isLoading: false,
    };

    unSubscribeStore: Function;

    componentWillMount() {
        const { screenProps: { store }, fetchShippingMethods, fetchPaymentMethods } = this.props;

        fetchShippingMethods();
        fetchPaymentMethods();

        this.unSubscribeStore = store.subscribe(() => {
            let isLoading = store.getState().cartSettings.isLoading;

            this.setState({ isLoading });
        });
    }

    callbackHandler(type: string, data: any) {

        const { selectShippingMethods, selectPaymentMethods } = this.props;

        switch (type) {
            case VIEW_CALLBACK_ENUMS.SELECT_SHIPPING_METHOD:
                selectShippingMethods(data);
                break;
            case VIEW_CALLBACK_ENUMS.SELECT_PAYMENT_METHOD:
                // console.log(data);
                selectPaymentMethods(data);
                break;
        }

    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    render() {

        const { navigation, screenProps: { store } } = this.props;

        return (
            <View style={styles.container}>
                <ShopHeader
                    navigation={navigation} />
                <Methods
                    store={store}
                    isLoading={this.state.isLoading}
                    callbackHandler={this.callbackHandler.bind(this)}
                    navigation={navigation} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
});

const mapStateToProps = (state: any) => {
    const { cartSettings } = state;

    return { cartSettings };
}

const mapDispatchToProps = (dispatch: Function) => {
    return {
        fetchShippingMethods: () => dispatch(fetchShippingMethods()),
        fetchPaymentMethods: () => dispatch(fetchPaymentMethods()),
        selectShippingMethods: (shippingMethod: any) => dispatch(selectShippingMethods(shippingMethod)),
        selectPaymentMethods: (paymentMethod: any) => dispatch(selectPaymentMethods(paymentMethod)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MethodsContainer);
