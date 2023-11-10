import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {WIDTH, HEIGHT} from '../../../../utilities/Theme';
import i18n from '@balletworkout/common/i18n';
import {Text} from '@balletworkout/components';
import logoImage from '@balletworkout/assets/images/apple-icon.png';
import appleAuth, {
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';

const VIEW_CALLBACK_ENUMS = {
  LOGIN_WITH_APPLE: 'login/login-with-apple',
};

interface IProps {
  onPress?: Function;
}
const AppleSignUpButton = ({onPress = () => {}}: IProps) => {
  const appleLoginHandler = async () => {
    // console.log(appleAuth);

    if (!appleAuth.isSupported) {
      Alert.alert('Sign In With Apple is supported only on ios >= 13');
      return;
    }

    try {
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      // use credentialState response to ensure the user is authenticated
      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        // user is authenticated
        // console.log(appleAuthRequestResponse);
        let loginData = {
          identityToken: appleAuthRequestResponse.identityToken,
        };
        onPress(VIEW_CALLBACK_ENUMS.LOGIN_WITH_APPLE, loginData);
      } else if (credentialState === AppleAuthCredentialState.REVOKED) {
        Alert.alert('Login expired/access revoked, please login again');
      } else if (credentialState === AppleAuthCredentialState.TRANSFERRED) {
        Alert.alert('Login user transfered');
      } else if (credentialState === AppleAuthCredentialState.NOT_FOUND) {
        Alert.alert('Login user not found');
      } else {
        Alert.alert('Something went wrong, please try again.');
      }
    } catch (e) {
      Alert.alert('Some error occurred, please try again');
    }
  };
  return (
    <TouchableOpacity style={[styles.container]} onPress={appleLoginHandler}>
      <Image style={styles.image} resizeMode={'contain'} source={logoImage} />
      <Text style={styles.textBold}>{i18n.t('auth.apple')}</Text>
    </TouchableOpacity>
  );
};

export default AppleSignUpButton;

const styles = StyleSheet.create({
  container: {
    marginLeft: 5,
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
    aspectRatio: 1,
    marginBottom: 8,
  },
  textBold: {
    textAlign: 'center',
    fontSize: HEIGHT <= 667 ? 12 : 13,
    color: '#032426',
  },
});
