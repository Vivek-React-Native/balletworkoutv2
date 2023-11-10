import React, {Component} from 'react';
import {View, Image, StyleSheet, Dimensions, Text} from 'react-native';
import logoImage from './../../../../assets/images/newlogo.png';
import {WIDTH, HEIGHT} from '../../../../utilities/Theme';

const Logo = ({}) => {
  return (
    <View style={[styles.container]}>
      <Image style={styles.image} resizeMode={'contain'} source={logoImage} />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: HEIGHT <= 667 ? 40 : HEIGHT * 0.06,
  },
  logoImageWrapper: {
    // flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    //top: "18%",
  },
  image: {
    flex: 0,
    width: WIDTH * 0.8 - 80,
    height: (WIDTH * 0.8 - 80) * (230 / 1260),
  },
});
