import React, {Component} from 'react';
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {baseServerUri} from './../../../../common/appConstants';
import {Text} from '@balletworkout/components';
import { WIDTH } from '../../../../utilities/Theme';
import Loader from '../../../../common/components/Loader';

const {width, height}=Dimensions.get('window')

interface Props {
  recipes: any;
  navigation: any;
}

interface State {
  imageLoading: boolean
}

export default class RecipeList extends Component<Props, State> {

  state = {
    imageLoading: true
  }

  renderRecipeItem(recipe: any, key: number) {
    return (
      <TouchableOpacity
        style={styles.listContainer}
        onPress={() =>
          this.props.navigation.navigate('recipeView', {
            recipe: recipe,
          })
        }>
          <Image
            source={{uri: baseServerUri + recipe.recipe_image_thumb}}
            resizeMode={'cover'}
            style={styles.avatarImage}
            onLoadStart={()=> this.setState({ imageLoading: true })}
            onLoadEnd={()=> this.setState({ imageLoading: false })}
          />
          {this.state.imageLoading && <View style={{position:'absolute',backgroundColor: '#fff',height: WIDTH * 0.25,width: WIDTH * 0.25,alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator size={WIDTH * 0.1} color={'#A45A79'}  />
          </View>}
        <View style={styles.descriptionContainer}>
          <Text numberOfLines={2} style={styles.descriptionTitle}>{recipe.title}</Text>
          <Text style={styles.footerTextHeader} font={'Regular'}>
            Prep. Time: {recipe.recipe_time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {recipes} = this.props;
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={recipes}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingVertical: 15}}
          keyExtractor={(v,index)=> index.toString()}
          renderItem={({item, index}) => this.renderRecipeItem(item, index)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#F7F7F7',
    borderRadius: 15,
    marginTop: WIDTH * 0.02,
  },
  avatarImage: {
    height: WIDTH * 0.25,
    width: WIDTH * 0.25,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    marginRight: 10,
    alignItems:"center",
    justifyContent:'center'
  },
  descriptionContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    padding: WIDTH * 0.01,
  },
  descriptionTitle: {
    fontSize: WIDTH * 0.04,
    width: WIDTH * 0.5
  },
  footerTextHeader: {
    fontSize: 12,
  },
});
