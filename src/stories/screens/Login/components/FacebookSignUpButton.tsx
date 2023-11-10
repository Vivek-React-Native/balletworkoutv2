import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import FBSDK, {LoginManager, AccessToken} from 'react-native-fbsdk';
import {WIDTH, HEIGHT} from '../../../../utilities/Theme';
import i18n from '@balletworkout/common/i18n';
import {Text} from '@balletworkout/components';
import logoImage from '@balletworkout/assets/images/facebook-icon.png';
import {Toast} from 'native-base';
// list of all possible enums in child
const VIEW_CALLBACK_ENUMS = {
  LOGIN_WITH_FACEBOOK: 'login/login-with-facebook',
};
interface IProps {
  onPress?: Function;
}
const FacebookSignUpButton = ({onPress = () => {}}: IProps) => {
  const fbLoginHandler = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'email',
        'public_profile',
      ]);
      if (result.isCancelled) {
        Toast.show({
          text: i18n.t('auth.facebook_login_canceled'),
        });
      } else if (result.declinedPermissions.length > 0) {
        Toast.show({
          text: i18n.t('auth.facebook_email_permission_denied'),
        });
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        let loginData = {
          accessToken: data.accessToken,
        };
        onPress(VIEW_CALLBACK_ENUMS.LOGIN_WITH_FACEBOOK, loginData);
      }
    } catch (e) {
      Toast.show({
        text: i18n.t('auth.facebook_error'),
      });
    }
  };
  return (
    <TouchableOpacity style={[styles.container]} onPress={fbLoginHandler}>
      <Image style={styles.image} resizeMode={'contain'} source={logoImage} />
      <Text style={styles.textBold}>{i18n.t('auth.facebook')}</Text>
    </TouchableOpacity>
  );
};

export default FacebookSignUpButton;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    flex: 1,
    height: WIDTH * 0.18,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(173, 173, 173, 0.1)',
  },
  image: {
    width: WIDTH * 0.08,
    height: WIDTH * 0.08,
    aspectRatio: 1,
    tintColor: '#287DEC',
    marginBottom: 8,
  },
  textBold: {
    textAlign: 'center',
    paddingHorizontal: '5%',
    fontSize: HEIGHT <= 667 ? 12 : 13,
    color: '#032426',
  },
});
