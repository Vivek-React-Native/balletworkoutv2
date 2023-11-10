import React, { Component } from 'react';
import { View, Modal, StyleSheet, Text, ScrollView } from 'react-native';
import { Tabs, Tab, TabHeading, Button } from 'native-base';
import { connect } from 'react-redux';
import axios from 'axios';
import i18n from '../../../i18n';
import LoginForm, { LOGIN_FORM_ENUMS } from './components/LoginForm';
import RegisterForm, { REGISTRATION_FORM_ENUMS } from './components/RegisterForm';
import { PRIMARY_COLOR, SECONDARY_COLOR, WIDTH, HEIGHT, LIGHT_GREY_1 } from '../../../../utilities/Theme';
import { doRegisterCustomer, doCustomerLogin } from './../../shopCustomerAuth/actions';
import { baseShopServerApi } from '../../../appConstants';
import formValidationRules, { validationMassages } from './../../../formValidationRules';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const http = axios.create({
    baseURL: baseShopServerApi,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});

const CALLBACK_ENUMS = {
    ...REGISTRATION_FORM_ENUMS,
    ...LOGIN_FORM_ENUMS,
};

interface Props {
    store: any;
    registerCustomer: Function;
    setModalVisibility: Function;
    loginCustomer: Function;
    visible: boolean;
    navigation: any;
}
interface State {
    currentTab: number;
}

export class ShopLoginModal extends Component<Props, State> {

    state = {
        currentTab: 0,
    }

    storeUnsubscribe: Function;

    viewCallback(type: string, data: any) {

        switch (type) {
            case CALLBACK_ENUMS.SHOP_REGISTRATION:
                this.props.registerCustomer(data);
                break;
            case CALLBACK_ENUMS.SHOP_CUSTOMER_LOGIN:
                this.props.loginCustomer(data);
                break;
        }
    }

    componentWillMount() {
        const { store } = this.props;

        this.storeUnsubscribe = store.subscribe(() => {
            let isLoggedIn = store.getState().shopCustomerAuth.isLoggedIn;

            if (isLoggedIn) {
                this.props.setModalVisibility(false);
            }

        });
    }

    _goBack() {
        this.props.setModalVisibility(false);
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    componentWillUnmount() {
        this.storeUnsubscribe();
    }

    renderTabHeading(title: string, index: number, position: string) {
        if (position === 'left') {
            return (
                <TabHeading style={this.state.currentTab === index ? [styles.activeTabHeading, { borderTopLeftRadius: 10 }] : [styles.tabHeading, { borderTopLeftRadius: 10 }]}>
                    <Text style={styles.tabTitle}>{title}</Text>
                </TabHeading>
            );
        } else {
            return (
                <TabHeading style={this.state.currentTab === index ? [styles.activeTabHeading, { borderTopRightRadius: 10 }] : [styles.tabHeading, { borderTopRightRadius: 10 }]}>
                    <Text style={styles.tabTitle}>{title}</Text>
                </TabHeading>
            );
        }
    }

    render() {

        const { store, navigation } = this.props;

        return (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.props.visible}
                    onRequestClose={() => { }}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalBody}>
                            <Tabs
                                style={{ borderRadius: 10 }}
                                tabBarUnderlineStyle={styles.productInfoTabsUnderline}
                                onChangeTab={({ i }) => this.setState({ currentTab: i })}>
                                <Tab tabStyle={{ borderRadius: 10 }} heading={this.renderTabHeading(i18n.t('shop.shop_login_title'), 0, 'left')}>
                                    <View style={styles.tabStyle}>
                                        <Button transparent onPress={() => this._goBack()}>
                                            <Text><Icon name="arrow-left" /> {i18n.t('common.go_back_text')}</Text>
                                        </Button>
                                        <LoginForm rules={formValidationRules}
                                            messages={validationMassages}
                                            viewCallback={this.viewCallback.bind(this)}
                                            store={store} />

                                    </View>
                                </Tab>

                                <Tab heading={this.renderTabHeading(i18n.t('shop.shop_register_title'), 1, 'right')}>
                                    <ScrollView style={styles.tabStyle}>
                                        <Button transparent onPress={() => this._goBack()}>
                                            <Text><Icon name="arrow-left" /> {i18n.t('common.go_back_text')}</Text>
                                        </Button>
                                        <RegisterForm
                                            rules={formValidationRules}
                                            messages={validationMassages}
                                            viewCallback={this.viewCallback.bind(this)}
                                            store={store} />
                                    </ScrollView>

                                </Tab>
                            </Tabs>
                        </View>

                    </View>
                </Modal>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
    },
    modalContainer: {
        flex: 0,
        width: WIDTH - (WIDTH * .10),
        alignSelf: "center",
        height: HEIGHT - (HEIGHT * .20),
        borderWidth: 1,
        top: HEIGHT - (HEIGHT * .9),
        borderColor: LIGHT_GREY_1,
        borderRadius: 10,
    },
    title: {
        fontFamily: 'Montserrat-SemiBold',
        alignSelf: 'center',
    },
    modalHeader: {
        flex: 0,
    },
    modalBody: {
        flex: 1,
        borderRadius: 10
    },
    modalFooter: {
        flex: 0,
    },
    productInfoTabsUnderline: {
        opacity: 0,
    },
    tabHeading: {
        backgroundColor: PRIMARY_COLOR,
    },
    activeTabHeading: {
        backgroundColor: SECONDARY_COLOR,
    },
    tabTitle: {
        color: '#ffffff',
        fontFamily: 'Montserrat-SemiBold'
    },
    tabStyle: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 10,
        borderRadius: 10,
    },
});

const mapDispatchToProps = (dispatch: Function) => {
    return {
        registerCustomer: (userData: any) => dispatch(doRegisterCustomer(userData)),
        loginCustomer: (userData: any) => dispatch(doCustomerLogin(userData)),
    };
}

const mapStateToProps = (state: any) => {
    const { shopCustomerAuth } = state;

    return shopCustomerAuth;
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopLoginModal);
