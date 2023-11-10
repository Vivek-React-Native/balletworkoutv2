import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import i18n from '../../../../common/i18n';
import { LIGHT_GREY } from '../../../../utilities/Theme';

interface Props {
    productCode: string;
    availability: string;
};

const OtherInfo = (props: Props) => {

    const { productCode, availability } = props;

    return (
        <View style={styles.container}>
            <Text style={styles.infoText}><Text style={styles.textBold}>{i18n.t('shop.product_code_text')}:</Text> {productCode}</Text>
            <Text style={styles.infoText}><Text style={styles.textBold}>{i18n.t('shop.product_availability_text')}:</Text> {availability}</Text>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        marginTop: 10,
    },
    infoText: {
        fontFamily: 'Montserrat-Regular',
    },
    textBold: {
        fontFamily: 'Montserrat-SemiBold',
        color: LIGHT_GREY,
    }
});

export default OtherInfo;
