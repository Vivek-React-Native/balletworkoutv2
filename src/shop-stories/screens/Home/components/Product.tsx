import React, { Component } from 'react';
import { StyleSheet, Text, Image, View } from 'react-native';
import { Container, Card, CardItem, Left, Body, Button, Icon, Right } from 'native-base';
import { SECONDARY_COLOR, PRIMARY_COLOR } from '../../../../utilities/Theme';

interface Props {
    navigation: any;
    product: any;
}
interface State { }

export default class Product extends Component<Props, State> {

    _goToProductDetails() {
        const { navigation, product } = this.props;

        navigation.navigate('productDetails', {
            product,
        });
    }

    render() {

        const { product } = this.props;

        return (
            <View style={styles.container}>
                <Card style={styles.productCard} noShadow>
                    <CardItem button cardBody onPress={() => this._goToProductDetails()}>
                        <Image source={{ uri: product.image }} style={styles.productImage} />
                    </CardItem>
                    <CardItem button onPress={() => this._goToProductDetails()}>
                        <Body>
                            <Text style={styles.productTitle}>{product.name}</Text>
                        </Body>
                    </CardItem>
                    <CardItem button onPress={() => this._goToProductDetails()}>
                        <Body>
                            <Text style={styles.priceText}>{product.price_formated}</Text>
                        </Body>
                    </CardItem>
                </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: -1,
        alignSelf: 'stretch',
    },
    productImage: {
        flex: 1,
        height: 300,
        width: null,
        resizeMode: 'contain',
    },
    productTitle: {
        fontFamily: 'Montserrat-SemiBold',
        color: PRIMARY_COLOR,
        fontSize: 15,
        alignSelf: 'center',
    },
    productCard: {
        marginBottom: 0,
        marginTop: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        paddingTop: 15,
        paddingBottom: 15,
    },
    productImageWrapper: {
        flex: -1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    priceText: {
        color: SECONDARY_COLOR,
        fontFamily: 'Montserrat-Regular',
        alignSelf: 'center',
    }
});
