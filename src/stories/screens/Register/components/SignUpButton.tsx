import React, {Component} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Button} from 'native-base';
import i18n from '../../../../common/i18n';
import {PRIMARY_COLOR, PRIMARY_COLOR_NEW} from '../../../../utilities/Theme';
import {Text} from '@balletworkout/components';
const {width, height} = Dimensions.get('window');

interface Props {
  register: Function;
  paddingLeft?: number | string;
  paddingRight?: number | string;
}
interface State {}
export default class SignUpButton extends Component<Props, State> {
  render() {
    const {paddingLeft, paddingRight} = this.props;
    return (
      <View style={[styles.container]}>
        <Button
          iconLeft
          style={[styles.signUpButton, {paddingLeft, paddingRight}]}
          onPress={() => this.props.register()}>
          <Text style={[styles.textWhite, styles.textBold, styles.buttonText]}>
            {' '}
            {i18n.t('auth.sign_up_button')}{' '}
          </Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 30,
    width: '100%',
  },
  signUpButton: {
    padding: 40,
    backgroundColor: PRIMARY_COLOR_NEW,
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    width: '100%',
    textAlign: 'center',
    height: 54,
  },
  textWhite: {
    color: '#ffffff',
    width: '100%',
    textAlign: 'center',
  },
  textBold: {
    // fontFamily: 'Montserrat-Bold',
  },
  buttonText: {
    fontSize: 15,
    // fontFamily: 'Montserrat-SemiBold',
    textTransform: 'capitalize',
  },
});
