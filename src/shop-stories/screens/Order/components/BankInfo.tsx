import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import i18n from '../../../../common/i18n';

interface Props {}

const BankInfo = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{i18n.t('shop.bank_transfer')}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'column',
    },
    title: {
        fontSize: 18
    },
    text: {
        fontFamily: 'Montserrat-Regular',
    },
    textBold: {
        fontFamily: 'Montserrat-SemiBold',
    }
});

export default BankInfo;