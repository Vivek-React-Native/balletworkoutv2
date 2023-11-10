import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Body, Title, Right, Left } from 'native-base';
import Recipe from './../../stories/screens/Recipe';
import AppHeader from './../../common/components/AppHeader/AppHeader';
import { PADDING_LEFT_RIGHT } from './../../utilities/Theme';
import { isIPhone } from './../../utilities/Screen';
import NoConnection from '../../common/components/NoConnection';

interface Props {
  navigation: any;
  screenProps: any;
};
interface State { };

export default class RecipeContainer extends Component<Props, State> {

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        {
          this.props.screenProps.isConnectedToNetwork ?
            null :
            <NoConnection />
        }
        <Recipe navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: isIPhone ? 85 : 65,
    paddingLeft: PADDING_LEFT_RIGHT,
    paddingRight: PADDING_LEFT_RIGHT,
    backgroundColor: '#464c6e'
  },
});
