import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Platform} from 'react-native';
import {Container} from 'native-base';
import AppHeader from './../../../common/components/AppHeader/AppHeader';
import RecipeTitle from './components/RecipeTitle';
import RecipeIngredients from './components/RecipeIngredients';
import RecipeProcedure from './components/RecipeProcedure';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {HEIGHT, PADDING_LEFT_RIGHT, WIDTH} from './../../../utilities/Theme';
import RecipeImage, {PARALAX_HEIGHT} from './components/RecipeImage';
import {AppEventsLogger} from 'react-native-fbsdk';
import ScrollabeHeader from '../../../common/components/ScrollabeHeader';
import {baseServerUri} from '../../../common/appConstants';

interface Props {
  navigation: any;
}
interface State {}
export default class Recipe extends Component<Props, State> {
  renderHeader() {
    return (
      <AppHeader hasBackButton={true} navigation={this.props.navigation} />
    );
  }

  renderParalaxImage() {
    const recipe = this.props.navigation.getParam('recipe');
    return (
      <RecipeImage
        recipeImage={recipe.recipe_view_image}
        navigation={this.props.navigation}
      />
    );
  }

  componentDidMount() {
    const recipe = this.props.navigation.getParam('recipe');
    AppEventsLogger.logEvent('View content', {
      'Content ID': recipe.title,
      'Content Type': 'Recipe',
    });
  }

  render() {
    const recipe = this.props.navigation.getParam('recipe');
    return (
      <View style={styles.masterContainer}>
        <ScrollabeHeader
          navigation={()=> this.props.navigation.navigate('recipes')}
          image={{uri: baseServerUri + recipe.recipe_view_image}}
          title={recipe.title}>
          <RecipeTitle
            title={recipe.title}
            preparationTime={recipe.recipe_time}
          />
          <RecipeIngredients ingredients={recipe.recipe_ingredients} />
          <RecipeProcedure recipe={recipe.recipe} />
        </ScrollabeHeader>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
  },
  container: {
    paddingLeft: PADDING_LEFT_RIGHT,
    paddingRight: PADDING_LEFT_RIGHT,
  },
});
