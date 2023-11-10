import React, {Component} from 'react';
import {View, KeyboardAvoidingView, StyleSheet} from 'react-native';
import {Form, Item, Icon, Input, Button, Toast} from 'native-base';
import i18n from '../../../../common/i18n';
import {
  SECONDARY_COLOR,
  PRIMARY_COLOR,
  HEIGHT,
} from '../../../../utilities/Theme';
import DeviceInfo from 'react-native-device-info';
import {
  isIPhoneX,
  isAndroid,
  isTab,
  isIPhone,
  isIpad,
  isIphoneSe,
} from '../../../../utilities/Screen';
import SignUpButton from './../../Register/components/SignUpButton';
import {Text} from '@balletworkout/components';
const VIEW_CALLBACK_ENUM = {
  REGISTER_FORM_REGISTRATION: 'registeration/registration-form',
};

interface Props {
  viewCallbackHandler: Function;
  language: string;
}
interface State {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  country: string;
  timezone: string;
  language: string;
  showPassword: boolean;
}

export default class RegisterForm extends Component<Props, State> {
  state = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    country: DeviceInfo.isEmulator() ? 'BE' : DeviceInfo.getDeviceCountry(),
    timezone: DeviceInfo.isEmulator()
      ? 'Europe/Brussels'
      : DeviceInfo.getTimezone(),
    language: this.props.language,
    showPassword: false,
  };

  register() {
    const {
      first_name,
      last_name,
      email,
      password,
      country,
      timezone,
      language,
    } = this.state;
    try {
      let data = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        country: country,
        timezone: timezone,
        language: language,
      };

      if (
        data.first_name === '' ||
        data.last_name === '' ||
        data.email === '' ||
        data.password === ''
      ) {
        Toast.show({
          position: 'top',
          text: i18n.t('auth.registration_error'),
        });
        return;
      }

      this.props.viewCallbackHandler(
        VIEW_CALLBACK_ENUM.REGISTER_FORM_REGISTRATION,
        data,
      );
    } catch (e) {
      // console.log(e);
    }
  }

  componentWillReceiveProps() {
    this.setState({language: this.props.language});
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <Form style={styles.registerForm}>
          {/*<View style={[styles.row]}>*/}
          <View style={[styles.inputItem]}>
            {/*<Icon style={[styles.icon]} active name='person' />*/}
            <Input
              style={[styles.inputField]}
              value={this.state.first_name}
              placeholder={i18n.t('auth.first_name')}
              placeholderTextColor="#adadad"
              onChangeText={text => this.setState({first_name: text})}
            />
          </View>

          <View style={styles.inputItem}>
            <Input
              style={[styles.inputField]}
              value={this.state.last_name}
              placeholder={i18n.t('auth.last_name')}
              placeholderTextColor="#adadad"
              onChangeText={text => this.setState({last_name: text})}
            />
          </View>
          {/*</View>*/}

          <View style={styles.inputItem}>
            {/*<Icon style={[styles.icon]} name='mail' />*/}
            <Input
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.inputField]}
              value={this.state.email}
              placeholder={i18n.t('auth.email')}
              placeholderTextColor="#adadad"
              onChangeText={text => this.setState({email: text})}
            />
          </View>

          <View style={styles.inputItem}>
            {/*<Icon type="FontAwesome" style={[styles.icon]} name="lock"/>*/}
            <Input
              secureTextEntry={!this.state.showPassword}
              style={[styles.inputField]}
              value={this.state.password}
              placeholder={i18n.t('auth.password')}
              placeholderTextColor="#adadad"
              onChangeText={text => this.setState({password: text})}
            />
            {/*<Text onPress={() => this.setState({ showPassword: !this.state.showPassword })} style={[styles.showPassword, styles.textWhite]}>{this.state.showPassword ? i18n.t('auth.hide_password_button') : i18n.t('auth.show_password_button')}</Text>*/}
          </View>
        </Form>
        <View style={{alignSelf: 'flex-start'}}>
          <Text font="Regular" style={{color: '#2E2E2E', fontSize: 11}}>
            {/* By signing up you agree to our Term of use and privacy notice */}
            By signing up you agree to our
            <Text font="Regular" style={{textDecorationLine: 'underline'}}>
              {' '}
              Term of use{'\n'}
            </Text>{' '}
            and{' '}
            <Text font="Regular" style={{textDecorationLine: 'underline'}}>
              privacy notice
            </Text>
          </Text>
        </View>
        <SignUpButton
          paddingLeft={52}
          paddingRight={52}
          register={() => this.register()}
        />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: -1, //isIPhoneX ? 3 : isAndroid ? 5 : isIPhone && !isIpad ? 4 : isIphoneSe ? 2 : 2,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: HEIGHT <= 667 ? 15 : 20,
  },
  registerForm: {
    width: '100%',
  },
  inputItem: {
    marginLeft: 0,
    marginBottom: 20,
    backgroundColor: 'rgba(173, 173, 173, 0.1)',
    borderRadius: 10,
    height: 56,
    borderWidth: 0,
  },
  inputField: {
    fontSize: 16,
    color: '#222222',
    paddingLeft: 20,
  },
  row: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  inputItemHalf: {
    flex: 0.5,
  },
  textWhite: {
    color: '#ffffff',
  },
  textBold: {
    fontFamily: 'Montserrat-Bold',
  },
  noMarginLeft: {
    marginLeft: 0,
  },
  icon: {
    marginLeft: 10,
    color: '#ffffff',
    fontSize: 20,
  },
  showPassword: {
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
    textTransform: 'capitalize',
  },
});

export {VIEW_CALLBACK_ENUM as REGISTER_FORM_CALLBACK_ENUMS};
