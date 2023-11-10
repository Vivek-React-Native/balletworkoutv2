import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Container } from 'native-base';
import ShopHeader from './../../../common/shop/components/ShopHeader/ShopHeader';
import ProductList from './components/ProductList';
import Loader from '../../../common/components/Loader';

interface Props {
    navigation: any;
    productsList: any;
    isLoading: boolean;
    store: any;
    screenProps: any;
}
interface State {
    isLoading: boolean;
}

export default class Home extends Component<Props, State> {

    unSubscribeStore: Function;

    state = {
        isLoading: this.props.isLoading,
        productList: this.props.productsList,
    };

    componentWillMount() {
        const { store } = this.props;

        let isLoading = store.getState().shopHome.isLoading;
        this.setState({ isLoading });
        
        this.unSubscribeStore = store.subscribe(() => {
            let isLoading = store.getState().shopHome.isLoading;
            this.setState({ isLoading });
        });
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    render() {
        const { navigation } = this.props;
        
        return (
            <Container style={styles.container}>
                {!this.state.isLoading || <Loader />}
                <ProductList navigation={navigation} products={this.props.productsList} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
    }
});
