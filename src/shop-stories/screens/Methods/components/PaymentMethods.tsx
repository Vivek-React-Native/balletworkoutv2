import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ListItem, Body, Right, Radio, List, Input, CheckBox } from 'native-base';
import i18n from '../../../../common/i18n';
import {PRIMARY_COLOR } from '../../../../utilities/Theme';

const VIEW_CALLBACK_ENUMS = {
    SELECT_PAYMENT_METHOD: 'cart-payment-method/select-method'
};

interface Props {
    viewCallback: Function;
    paymentMethods: any;
    paymentMethod: string;
}
interface State {
    selectedPaymentMethod: string;
}

export default class PaymentMethods extends Component<Props, State> {

    state = {
        selectedPaymentMethod: this.props.paymentMethod,
    };

    onSelectMethod(paymentMethod: string) {
        this.setState({ selectedPaymentMethod: paymentMethod }, () => this.updatePaymentMethod());
        
    }

    updatePaymentMethod() {
        this.props.viewCallback(VIEW_CALLBACK_ENUMS.SELECT_PAYMENT_METHOD, {
            payment_method: this.state.selectedPaymentMethod,
            agree: "1",
            comment: "",
        });
    }

    renderPaymentMethod(method: any, key: string) {
        return (
            <ListItem style={styles.methodItem} button onPress={() => this.onSelectMethod(method.code)} key={key}>

                <Body style={{flex: 1}}>
                    <Text style={styles.text}>{method.title}</Text>
                </Body>
                <Right style={{flex: 0}}>
                    <Radio
                    onPress={() => this.onSelectMethod(method.code)}
                    selected={this.state.selectedPaymentMethod === method.code} />
                </Right>
            </ListItem>
        );
    }

    render() {

        const { paymentMethods } = this.props;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>{i18n.t('shop.payment_method_title')}</Text>
                {
                    Object.keys(paymentMethods).length > 0 ?
                        <List>
                            {
                                Object.keys(paymentMethods).map((key: string) => this.renderPaymentMethod(paymentMethods[key], key))
                            }
                        </List> : null
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        marginTop: 15,
        marginBottom: 15,
    },
    title: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: PRIMARY_COLOR,
    },
    text: {
        fontFamily: 'Montserrat-SemiBold',
        color: PRIMARY_COLOR,
    },
    methodItem: {
        marginLeft: 0,
    }
});

export { VIEW_CALLBACK_ENUMS as CALLBACK_ENUMS_PAYMENT_METHOD };
