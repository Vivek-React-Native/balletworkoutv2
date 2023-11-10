import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'native-base';
import { PRIMARY_COLOR, LIGHT_GREY_1 } from '../../../../utilities/Theme';
import i18n from '../../../../common/i18n';

interface Props {
    addToCart: Function;
    productAvailability: string;
}
interface State { }

export default class ProductButtons extends Component<Props, State> {

    isDisabled() {
        return this.props.productAvailability.toLowerCase() === 'Out Of Stock'.toLowerCase()
    }

    render() {
        const { addToCart } = this.props;
        return (
            <View style={styles.container}>
                <Button
                    disabled={this.isDisabled()}
                    onPress={() => addToCart()}
                    full
                    style={this.isDisabled() ? styles.buttonAddToCartDisabled : styles.buttonAddToCart}>
                    <Text style={styles.buttonText}>{ this.isDisabled() ? this.props.productAvailability :i18n.t('shop.add_to_cart_text').toUpperCase()}</Text>
                </Button>
                {/* <Button style={{flex: 1}} full><Text>Buy Now</Text></Button> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'row',
        alignSelf: 'stretch'
    },
    buttonAddToCart: {
        flex: 1,
        backgroundColor: PRIMARY_COLOR
    },
    buttonAddToCartDisabled: {
        flex: 1,
        backgroundColor: LIGHT_GREY_1
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Montserrat-SemiBold'
    }
});
