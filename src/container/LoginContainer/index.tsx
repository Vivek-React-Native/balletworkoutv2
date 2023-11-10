import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Text,
  StatusBar,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Container, Toast } from 'native-base';
import { connect } from 'react-redux';
import DefaultPreference from 'react-native-default-preference';
import {
  doLogin,
  doLoginWithFb,
  doLoginWithApple,
  doRegister,
  doRegisterationWithFb,
  doRegisterationWithApple,
} from './../../common/auth/actions';
import { PADDING_LEFT_RIGHT, WIDTH, HEIGHT } from './../../utilities/Theme';
import NoConnection from '../../common/components/NoConnection';
import Loader from '../../common/components/Loader';
import ForgotPasswordModal from '../../stories/screens/Login/components/ForgotPasswordModal';
import i18n from '../../common/i18n';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import appleAuth, {
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import { navigationAfterRegistration } from '../../common/temp/actions';
import * as RNLocalize from 'react-native-localize';
import { getDefaultPref } from '../../utilities/Functions';

function validateEmail(email:any){
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  return reg.test(email);
}

interface State {
  showLogin: boolean;
  registerFirstName: string;
  registerEmail: string;
  registerPassword: string;
  loginEmail: string;
  loginPassword: string;
  forgotPasswordVisibility: boolean;
  isRegister: boolean;
  isLoading: boolean;
  country: any;
  timezone: any;
  language: any;
  isRegistering: boolean
}
interface Props {
  auth: any;
  dologin: Function;
  doLoginWithFb: Function;
  doLoginWithApple: Function;
  doRegister: Function;
  doRegisterWithFb: Function;
  doRegisterWithApple: Function;
  navigation: any;
  screenProps: any;
}

class LoginContainer extends Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.beforeRegistration()
  }

  state = {
    showLogin: false,
    registerFirstName: '',
    registerEmail: '',
    registerPassword: '',
    loginEmail: '',
    loginPassword: '',
    forgotPasswordVisibility: false,
    isRegister: true,
    isLoading: false,
    country: DeviceInfo.isEmulator() ? 'BE' : DeviceInfo.getDeviceCountry(),
    timezone: DeviceInfo.isEmulator()
      ? 'Europe/Brussels'
      : DeviceInfo.getTimezone(),
    language: 'en-US',
    isRegistering: false,
  };

  static navigationOptions = {
    header: null,
  };

  unSubscribeStore: Function;

  language: string;
  loggedIn: boolean = false;

  isUnmounted: boolean = false;

  _isMounted: boolean = false;



  async componentDidMount() {

    // console.log('Language........',i18n.language)

    AsyncStorage.setItem('isRegistering', '0');
    const language =async()=>  await AsyncStorage.getItem('language');
    // console.log('language Start...',language)

    // console.log('register state....', this.state.isRegister)
    if (this.state.isRegister == false) {
      this._isMounted = true;
      this.setState({
        country: DeviceInfo.isEmulator() ? 'BE' : RNLocalize.getCountry(),
        timezone: RNLocalize.getTimeZone() || 'Europe/Brussels',
      });
      const { screenProps: { firstTimeLaunch, store } } = this.props;
      // console.log(store.getState());
      let isLoading = store.getState().auth.isLoading;

      this.setState({ isLoading });

      this.unSubscribeStore = store.subscribe(() => {
        let isLoggedIn = store.getState().auth.isLoggedIn;
        let errors = store.getState().auth.errors;

        let isLoading = store.getState().auth.isLoading;
        if (this._isMounted) {
          this.setState({ isLoading });
        }

        if (isLoggedIn > 0) {
          // console.log("Logged in");
          let lang =  store.getState().auth.isLoggedIn ? store.getState().auth.userData?.language || language() : 'en-US';
          const async = async()=> await AsyncStorage.setItem('language', lang)
          async()
          // console.log('lang....',lang)
          i18n.changeLanguage(lang);

          Toast.show({
            text: i18n.t('auth.login_success_message'),
          });

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
    } else {
      const { screenProps: { firstTimeLaunch, store } } = this.props;

      if (
        firstTimeLaunch !== null &&
        (typeof firstTimeLaunch !== 'undefined' && firstTimeLaunch === '1')
      ) {
        this.setState({ showLogin: true });
      }

      this.settingIsLoginScreen()
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

      this.unSubscribeStore = store.subscribe(() => {
        let isLoggedIn = store.getState().auth.isLoggedIn;
        let errors = store.getState().auth.errors;

        let isLoading = store.getState().auth.isLoading;

        if (!this.isUnmounted) this.setState({ isLoading });

        // const language = async ()=> await AsyncStorage.getItem('language');

        if (isLoggedIn > 0) {
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
          if (errors.message.startsWith('Undef')) return;
          Toast.show({
            text: errors.message,
            //buttonText: "Try again",
            position: 'top',
          });
        }
      });
      this.setState({ isLoading:false });
    }
  }

  async beforeRegistration() {
    const { store } = this.props.screenProps;
    let isFirst = store.getState().ChooseDays.isFirst;
    let first_time_registration = await getDefaultPref(
      'first_time_registration',
    );

    let loginStatus = store.getState().auth.isLoggedIn;
    if (loginStatus) {
      if (!isFirst) {
        this.props.navigation.navigate('app');
      } else {
        this.props.navigation.navigate('welcome');
      }
      // console.log('loggedin block');
    } else if (!loginStatus && first_time_registration !== null) {
      // console.log('else if block');
      // this.props.navigation.navigate('login');
    } else {
      // console.log('else block', first_time_registration);
    }
  }

  register() {
    let data = {
      first_name: this.state.registerFirstName,
      last_name: ' ',
      email: this.state.registerEmail,
      password: this.state.registerPassword,
      country: this.state.country,
      timezone: this.state.timezone,
      language: this.state.language,
    };

    if (
      data.first_name === '' ||
      data.email === '' ||
      data.password === ''
    ) {
      Toast.show({
        position: 'top',
        text: i18n.t('auth.registration_error'),
      });
      return;
    }

    if(!validateEmail(data.email)){
      Toast.show({
        text: i18n.t('auth.isEmailValid'),
        position: 'top',
      });
      return 
    }

    if(this.state.registerPassword.length < 4){
      Toast.show({
        text: i18n.t('auth.passwordLength'),
        position: 'top',
      });
      return 
    }

    this.callbackHandler(
      'registeration/registration-form',
      data,
    );
  }

  async settingIsLoginScreen() {
    const isData = await AsyncStorage.getItem('FirstTime');

    if (isData) {
      this.setState({ isRegister: false })
    } else {
      await AsyncStorage.setItem('FirstTime', JSON.stringify(true));
      this.setState({ isRegister: true })
    }
  }

  callbackHandler = (type: string, data: any) => {
    switch (type) {
      case 'loginform/login':
        this.props.dologin(data);
        break;
      case 'login/login-with-facebook':
        this.props.doLoginWithFb(data);
        break;
      case 'login/login-with-apple':
        this.props.doLoginWithApple(data);
        break;
      case 'registeration/registration-form':
        this.setState({ isRegistering: true });
        this.props.doRegister(data);
        break;
      case 'registration/register-with-facebook':
        this.props.doRegisterWithFb(data);
        break;
      case 'registration/register-with-apple':
        this.props.doRegisterWithApple(data);
        break;
    }
  };

  async onDoneCallback() {
    await DefaultPreference.set('app_first_launch_performed', '1');
    this.props.screenProps.setFirstTime();
    this.setState({ showLogin: true });
  }

  async onSkipCallback() {
    await DefaultPreference.set('app_first_launch_performed', '1');
    this.setState({ showLogin: true });
  }

  async onNavigationCallback(routeName: string, params: any) {
    await DefaultPreference.set('app_first_launch_performed', '1');
    this.props.screenProps.setFirstTime();
    this.setState({ showLogin: true });
    this.props.navigation.navigate(routeName, params);
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unSubscribeStore();
  }

  fbLoginHandler = async (isRegister: boolean = false) => {
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
          country: RNLocalize.getCountry(),
          timezone: RNLocalize.getTimeZone() || 'Europe/Brussels',
          language: i18n.language || 'en-US'
        };

        if (isRegister) {
          this.callbackHandler('registration/register-with-facebook', loginData)
        } else {
          this.callbackHandler('login/login-with-facebook', data);
        }
      }
    } catch (e) {
      Toast.show({
        text: i18n.t('auth.facebook_error'),
      });
    }
  };

  appleLoginHandler = async (isRegister: boolean = false) => {
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
        let data = {
          identityToken: appleAuthRequestResponse.identityToken,
        };
        
        let loginData = {
          identityToken: appleAuthRequestResponse.identityToken,
          country: RNLocalize.getCountry(),
          timezone: RNLocalize.getTimeZone() || 'Europe/Brussels',
          language: i18n.language || 'en-US'
        };

        if (isRegister) {
          // console.log('apple register')
          this.callbackHandler('registration/register-with-apple', loginData)
        } else {
          // console.log('apple login',data)
          this.callbackHandler('login/login-with-apple', data);
        }
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

  handleLink = (url: string) => {
    Linking.openURL(url).catch((error: any) => console.warn(error));
  };

  render() {
    const { store } = this.props.screenProps;
    const bgImage = require('../../assets/images/pinkLinearGradient.png');
    const balletLady = require('../../assets/images/BalletModel.png');

    return (
      <View style={styles.container}>
        {this.props.screenProps.isConnectedToNetwork ? null : <NoConnection />}
        <StatusBar hidden barStyle="light-content" />
        <ForgotPasswordModal isVisible={this.state.forgotPasswordVisibility} setVisibility={() => this.setState({ forgotPasswordVisibility: false })} store={store} />

        {/*<Image source={loginPng} style={styles.imageBackground} />*/}
        {/*<LinearGradient colors={['rgba(70,76,110,0.7)', 'rgba(210,149,159,0.5)']} style={styles.overlay}></LinearGradient>*/}
        {/* <Login store={store} callbackHandler={this.callbackHandler} parentProps={this.props} navigation={this.props.navigation} /> */}
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={'padding'}>
          {this.state.isLoading && <Loader />}

          <View style={{ flex: 2, overflow: 'hidden' }}>
            <ImageBackground source={bgImage} resizeMode="cover" style={{width: '100%',height: '100%',alignItems: 'center',justifyContent: 'center'}}>
              <Image source={balletLady} resizeMode="contain" style={{ width: WIDTH * 0.45, height: WIDTH * 0.45 }} />
            </ImageBackground>

            <View
              style={styles.topTabBar}>
              <TouchableOpacity onPress={() => this.setState({ isRegister: true })} style={[styles.TopButtons,{ borderColor: this.state.isRegister ? '#fff' : 'transparent' }]}>
                <Text style={[styles.TopButtonText, { opacity: this.state.isRegister ? 1 : 0.5 }]}>{i18n.t('auth.Register')}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.setState({ isRegister: false })} style={[styles.TopButtons,{ borderColor: this.state.isRegister ? 'transparent' : '#fff' }]}>
                <Text style={[styles.TopButtonText, { opacity: this.state.isRegister ? 0.5 : 1 }]}>{i18n.t('auth.Login')}</Text>
              </TouchableOpacity>
            </View>
          </View>


          <View style={{ flex: 5, backgroundColor: '#ffffff99' }}>
            <ScrollView>
              {this.state.isRegister ? (
                <View style={{ flex: 1, paddingHorizontal: WIDTH * 0.05, paddingVertical: HEIGHT * 0.01 }}>
                  <TextInput placeholder={i18n.t('auth.Your First Name')} placeholderTextColor="#00000050" style={[styles.Input,{marginTop: HEIGHT * 0.015}]} onChangeText={val => this.setState({ registerFirstName: val.trim() })} secureTextEntry={false} returnKeyType="next" value={this.state.registerFirstName} />

                  <TextInput placeholder={i18n.t('auth.Your E-Mail')} placeholderTextColor="#00000050" style={styles.Input} onChangeText={val => this.setState({ registerEmail: val.trim() })} returnKeyType="next" secureTextEntry={false} value={this.state.registerEmail} />

                  <TextInput placeholder={i18n.t('auth.Your Password')} placeholderTextColor="#00000050" style={styles.Input} onChangeText={val => this.setState({ registerPassword: val.trim() })} secureTextEntry={true} returnKeyType="done" value={this.state.registerPassword} />

                  <TouchableOpacity onPress={() => this.register()} style={[styles.FacebookButton,{ backgroundColor: '#A45A79', paddingVertical: HEIGHT * 0.02 }]}>
                    <Text style={styles.fbButtonText}>{i18n.t('auth.Register Now')}</Text>
                  </TouchableOpacity>

                  <View style={{ marginVertical: HEIGHT * 0.02, justifyContent: 'center', alignItems: "center" }}>
                    <View style={styles.flexRow}>
                      <Text style={styles.extraText}>{i18n.t('auth.byclicking')}{' '}</Text>
                      <TouchableOpacity onPress={() => Linking.openURL(`https://miessen.io/Terms.html?lang=${i18n.language.substring(0, 2)}`)}><Text style={styles.privacyText}>{i18n.t('auth.Terms')}</Text></TouchableOpacity>
                    </View>
                    <View style={styles.flexRow}>
                      <Text style={styles.extraText}>{i18n.t('auth.andOur')}{' '}</Text>
                      <TouchableOpacity onPress={() => Linking.openURL(`https://miessen.io/Privacy.html?lang=${i18n.language.substring(0, 2)}`)}><Text style={styles.privacyText}>{i18n.t('auth.PrivacyPolicy')}{' '}</Text></TouchableOpacity>
                      <Text style={styles.extraText}>{i18n.t('auth.agreeTo')}</Text>
                    </View>
                    <Text style={styles.extraText}>{i18n.t('auth.notificationsAbout')}</Text>
                    <Text style={styles.extraText}>{i18n.t('auth.fromAt')}</Text>
                  </View>

                  <View style={[styles.DeviderView,{marginTop: 2}]}>
                    <View style={styles.Devider} />
                    <Text style={{marginHorizontal: WIDTH * 0.02,fontSize: WIDTH * 0.035}}>
                      {i18n.t('auth.RegisterViaSocial')}
                    </Text>
                    <View style={styles.Devider} />
                  </View>

                  <TouchableOpacity onPress={() => this.fbLoginHandler(true)} style={[styles.FacebookButton,{ backgroundColor: '#1977F3' }]}>
                    <Image source={require('../../assets/icons/facebookIcon.png')} resizeMode="contain" style={styles.facebookIcon} />
                    <Text style={styles.fbButtonText}>
                      {i18n.t('auth.RegisterviaFacebook')}
                    </Text>
                  </TouchableOpacity>

                  {Platform.OS == 'ios' && (
                    <TouchableOpacity onPress={() => this.appleLoginHandler(true)} style={[styles.FacebookButton,{ backgroundColor: '#032426' }]}>
                      <Image source={require('../../assets/icons/AppleIcon.png')} resizeMode="contain" style={styles.facebookIcon} />
                      <Text style={styles.fbButtonText}>
                        {i18n.t('auth.RegisterviaApple')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View style={{ flex: 1, paddingHorizontal: WIDTH * 0.05, paddingVertical: HEIGHT * 0.01 }}>
                  <TextInput placeholder={i18n.t('auth.Your E-Mail')} placeholderTextColor="#00000050" style={[styles.Input,{marginTop: HEIGHT * 0.015}]} onChangeText={val => this.setState({ loginEmail: val.trim() })} secureTextEntry={false} returnKeyType="next" value={this.state.loginEmail} />

                  <TextInput placeholder={i18n.t('auth.Your Password')} placeholderTextColor="#00000050" style={styles.Input} onChangeText={val => this.setState({ loginPassword: val.trim() })} returnKeyType="done" secureTextEntry={true} value={this.state.loginPassword} />

                  <TouchableOpacity onPress={() => {
                    if(!validateEmail(this.state.loginEmail)){
                      return Toast.show({text: i18n.t('auth.isEmailValid'),position: 'top'});
                    }
                    this.callbackHandler('loginform/login', { email: this.state.loginEmail, password: this.state.loginPassword })
                  }}
                    style={[
                      styles.FacebookButton,
                      {
                        backgroundColor: '#A45A79',
                        paddingVertical: HEIGHT * 0.02,
                        marginTop: 0,
                      },
                    ]}>
                    <Text style={styles.fbButtonText}>{i18n.t('auth.LoginNow')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.setState({ forgotPasswordVisibility: true })}
                    style={{marginTop: HEIGHT * 0.03,alignSelf: 'center',paddingHorizontal: WIDTH * 0.1}}>
                    <Text style={{ color: '#2E2E2E',fontSize: WIDTH * 0.03 }}>{i18n.t('auth.ForgotPassword')}</Text>
                  </TouchableOpacity>

                    <View style={[styles.DeviderView, {marginTop: HEIGHT * 0.03}]}>
                      <View style={styles.Devider} />
                      <Text style={{ marginHorizontal: WIDTH * 0.02,fontSize: WIDTH * 0.035 }}>
                        {i18n.t('auth.LoginViaSocials')}
                      </Text>
                      <View style={styles.Devider} />
                    </View>
                    
                  <TouchableOpacity onPress={() => this.fbLoginHandler()} style={[ styles.FacebookButton,{ backgroundColor: '#1977F3' }]}>
                    <Image source={require('../../assets/icons/facebookIcon.png')} resizeMode="contain" style={styles.facebookIcon} />
                    <Text style={styles.fbButtonText}>
                      {i18n.t('auth.ContinueWithFB')}
                    </Text>
                  </TouchableOpacity>

                  {Platform.OS == 'ios' && (
                  <TouchableOpacity onPress={() => this.appleLoginHandler()} style={[styles.FacebookButton,{ backgroundColor: '#032426' }]}>
                    <Image source={require('../../assets/icons/AppleIcon.png')} resizeMode="contain" style={styles.facebookIcon} />
                    <Text style={styles.fbButtonText}>{i18n.t('auth.ContinueWithApple')}</Text>
                  </TouchableOpacity>
                  )}
                </View>
              )}
            </ScrollView>
          </View>

        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    width: WIDTH >= 768 ? WIDTH - PADDING_LEFT_RIGHT * 2 : '100%',
    height: Platform.OS === 'ios' ? HEIGHT : HEIGHT - 15,
    resizeMode: 'cover',
    marginLeft: PADDING_LEFT_RIGHT,
  },
  topTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    width: '100%',
    height: '100%',
  },
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
  FacebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHT * 0.015,
    paddingHorizontal: WIDTH * 0.07,
    marginTop: HEIGHT * 0.01,
    borderRadius: WIDTH * 0.03,
  },
  facebookIcon: {
    width: WIDTH * 0.09,
    height: WIDTH * 0.09,
  },
  fbButtonText: {
    fontSize: WIDTH * 0.04,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  DeviderView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: HEIGHT * 0.02,
  },
  Devider: { backgroundColor: '#000', flex: 1, height: 1.5 },
  Input: {
    backgroundColor: '#ADADAD30',
    paddingVertical: HEIGHT * 0.02,
    paddingHorizontal: WIDTH * 0.05,
    borderRadius: WIDTH * 0.03,
    marginBottom: HEIGHT * 0.02,
  },
  flexRow: { flexDirection: 'row', alignItems: 'center' },
  extraText: { textAlign: 'center', fontSize: WIDTH * 0.027, color: '#6D7C85' },
  privacyText: { textAlign: 'center', textDecorationLine: 'underline', fontSize: WIDTH * 0.027, color: '#000' }
});

const mapStateToProps = (state: any) => {
  const { auth } = state;

  return {
    auth,
  };
};

const mapDispatchToProps = (dispatch: Function) => {
  return {
    dologin: (loginData: any) => {
      dispatch(doLogin(loginData));
    },
    doLoginWithFb: (loginData: any) => {
      dispatch(doLoginWithFb(loginData));
    },
    doLoginWithApple: (loginData: any) => {
      dispatch(doLoginWithApple(loginData));
    },
    doRegister: (userData: any) => {
      dispatch(doRegister(userData));
    },
    doRegisterWithFb: (loginData: any) => {
      dispatch(doRegisterationWithFb(loginData));
    },
    doRegisterWithApple: (loginData: any) => {
      dispatch(doRegisterationWithApple(loginData));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginContainer);
