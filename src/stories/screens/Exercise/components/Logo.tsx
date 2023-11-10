import React, { Component } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import logoImage from './../../../../assets/images/logo.png';

const { width, height } = Dimensions.get('window');

interface Props {};
interface State {};
export default class Logo extends Component<Props, State> {

  render() {
    return (
      <View style={[styles.container]}>
        <Image style={styles.image} resizeMode={'contain'} source={logoImage} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImageWrapper: {
    // flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    //top: "18%",
  },
  image: {
    flex: 0,
    width: (width * .65) - 30
  }
});
