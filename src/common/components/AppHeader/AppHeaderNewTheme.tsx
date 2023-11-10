import React, {Component} from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {
  Header,
  Body,
  Left,
  Right,
  StyleProvider,
  Container,
  Title,
  Button,
} from 'native-base';
import Icon from "react-native-vector-icons/AntDesign";
import Logo from './../Logo';
import {
  PADDING_LEFT_RIGHT,
  LIGHT_PRIMARY_COLOR,
  WIDTH,
  HEIGHT,
} from '../../../utilities/Theme';
import {isIPhone, isIpad, isTab} from '../../../utilities/Screen';

interface Props {
  hasBackButton?: boolean;
  navigation: any;
  hasTabs?: boolean;
  hasBackgroundColor: boolean;
}
interface State {}
export default class AppHeaderNewTheme extends Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    hasBackButton: true,
    hasTabs: false,
    hasBackgroundColor: true,
  };

  render() {
    return (
      <Header
        hasTabs={this.props.hasTabs}
        noShadow
        androidStatusBarColor={'#464c6e'}
        style={[
          styles.header,
          {
            backgroundColor: this.props.hasBackgroundColor
              ? LIGHT_PRIMARY_COLOR
              : 'transperent',
          },
        ]}>
        {this.props.hasBackButton ? (
            // <TouchableOpacity style={{marginLeft: -WIDTH * 0.02,marginTop: Platform.OS=='android' ? HEIGHT * 0.02 : 0}} onPress={() => this.props.navigation.goBack()}>
            //   <Image source={require('../../../assets/icons/backIcon.png')} resizeMode='cover' style={{width: WIDTH * 0.09, height: WIDTH * 0.09}} />
            // </TouchableOpacity>
            <TouchableOpacity style={{marginLeft: -WIDTH * 0.02,marginTop: Platform.OS=='android' ? HEIGHT * 0.03 : 0,width: 40}} onPress={() => this.props.navigation.goBack()}>
              <Icon name="left" style={{fontSize: WIDTH * 0.06}}/>
            </TouchableOpacity>
        ) : (
          <Left style={styles.headerLeftRight} />
        )}
        {/* <Body style={styles.headerBody}>
          <Logo />
        </Body>
        <Right /> */}
      </Header>
    );
  }
}

const styles = StyleSheet.create({
  conatianer: {
    flex: 1,
  },
  header: {
    zIndex: 9999999,
    height: HEIGHT * 0.07, //isIPhone ? 85 : 65,
    paddingLeft: isIpad || isTab ? 25 : PADDING_LEFT_RIGHT,
    paddingRight: isIpad || isTab ? 25 : PADDING_LEFT_RIGHT,
    justifyContent: 'space-between',
  },
  headerBody: {
    flex: 0,
  },
  headerLeftRight: {
    flex: 1,
  },
  icon: {
    fontSize: 25,
    color: '#032426',
  },
});
