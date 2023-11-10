import React, {Component} from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import {WIDTH, HEIGHT} from '../../../../utilities/Theme';
import i18n from '@balletworkout/common/i18n';
import {Text} from "@balletworkout/components";
const HeaderText = ({}) => {
    return (
        <View style={[styles.container]}>
            <Text style={styles.textBold}>{i18n.t('auth.create_account')}</Text>
        </View>
    );
}

export default HeaderText;

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: HEIGHT <= 667 ? 20 : HEIGHT * .03,
        width: '100%'
    },
    textBold: {
        textAlign: 'left',
        fontSize: 34,
        color: '#032426'
    },
});
