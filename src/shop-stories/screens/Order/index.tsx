import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { List, ListItem } from 'native-base';
import i18n from '../../../common/i18n';
import BankInfo from './components/BankInfo';

interface Props {
    navigation: any;
    store: any;
}

const Order = (props: Props) => {

    const {navigation} = props;
    let orderId = navigation.getParam('orderId');
    let paymentMethod = navigation.getParam('paymentMethod');

    return (
        <View style={styles.container}>
            <Text style={styles.text}><Text style={styles.textBold}>{i18n.t('shop.congratulations')}</Text> {i18n.t('shop.order_placed_text')}</Text>
            <Text style={styles.text}><Text style={styles.textBold}>{i18n.t('shop.order_title')}:</Text> {orderId}</Text>
            {
                paymentMethod === 'bank_transfer' ? <BankInfo />: null
            }

        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    textBold: {
        fontFamily: 'Montserrat-SemiBold',
    },
    text: {
        fontFamily: 'Montserrat-Regular',
    }
});

export default Order;
