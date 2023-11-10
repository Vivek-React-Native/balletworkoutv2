import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SECONDARY_COLOR } from '../../../../../utilities/Theme';

interface Props {
    store: any;
    navigation: any;
};
interface State {
    cartCount: number;
};

export default class MiniCart extends Component<Props, State> {

    unSubscribeStore: Function;

    state = {
        cartCount: 0,
    };

    componentWillMount() {
        const { store } = this.props;

        this.getCartCount();

        this.unSubscribeStore = store.subscribe(() => {
            this.getCartCount();
        });

    }

    getCartCount() {
        const { store } = this.props;
        let cartCount = 0;
        let cart = store.getState().cart;

        let products = typeof cart.cart.products !== 'undefined' && cart.cart.products.length > 0 ? cart.cart.products : 0;

        if(products !== 0) {
            products.map((product: any) => {
                cartCount += product.quantity;
            });
        }

        this.setState({cartCount});
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    render() {
        return (
            <View style={styles.container}>
                <Button
                    onPress={() => this.props.navigation.navigate('cart', {page: "cart"})}
                    transparent >
                    <Icon name="cart-outline" style={styles.icon} />
                    <View style={styles.cartCountTextWrapper}>
                        <Text style={styles.cartCountText}>{this.state.cartCount}</Text>
                    </View>
                </Button>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
    },
    cartCountText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 7,
    },
    cartCountTextWrapper: {
        position: 'absolute',
        top: 0,
        left: 30,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: SECONDARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 25,
        color: '#ffffff',
    },
});