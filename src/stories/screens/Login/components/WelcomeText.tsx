import React, {Component} from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import {WIDTH, HEIGHT} from '../../../../utilities/Theme';
import i18n from '@balletworkout/common/i18n';
import {Text} from '@balletworkout/components';
const WelcomeText = ({}) => {
  return (
    <View style={[styles.container]}>
      <Text style={styles.textBold}>{i18n.t('auth.Login')}</Text>
    </View>
  );
};

export default WelcomeText;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30, //HEIGHT <= 667 ? 30 : HEIGHT * .06,
  },
  textBold: {
    textAlign: 'center',
    paddingHorizontal: '5%',
    fontSize: 34,
    color: '#032426',
  },
});
