import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import {WIDTH, HEIGHT} from '@balletworkout/utilities/Theme';
import i18n from '@balletworkout/common/i18n';
import {Text} from '@balletworkout/components';

const HeaderText = () => {
  const currentUser = useSelector(state => state.auth.userData);
  useEffect(() => {
    // console.log('currentUser:', currentUser);
  }, [currentUser]);
  getDateTime = () => {
    var ndate = new Date();
    var hours = ndate.getHours();
    // console.log('hours',hours)
    var message = '';
    if (hours < 12) {
      message = i18n.t('home.goodmorning');
    } else if (hours >= 12 && hours < 18) {
      message = i18n.t('home.goodnoon');
    } else if (hours >= 18 && hours <= 24) {
      message = i18n.t('home.goodevening');
    }
    // console.log('message', message);
    return message;
  };
  return (
    <View>
      <Text style={styles.textBold} numberOfLines={1}>
        {getDateTime()}
      </Text>
      <Text style={[styles.textBold]} >
        {currentUser && currentUser.first_name
          ? `${currentUser.first_name}`
          : ''}
      </Text>
    </View>
  );
};

export default HeaderText;

const styles = StyleSheet.create({
  textBold: {
    textAlign: 'left',
    paddingHorizontal: '5%',
    fontSize: WIDTH * 0.07,
    color: '#032426',
  },
});
