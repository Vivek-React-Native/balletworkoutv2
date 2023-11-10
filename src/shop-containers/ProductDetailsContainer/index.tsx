import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Container } from 'native-base';
import ShopHeader from './../../common/shop/components/ShopHeader/ShopHeader';
import ProductDetails from '../../shop-stories/screens/ProductDetails';
import EmptyComponent from './../../common/components/EmptyComponent';

interface Props {
    navigation: any;
    screenProps: any;
}
interface State { }

export default class ProductDetailsContainer extends Component<Props, State> {

    static navigationOptions = {
        drawerLabel: EmptyComponent,
    };

    render() {
        const { navigation, screenProps: {store} } = this.props;
        return (
            <Container style={styles.container}>
                <ShopHeader store={store} showMiniCart={true} navigation={navigation} />
                <ProductDetails store={store} navigation={navigation} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
});
