import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Header, Body, Left, Right, StyleProvider, Container, Title, Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Logo from './Logo';
import { PADDING_LEFT_RIGHT } from './../../../../utilities/Theme';
import { isIPhone } from './../../../../utilities/Screen';

interface Props {
    navigation: any;
};
interface State {};
export default class ExerciseHeader extends Component<Props, State> {
  render() {
    return (
      <Header noShadow androidStatusBarColor={'#464c6e'} style={styles.header}>
        <Left style={styles.headerLeftRight}>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-left" style={styles.icon} />
          </Button>
        </Left>
        <Body style={styles.headerBody}>
          <Logo/>
        </Body>
        <Right/>
      </Header>
    );
  }
}

const styles = StyleSheet.create({
  conatianer: {
    flex: 1,
  },
  header: {
    height: isIPhone? 85: 65,
    // paddingLeft: PADDING_LEFT_RIGHT,
    // paddingRight: PADDING_LEFT_RIGHT,
    backgroundColor: '#464c6e',
    justifyContent: 'space-between'
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
  }
});
