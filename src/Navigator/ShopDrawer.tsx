import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { createDrawerNavigator, DrawerItems, createStackNavigator, NavigationActions, StackActions } from 'react-navigation';

// screens
import ShopHome from './../shop-containers/ShopHomeContainer';
import ProductDetails from './../shop-containers/ProductDetailsContainer';
import Cart from './../shop-containers/CartContainer';
import Methods from './../shop-containers/MethodsContainer';
import Payment from './../shop-containers/PaymentContainer';
import OrderPlaced from './../shop-containers/OrderPlacedContainer';

import { Container, Header, Content } from 'native-base';
import { authenticateShop } from './../common/shop/shopAuth/actions';
import { logoutCustomer } from './../common/shop/shopCustomerAuth/actions';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../utilities/Theme';
import i18n from '../common/i18n';
import { ShopLoginModal } from '../common/shop/components/ShopLoginModal';
import Loader from '../common/components/Loader';

const resetAction = StackActions.reset({
    key: null,
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'main' })],
});

interface Props {
    authenticateShop: Function;
    screenProps: any;
    navigation: any;
    logoutCustomer: Function;
}
interface State {
    ready: boolean;
    customerName: string;
    isLoggedIn: boolean;
    displayLoginModal: boolean;
}
/**
 * Shop Drawer Component
 */
class ShopDrawerComponent extends Component<Props, State> {

    state = {
        ready: false,
        customerName: "",
        isLoggedIn: false,
        displayLoginModal: false,
    };

    unSubscribeStore: Function = null;

    constructor(props: any) {
        super(props);
        const { store } = this.props.screenProps;

        this.unSubscribeStore = store.subscribe(() => {
            let ready = store.getState().shopAuth.isAuthenticated;
            let isCustomerLoggedIn = store.getState().shopCustomerAuth.isLoggedIn;
            this.setState({ isLoggedIn: true });
            if (isCustomerLoggedIn) {
                this.setState({ customerName: store.getState().shopCustomerAuth.shopCustomerData.firstname });
            }

            if (ready) {
                this.setState({ ready });
            }
        });
    }

    componentWillMount() {
        const { authenticateShop, screenProps: { store } } = this.props;

        let isCustomerLoggedIn = store.getState().shopCustomerAuth.isLoggedIn;
        if (isCustomerLoggedIn) {
            this.setState({ customerName: store.getState().shopCustomerAuth.shopCustomerData.firstname });
        }
        authenticateShop();
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    logout() {
        this.props.logoutCustomer();
        this.props.navigation.navigate('shop');
    }

    login(display: boolean = true) {
        this.setState({displayLoginModal: display});
    }

    render() {
        const { props } = this;

        if (!this.state.ready) {
            return (
                <Container>
                    <Loader/>
                </Container>
            );
        }

        return (
            <Container>
                <Header style={stylesDrawer.header}>
                    <Text style={stylesDrawer.headerText}>{i18n.t('shop.welcome_text')} <Text style={stylesDrawer.headerTextSubHeader}>{this.state.customerName !== "" ? this.state.customerName : "Guest"}</Text>!</Text>
                </Header>
                <Content>
                    <DrawerItems {...props} activeTintColor={SECONDARY_COLOR} inactiveTintColor={PRIMARY_COLOR} labelStyle={stylesDrawer.drawerItemText} activeLabelStyle={stylesDrawer.drawerItemText} />

                    <View style={stylesDrawer.drawerItem}>
                        {
                            this.state.isLoggedIn === true ?
                                <Text style={[stylesDrawer.drawerItemText, stylesDrawer.drawerItemTextColor]} onPress={() => this.logout()}>{i18n.t('shop.drawer_logout_menu')}</Text> :
                                <Text style={[stylesDrawer.drawerItemText, stylesDrawer.drawerItemTextColor]} onPress={() => this.login()}>{i18n.t('shop.drawer_login_menu')}</Text>
                        }
                    </View>

                    <View style={stylesDrawer.drawerItem}>
                        <Text style={[stylesDrawer.drawerItemText, stylesDrawer.drawerItemTextColor]} onPress={() => this.props.navigation.dispatch(resetAction)}>Back to Workouts</Text>
                    </View>
                </Content>
                <ShopLoginModal store={props.screenProps.store} visible={this.state.displayLoginModal} setModalVisibility={this.login.bind(this)} />
            </Container>
        );
    }

}

const stylesDrawer = StyleSheet.create({
    header: {
        backgroundColor: PRIMARY_COLOR,
        height: 85,
        padding: 10,
        justifyContent: "flex-start",
    },
    headerText: {
        fontFamily: 'Montserrat-Regular',
        color: '#fff',
        alignSelf: 'flex-end'
    },
    headerTextSubHeader: {
        fontFamily: 'Montserrat-SemiBold',
    },
    drawerItem: {
        padding: 15
    },
    drawerItemText: {
        fontFamily: 'Montserrat-SemiBold',
    },
    drawerItemTextColor: {
        color: PRIMARY_COLOR,
    }
});

const mapStateToProps = (state: any) => {
    const { shopAuth } = state;
    return shopAuth;
}

const mapDispatchToProps = (dispatch: Function) => {
    return {
        authenticateShop: () => { dispatch(authenticateShop()) },
        logoutCustomer: () => { dispatch(logoutCustomer()) },
    };
}

/**
 * connect shop with redux
 */
const ShopDrawerComponentConnected = connect(mapStateToProps, mapDispatchToProps)(ShopDrawerComponent);

const DrawerStack = createStackNavigator({
    shopHome: ShopHome,
    productDetails: ProductDetails,
    cart: Cart,
    cartMethods: Methods,
    payment: Payment,
    orderPlaced: OrderPlaced,
}, {
        initialRouteName: 'shopHome',
        header: null,
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false,
        }
    });

/**
 * Shop Drawer Navigation
 */
const ShopDrawer = createDrawerNavigator({
    home: {
        screen: DrawerStack,
        navigationOptions: {
            drawerLabel: 'Home'
        }
    },
}, {
        initialRouteName: 'home',
        contentComponent: (props: any) => (<ShopDrawerComponentConnected {...props} parentNavigation={props.navigation} />),
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle',
    }
);

export default ShopDrawer;