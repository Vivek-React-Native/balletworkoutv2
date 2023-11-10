import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Home from '../../shop-stories/screens/Home';
import { fetchProductList } from './actions';
import ShopHeader from '../../common/shop/components/ShopHeader/ShopHeader';

interface Props {
    navigation: any;
    fetchProductList: Function;
    productList: any;
    isLoading: boolean;
    screenProps: any;
}
interface State {
    productList: any;
}

export class ShopHomeContainer extends Component<Props, State> {

    static navigationOptions = {
        drawerLabel: 'Home',
    };

    unSubscribeStore: Function;

    state = {
        productList: this.props.productList,
    };

    componentWillMount() {
        const { fetchProductList, screenProps: {store} } = this.props;
        fetchProductList();
        this.unSubscribeStore = store.subscribe(() => {
            let productList = store.getState().shopHome.productList;
            this.setState({productList});
        });        
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    render() {
        const { screenProps: { store, ready }, isLoading } = this.props;
        
        return (
            <View style={styles.container}>
                <ShopHeader store={store} showBurgerMenu={true} showMiniCart={true} hasBackButton={false} navigation={this.props.navigation} />
                <Home store={store} isLoading={isLoading} productsList={this.state.productList} navigation={this.props.navigation} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        backgroundColor: '#fff',
        // justifyContent: 'center',
    },
});

const mapStateToProps = (state: any) => {
    const { shopHome } = state;

    return shopHome;
}

const mapDispatchToProps = (dispatch: Function) => {
    return {
        fetchProductList: () => dispatch(fetchProductList())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopHomeContainer);
