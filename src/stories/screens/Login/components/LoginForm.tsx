import React, {Component} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
} from 'react-native';
import {Form, Item, Input, Button, Toast} from 'native-base';
import i18n from '../../../../common/i18n';
import {PRIMARY_COLOR, HEIGHT} from '@balletworkout/utilities/Theme';
import LoginButton from './LoginButton';
import CheckBox from '@react-native-community/checkbox';
import {Text} from '@balletworkout/components';
import Icon from 'react-native-vector-icons/AntDesign';

const VIEW_CALLBACK_ENUMS = {
  LOGIN_FORM_LOGIN: 'loginform/login',
};

interface Props {
  setForgotPasswordVisibility: Function;
  callbackHandler: Function;
}
interface State {
  email: string;
  password: string;
  showPassword: boolean;
}
export default class LoginForm extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showPassword: false,
    };
  }

  login() {
    if (this.state.email === '' || this.state.password === '') {
      Toast.show({
        text: i18n.t('auth.email_password_required'),
      });
      return;
    }

    this.props.callbackHandler(VIEW_CALLBACK_ENUMS.LOGIN_FORM_LOGIN, {
      email: this.state.email,
      password: this.state.password,
    });
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <Form style={styles.loginForm}>
          <View style={styles.inputItem}>
            {/*<Icon style={[styles.icon]} active name='person' />*/}
            <Input
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.inputField]}
              value={this.state.email}
              placeholder={i18n.t('auth.youremail')}
              placeholderTextColor="#adadad"
              onChangeText={text => this.setState({email: text})}
            />
          </View>
          <View style={styles.inputItem}>
            {/*<Icon type="FontAwesome" style={[styles.icon]} active name='lock' />*/}
            <Input
              autoCapitalize="none"
              secureTextEntry={!this.state.showPassword}
              style={[styles.inputField]}
              value={this.state.password}
              placeholder={i18n.t('auth.yourpassword')}
              placeholderTextColor="#adadad"
              onChangeText={text => this.setState({password: text})}
            />
            {/*<Text onPress={() => this.setState({ showPassword: !this.state.showPassword })} style={[styles.showPassword, styles.textWhite]}>{this.state.showPassword ? i18n.t('auth.hide_password_button') : i18n.t('auth.show_password_button')}</Text>*/}
          </View>

          <View style={styles.remindRowContainer}>
            <TouchableOpacity
              style={[styles.remindRowButton, {justifyContent: 'flex-start'}]}>
              <View style={styles.checkboxButton}>
                <Icon name="check" style={{fontSize: 15}} color="#32AE98" />
              </View>
              <Text style={styles.remindText} font="Regular">
                {i18n.t('auth.remember_me')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.remindRowButton, {justifyContent: 'flex-end'}]}
              onPress={() => this.props.setForgotPasswordVisibility(true)}>
              <Text font="Regular" style={styles.remindText}>
                {i18n.t('auth.forgot_password')}
              </Text>
            </TouchableOpacity>
          </View>
        </Form>
        <LoginButton login={() => this.login()} />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: HEIGHT <= 667 ? 15 : 20,
  },
  loginForm: {
    width: '100%',
  },
  inputItem: {
    marginLeft: 0,
    marginBottom: 15,
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
  icon: {
    marginLeft: 10,
    color: '#ffffff',
    fontSize: 20,
  },
  remindRowContainer: {
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkboxButton: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#32AE98',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remindRowButton: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  remindText: {
    fontSize: 12,
    color: '#2E2E2E',
    marginLeft: 5,
  },
  showPassword: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  loginButton: {
    paddingBottom: 4,
    marginTop: 15,
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
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
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 15,
  },
});
export {VIEW_CALLBACK_ENUMS as LOGIN_FORM_CALLBACK_ENUMS};
