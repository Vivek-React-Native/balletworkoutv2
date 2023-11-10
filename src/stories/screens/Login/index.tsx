import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Text, Toast } from 'native-base';
import {
  PADDING_LEFT_RIGHT,
  HEIGHT,
  WIDTH,
  SECONDARY_COLOR,
  PRIMARY_COLOR,
} from './../../../utilities/Theme';
import LoginForm, { LOGIN_FORM_CALLBACK_ENUMS } from './components/LoginForm';
import Logo from './components/Logo';
import OrText from './components/OrText';
import InfoBlock from './components/InfoBlock';
import FbLoginButton, {
  FB_LOGIN_BUTTON_CALLBACK_ENUMS,
} from './components/FbLoginButton';
import AppleLoginButton, {
  APPLE_LOGIN_BUTTON_CALLBACK_ENUMS,
} from './components/AppleLoginButton';
import i18n from '../../../common/i18n';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import LanguageSwitcher from '../../../common/components/LanguageSwitcher';
import Loader from '../../../common/components/Loader';
import { isIphoneSe } from '../../../utilities/Screen';
import WelcomeText from './components/WelcomeText';
import EmailSignUpButton from './components/EmailSignUpButton';
import FacebookSignUpButton from './components/FacebookSignUpButton';
import AppleSignUpButton from './components/AppleSignUpButton';
import {} from 'react-native-fbsdk';
import AsyncStorage from '@react-native-community/async-storage';

// import { store } from './../../../store';

// list of all possible enums in child
const VIEW_CALLBACK_ENUMS = {
  ...LOGIN_FORM_CALLBACK_ENUMS,
  ...FB_LOGIN_BUTTON_CALLBACK_ENUMS,
  ...APPLE_LOGIN_BUTTON_CALLBACK_ENUMS,
};

export interface State {
  isLoading: boolean;
  forgotPasswordVisibility: boolean;
  showLogin: boolean;
  topButton: boolean;
}
export interface Props {
  login: Function;
  errors: any;
  store: any;
  navigation: any;
  callbackHandler: Function;
}
export default class Login extends Component<Props, State> {
  unSubscribeStore: Function;

  language: string;
  loggedIn: boolean = false;

  isUnmounted: boolean = false;

  state = {
    isLoading: false,
    forgotPasswordVisibility: false,
    showLogin: false,
    topButton: false,
  };

  async componentDidMount() {
    const { store } = this.props;
    let isLoading = store.getState().auth.isLoading;
    let isFirst = store.getState().ChooseDays.isFirst;
    // console.log('isFirst:', isFirst);
    // console.log('store.getState():', store.getState());

    this.setState({ isLoading });

    let loginStatus = store.getState().auth.isLoggedIn;

    if (loginStatus > 0) {
      if (!isFirst) {
        this.props.navigation.navigate('app');
      } else {
        this.props.navigation.navigate('welcome');
      }
    }

    this.unSubscribeStore = store.subscribe( () => {
      let isLoggedIn = store.getState().auth.isLoggedIn;
      let errors = store.getState().auth.errors;

      let isLoading = store.getState().auth.isLoading;

      if (!this.isUnmounted) this.setState({ isLoading });

      
      if (isLoggedIn > 0) {
        const language =async()=> await AsyncStorage.getItem('language');

        let lang = store.getState().auth.isLoggedIn
          ? store.getState().auth.userData?.language || language()
          : 'en-US';
        if (this.language !== lang) {
          i18n.changeLanguage(lang);
          this.language = lang;
        }
        if (!this.loggedIn) {
          this.loggedIn = true;
          if (!isFirst) {
            this.props.navigation.navigate('app');
          } else {
            this.props.navigation.navigate('welcome');
          }
        }
      } else if (errors) {
        Toast.show({
          text: errors.message,
          //buttonText: "Try again",
          position: 'top',
        });
      }
    });
  }

  viewCallbackHandler = (type: string, data: any) => {
    switch (type) {
      default:
        this.props.callbackHandler(type, data);
        break;
    }
  };

