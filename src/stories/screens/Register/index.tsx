import React, {Component} from 'react';
import {
  Platform,
  Image,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {Toast} from 'native-base';
import DeviceInfo from 'react-native-device-info';
import i18n from '../../../common/i18n';
import Loader from '../../../common/components/Loader';
import LanguageSwitcher from '../../../common/components/LanguageSwitcher';
import {
  SECONDARY_COLOR,
  HEIGHT,
  PADDING_LEFT_RIGHT,
  PRIMARY_COLOR,
  PRIMARY_COLOR_NEW,
} from '../../../utilities/Theme';
import RegisterForm, {
  REGISTER_FORM_CALLBACK_ENUMS,
} from './components/RegisterForm';
import OrText from './components/OrText';
import Logo from './components/Logo';
import InfoBlock from './components/InfoBlock';
import FbSignUpButton, {
  FB_SIGNUP_CALLBACK_ENUMS,
} from './components/FbSignUpButton';
import {navigationAfterRegistration} from '../../../common/temp/actions';
import {isIphoneSe} from '../../../utilities/Screen';
import AppleSignUpButton, {
  APPLE_SIGNUP_CALLBACK_ENUMS,
} from './components/AppleSignupButton';
import * as RNLocalize from 'react-native-localize';
import {getDefaultPref} from '../../../utilities/Functions';
import HeaderText from './components/HeaderText';
import {Text} from '@balletworkout/components';
import AsyncStorage from '@react-native-community/async-storage';

// list of all possible enums in child
const VIEW_CALLBACK_ENUMS = {
  ...FB_SIGNUP_CALLBACK_ENUMS,
  ...REGISTER_FORM_CALLBACK_ENUMS,
  ...APPLE_SIGNUP_CALLBACK_ENUMS,
};

export interface Props {
  register?: Function;
  errors?: any;
  callbackHandler: Function;
  store: any;
  navigation: any;
}
export interface State {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  country: string;
  timezone: string;
  language: string;
  isLoading: boolean;
  isRegistering: boolean;
}
export default class Register extends Component<Props, State> {
  unSubscribeStore: Function;

  _isMounted: boolean = false;

  state = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    country: '',
    timezone: '',
    language: 'en-US',
    isLoading: false,
    isRegistering: false,
  };

  componentDidMount() {
    this._isMounted = true;
    this.setState({
      country: DeviceInfo.isEmulator() ? 'BE' : RNLocalize.getCountry(),
      timezone: RNLocalize.getTimeZone() || 'Europe/Brussels',
    });
    const {store} = this.props;
    // console.log(store.getState());
    let isLoading = store.getState().auth.isLoading;

    this.setState({isLoading});

    this.unSubscribeStore = store.subscribe(() => {
      let isLoggedIn = store.getState().auth.isLoggedIn;
      let errors = store.getState().auth.errors;

      let isLoading = store.getState().auth.isLoading;
      if (this._isMounted) {
        this.setState({isLoading});
      }

      if (isLoggedIn > 0) {
        // console.log("Logged in");
        const language = async ()=> await AsyncStorage.getItem('language');

        let lang = store.getState().auth.isLoggedIn
          ? store.getState()?.auth?.userData?.language || language()
          : 'en-US';
        i18n.changeLanguage(lang);

        Toast.show({
          text: i18n.t('auth.login_success_message'),
        });

        this.unSubscribeStore();
        if (this.state.isRegistering) {
          store.dispatch(navigationAfterRegistration());
          // this.props.navigation.navigate('app');
        } else {
          // this.props.navigation.navigate('app', {
          //     showConfetti: false,
          // });
        }
      } else if (errors) {
        Toast.show({
          text: errors.message,
          position: 'top',
          duration: 4000,
        });
      }
    });
  }

  viewCallbackHandler = (type: string, data: any) => {
    switch (type) {
      default:
        this.setState({isRegistering: true});
        this.props.callbackHandler(type, data);
        break;
    }
  };

  onLangChange(lang: string) {
    this.setState({language: lang});
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unSubscribeStore();
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {!this.state.isLoading || <Loader />}

          {/*<Logo />*/}
          <HeaderText />
          <RegisterForm
            language={this.state.language}
            viewCallbackHandler={this.viewCallbackHandler.bind(this)}
          />

          {/*<OrText />*/}

          {/*<FbSignUpButton*/}
          {/*    backgroundColor={'#fff'}*/}
          {/*    title={i18n.t('auth.signup_fb_button')}*/}
          {/*    viewCallbackHandler={this.viewCallbackHandler.bind(this)}*/}
          {/*    country={this.state.country}*/}
          {/*    language={this.state.language}*/}
          {/*    timezone={this.state.timezone}*/}
          {/*/>*/}

          {/*{*/}
          {/*    Platform.OS === 'ios' ?*/}
          {/*        <AppleSignUpButton*/}
          {/*            paddingLeft={44.5}*/}
          {/*            paddingRight={44.5}*/}
          {/*            title={i18n.t('auth.signup_apple_button')}*/}
          {/*            callbackHandler={this.viewCallbackHandler.bind(this)}*/}
          {/*            country={this.state.country}*/}
          {/*            language={this.state.language}*/}
          {/*            timezone={this.state.timezone}*/}
          {/*        /> : null*/}
          {/*}*/}

          <View style={styles.signInLinkWrapper}>
            <Text font="Regular" style={[styles.signInLinkTextWrapper]}>
              {i18n.t('auth.already_signed_up')}
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('login')}>
              <Text font="Regular" style={styles.signInLink}>
                {i18n.t('auth.sign_in_text')}
              </Text>
            </TouchableOpacity>
          </View>

          {/*<InfoBlock />*/}

          {/*<LanguageSwitcher onLangChange={this.onLangChange.bind(this)} />*/}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingLeft: PADDING_LEFT_RIGHT,
    paddingRight: PADDING_LEFT_RIGHT,
  },
  signUpButton: {
    paddingBottom: 4,
    marginTop: 15,
    borderColor: PRIMARY_COLOR_NEW,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRadius: 5,
  },
  textWhite: {
    color: '#ffffff',
  },
  textBold: {
    fontFamily: 'Montserrat-Bold',
  },
  signInLinkWrapper: {
    // flex: -1,//isIphoneSe ? .6 : .9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10, //HEIGHT <= 667 ? 15 : 20,
  },
  signInLinkTextWrapper: {
    flex: 0,
    textAlign: 'center',
    color: '#013229',
    // fontFamily: 'Montserrat-SemiBold',
    fontSize: isIphoneSe ? 10 : 12,
  },
  signInLink: {
    // fontFamily: 'Montserrat-Bold',
    fontSize: isIphoneSe ? 10 : 12,
    color: PRIMARY_COLOR_NEW,
    marginLeft: 4,
  },
  sideButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
  },
});
export {VIEW_CALLBACK_ENUMS as CALLBACK_ENUMS};
