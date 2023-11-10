import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
};
interface State {};

export default class Title extends Component<Props, State> {

  constructor(props:any) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{ this.props.title.toUpperCase() }</Text>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 23,
    color: '#464c6e',
    fontFamily: 'Montserrat-Bold',
  }
});
