import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { Container } from 'native-base';
import Product from './Product';
import i18n from '../../../../common/i18n';
import { PRIMARY_COLOR } from '../../../../utilities/Theme';

interface Props {
    navigation: any;
    products: any;
}
interface State { }

export default class ProductList extends Component<Props, State> {

    componentWillMount() {

    }

    render() {
        const { products, navigation } = this.props;
        return (
            <Container style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.pageTitle}>Latest</Text>
                    {
                        products.length > 0 ?
                            products.map((product: any, index: number) => <Product navigation={navigation} key={product.id} product={product} />) :
                            <Text>{i18n.t('shop.no_products')}</Text>
                    }
                </ScrollView>
            </Container>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
        paddingLeft: 15,
        paddingRight: 15, 
    },
    pageTitle: {
        marginTop: 15,
        marginBottom: 15,
        color: PRIMARY_COLOR,
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 20,
        textDecorationLine: 'underline',
        textDecorationColor: PRIMARY_COLOR,
    }
});
