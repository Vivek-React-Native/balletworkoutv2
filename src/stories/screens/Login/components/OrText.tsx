import React, {Component} from 'react';
import {View, StyleSheet, Platform, Dimensions} from 'react-native';
import i18n from '../../../../common/i18n';
import {WIDTH, HEIGHT} from '../../../../utilities/Theme';
import {Text} from '@balletworkout/components';

interface Props {}
interface State {}
export default class OrText extends Component<Props, State> {
  render() {
    return (
      <View style={[styles.container]}>
        {/* <View style={{position: 'absolute', width: '100%', borderBottomWidth: 1, borderColor: '#CDCDCD'}}/>
        <Text style={[
          styles.textWhite,
          styles.orBlock
        ]} font="Regular">{i18n.t('auth.or_text')}</Text> */}
        <Text style={styles.title}>{i18n.t('auth.createaccount')}</Text>
        <Text style={styles.description} font="Regular">
          {i18n.t('auth.signupdesc')}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    //alignItems: 'center',
    marginTop: 35, //HEIGHT <= 667 ? 15 : 20,
    marginBottom: 8,
  },
  orBlock: {
    fontSize: 14,
  },
  textWhite: {
    color: '#CDCDCD',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  textBold: {
    fontFamily: 'Montserrat-Bold',
  },
  title: {
    fontSize: 20,
    color: '#032426',
  },
  description: {
    fontSize: 14,
    color: '#828282',
  },
});
