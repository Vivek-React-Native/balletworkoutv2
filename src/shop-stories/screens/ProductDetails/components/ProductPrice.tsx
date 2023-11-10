import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PRIMARY_COLOR, GREY } from '../../../../utilities/Theme';

interface Props {
    price: string;
    specialPrice: string,
    specialPriceStartDate: string,
    specialPriceEndDate: string;
}

const ProductPrice = (props: Props) => {

    const { price, specialPrice, specialPriceEndDate, specialPriceStartDate } = props;

    if (specialPrice === "") {

        return (
            <View style={styles.container}>
                <Text style={styles.priceText}>{price}</Text>
            </View>
        );

    } else {

        return (
            <View style={styles.container}>
                <Text style={styles.priceText}>{price} <Text style={styles.originalPrice}>{ specialPrice }</Text></Text>
            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        marginTop: 5
    },
    priceText: {
        fontFamily: 'Montserrat-Medium',
        color: PRIMARY_COLOR,
        fontSize: 15,
    },
    originalPrice: {
        color: GREY,
        textDecorationLine: 'line-through'
    }
});

export default ProductPrice;