  _setForgotPasswordVisibility(value: boolean) {
    this.setState({ forgotPasswordVisibility: value });
  }

  componentWillUnmount() {
    this.unSubscribeStore();
    this.isUnmounted = true;
  }

  render() {
    const { store } = this.props;
    const bgImage = require('../../../assets/images/pinkLinearGradient.png');
    const balletLady = require('../../../assets/images/BalletModel.png');
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {!this.state.isLoading || <Loader />}

          <Logo />
          <WelcomeText />
          <LoginForm
            setForgotPasswordVisibility={this._setForgotPasswordVisibility.bind(
              this,
            )}
            callbackHandler={this.viewCallbackHandler}
          />

          <OrText />

          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <EmailSignUpButton
                onPress={() => this.props.navigation.navigate('register')}
              />
              <FacebookSignUpButton onPress={this.viewCallbackHandler} />
              {Platform.OS !== 'android' && (
                <AppleSignUpButton onPress={this.viewCallbackHandler} />
              )}
            </View>
          </View>

          {/*<FbLoginButton*/}
          {/*    paddingLeft={27}*/}
          {/*    paddingRight={27}*/}
          {/*    backgroundColor={'#fff'}*/}
          {/*    title={i18n.t('auth.signin_fb_button')}*/}
          {/*    callbackHandler={this.viewCallbackHandler.bind(this)}*/}
          {/*/>*/}

          {/*{*/}
          {/*    Platform.OS === 'ios' ?*/}
          {/*        <AppleLoginButton*/}
          {/*            paddingLeft={44.5}*/}
          {/*            paddingRight={44.5}*/}
          {/*            title={i18n.t('auth.signin_apple_button')}*/}
          {/*            callbackHandler={this.viewCallbackHandler.bind(this)}*/}
          {/*        /> : null*/}
          {/*}*/}

          {/*<View style={styles.signInLinkWrapper}>*/}
          {/*    <Text style={[styles.textWhite, styles.signInLinkTextWrapper]}>*/}
          {/*        {i18n.t('auth.not_signed_up')}*/}
          {/*    </Text>*/}
          {/*    <Text onPress={() => this.props.navigation.navigate('register')} style={[styles.linkText, styles.signInLink]}>{i18n.t('auth.sign_up_text').toUpperCase()}</Text>*/}
          {/*</View>*/}

          {/*<InfoBlock />*/}

          {/*<LanguageSwitcher />*/}

          <ForgotPasswordModal
            isVisible={this.state.forgotPasswordVisibility}
            setVisibility={this._setForgotPasswordVisibility.bind(this)}
            store={store}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  TopButtons: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: HEIGHT * 0.015,
    borderBottomWidth: 4,
  },
  TopButtonText: {
    fontSize: WIDTH * 0.04,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // container: {
  //   flexDirection: 'column',
  //   justifyContent: 'space-around',
  //   // alignSelf: 'stretch',
  //   paddingLeft: PADDING_LEFT_RIGHT,
  //   paddingRight: PADDING_LEFT_RIGHT,
  //   // top: height * .1,
  //   // height: height * .8
  // },
  // signInLinkWrapper: {
  //   flex: -1, //isIphoneSe? .1 : .9,
  //   alignItems: 'center',
  //   justifyContent: 'flex-start',
  //   marginTop: 20,
  // },
  // signInLinkTextWrapper: {
  //   flex: 0,
  //   textAlign: 'center',
  //   color: '#fff',
  //   fontFamily: 'Montserrat-SemiBold',
  //   fontSize: isIphoneSe ? 14 : 16,
  // },
  // signInLink: {
  //   fontFamily: 'Montserrat-Bold',
  //   fontSize: isIphoneSe ? 14 : 16,
  //   color: PRIMARY_COLOR,
  // },
  // textWhite: {
  //   color: '#ffffff',
  // },
  // linkText: {
  //   color: '#2699FB',
  // },
  // sideButtons: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'space-evenly',
  //   alignSelf: 'stretch',
  // },
});

export { VIEW_CALLBACK_ENUMS as CALLBACK_ENUMS };
