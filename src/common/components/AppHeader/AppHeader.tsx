import React, {Component} from 'react';
import {View, Image, StyleSheet} from 'react-native';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Logo from './../Logo';
import {PADDING_LEFT_RIGHT, PRIMARY_COLOR} from '../../../utilities/Theme';
import {isIPhone, isIpad, isTab} from '../../../utilities/Screen';

interface Props {
  hasBackButton?: boolean;
  navigation: any;
  hasTabs?: boolean;
}
interface State {}
export default class AppHeader extends Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    hasBackButton: true,
    hasTabs: false,
  };

  render() {
    return (
      <Header
        hasTabs={this.props.hasTabs}
        noShadow
        androidStatusBarColor={'#464c6e'}
        style={styles.header}>
        {this.props.hasBackButton ? (
          <Left style={styles.headerLeftRight}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-left" style={styles.icon} />
            </Button>
          </Left>
        ) : (
          <Left style={styles.headerLeftRight} />
        )}
        <Body style={styles.headerBody}>
          <Logo />
        </Body>
        <Right />
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
    height: isIPhone ? 85 : 65,
    paddingLeft: isIpad || isTab ? 25 : PADDING_LEFT_RIGHT,
    paddingRight: isIpad || isTab ? 25 : PADDING_LEFT_RIGHT,
    backgroundColor: PRIMARY_COLOR,
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
    color: '#ffffff',
  },
});
