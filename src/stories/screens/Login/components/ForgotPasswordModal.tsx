import React, { Component } from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Button,
  Left,
  Right,
  Item,
  Input,
  Toast,
} from 'native-base';
import {
  PADDING_LEFT_RIGHT,
  HEIGHT,
  WIDTH,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from './../../../../utilities/Theme';
import { isTab, isIpad } from './../../../../utilities/Screen';
import { baseUrlApi } from './../../../../common/appConstants';
import i18n from '../../../../common/i18n';
import axios from 'axios';
import Loader from '../../../../common/components/Loader';

const VIEW_CALLBACK_ENUMS = {
  FORGOT_PASSWORD_SEND_REQUEST: 'forgot-password/send-request',
  CANCEL_FORGOT_PASSWORD: 'forgot-password/cancel',
};

interface Props {
  setVisibility: Function;
  isVisible: boolean;
  store: any;
}
interface State {
  email: string;
  isLoading: boolean;
}

function validateEmail(email:any){
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  return reg.test(email);
}

export default class ForgotPasswordModal extends Component<Props, State> {
  state = {
    email: '',
    isLoading: false,
  };

  constructor(props: any) {
    super(props);
  }

  _onCancelButton() {
    this.props.setVisibility(false);
    this.setState({ email: ''})
  }

  _onSendButton() {
    this.sendRequest(this.state.email.trim());
  }

  sendRequest(email: string) {
    if (!email) {
      Toast.show({
        text: i18n.t('auth.email_required_error'),
        position:'top'
      });
      return;
    }

    if(!validateEmail(email)){
      Toast.show({
        text: i18n.t('auth.isEmailValid'),
        position: 'top',
      });
      return 
    }

    this.setState({ isLoading: true });
    axios
      .post(`${baseUrlApi}user/request-password-reset`, {
        email: email,
      })
      .then(({ data }) => {
        // console.log(data);
        this.setState({ isLoading: false });
        Toast.show({
          text: `Mail with password reset link sent to your email id ${email}`,
          position:'top'
        });
        this.props.setVisibility(false);
        this.setState({ email: ''})
      })
      .catch(({ response }) => {
        // console.log(response);
        this.setState({ isLoading: false });
        Toast.show({
          text: response.data.error,
          position: 'top',
          style: {
            marginTop: Platform.OS=='ios' ? HEIGHT * 0.01 : 0
          }
        });
      });
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={ this.props.isVisible}
        onRequestClose={() => {
          //Alert.alert('Modal has been closed.');
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.modalBody]}>
          {!this.state.isLoading || <Loader />}
          <KeyboardAvoidingView  behavior={'padding'}>
              <View style={styles.modalContent}>
                <Text style={styles.titleText}>
                  {i18n.t('auth.forgot_password')}
                </Text>

                <View style={styles.forgotPasswordContent}>
                  <Item>
                    <Input
                      autoCapitalize="none"
                      keyboardType="email-address"
                      placeholder={i18n.t('auth.forgot_password_email_placeholder')}
                      onChangeText={(value: string) =>
                        this.setState({ email: value.trim() })
                      }
                      value={this.state.email}
                    />
                  </Item>
                </View>

                {/* Goal Modal Buttons */}
                <View style={styles.modalButtons}>
                  <Left style={{ flex: 1 }}>
                    <Button
                      block
                      transparent
                      onPress={() => this._onCancelButton()}>
                      <Text>{i18n.t('auth.cancel_btn_text')}</Text>
                    </Button>
                  </Left>
                  <Right style={{ flex: 1 }}>
                    <Button
                      block
                      style={styles.startButton}
                      onPress={() => this._onSendButton()}>
                      <Text style={styles.startButtonText}>
                        {i18n.t('auth.send_request_btn_text')}
                      </Text>
                    </Button>
                  </Right>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBody: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    height: HEIGHT * 0.4,
    width: WIDTH * 0.9,
    paddingHorizontal: isTab || isIpad ? 25 : PADDING_LEFT_RIGHT,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: SECONDARY_COLOR,
  },
  titleText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: PRIMARY_COLOR,
    textAlign: 'center',
    marginTop: 25,
  },
  forgotPasswordContent: {
    flex: 1,
    marginTop: 25,
  },
  timePickerIOS: {
    flex: 1,
    justifyContent: 'center',
  },
  modalButtons: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'stretch',
    bottom: 15,
  },
  startButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  startButtonText: {
    color: '#ffffff',
  },
});
export { VIEW_CALLBACK_ENUMS as GOAL_FORM_ENUM };
