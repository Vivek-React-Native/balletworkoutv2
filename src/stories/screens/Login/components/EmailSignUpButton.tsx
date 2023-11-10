import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {WIDTH, HEIGHT} from '../../../../utilities/Theme';
import i18n from '@balletworkout/common/i18n';
import {Text} from '@balletworkout/components';
import logoImage from '@balletworkout/assets/images/at-sign.png';
interface IProps {
  onPress?: Function;
}
const EmailSignUpButton = ({onPress = () => {}}: IProps) => {
  return (
    <TouchableOpacity style={[styles.container]} onPress={onPress}>
      <Image style={styles.image} resizeMode={'contain'} source={logoImage} />
      <Text style={styles.textBold}>{i18n.t('settings.profile.email')}</Text>
    </TouchableOpacity>
  );
};

export default EmailSignUpButton;

const styles = StyleSheet.create({
  container: {
    marginRight: 5,
    flex: 1,
    height: WIDTH * 0.18,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(173, 173, 173, 0.1)',
  },
  image: {
    width: WIDTH * 0.07,
    height: WIDTH * 0.07,
    marginBottom: 8,
  },
  textBold: {
    textAlign: 'center',
    paddingHorizontal: '5%',
    fontSize: HEIGHT <= 667 ? 12 : 13,
    color: '#032426',
  },
});
