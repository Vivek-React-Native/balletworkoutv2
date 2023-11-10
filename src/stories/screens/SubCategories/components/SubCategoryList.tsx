import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {WIDTH, HEIGHT} from '@balletworkout/utilities/Theme';
import {Text} from '@balletworkout/components';

const {height, width} = Dimensions.get('window');
import explaceHolderImage from '@balletworkout/assets/images/Ballerina_PlaceholderExercises.jpg';
import goalplaceHolderImage from '@balletworkout/assets/images/Ballerina_GOALS.jpg';
import exImage from '@balletworkout/assets/images/goal-detail-example.png';
import starIcon from '@balletworkout/assets/images/star-icon.png';
import {baseServerUri} from '../../../../common/appConstants';

interface Props {
  subCategories: any;
  subCategoryType: string;
  sourceUrl: string;
  navigation: any;
  purchaseExpired: boolean;
  setIapModelVisibility: Function;
  category: any
}

interface State {}

export default class SubCategoryList extends Component<Props, State> {
  _determineCategoryAccess(category: any) {
    const {purchaseExpired} = this.props;
    if (category.access_type === 'FREE') {
      return true;
    } else if (!purchaseExpired && category.access_type === 'PAID') {
      return true;
    } else {
      return true;
    }
  }

  renderList({item, index}) {
    const {
      name,
      type,
      banner_image_dir,
      banner_image,
      image_prefix,
      description,
    } = item;

    const categoryAccess = this._determineCategoryAccess(item);
    return (
      <TouchableOpacity
        style={styles.imageRowContainer}
        onPress={() =>
          categoryAccess
            ? this.props.navigation.navigate('exercises', {
                id: item.id,
                subCategoryType: this.props.subCategoryType,
                subCategory: item,
                category: this.props.category
              })
            : this.props.setIapModelVisibility(true)
        }>
        <View style={styles.imageContainer}>
          <Image
            style={styles.mainImage}
            resizeMode={'cover'}
            source={
              banner_image
                ? {
                    uri:
                      baseServerUri +
                      banner_image_dir +
                      image_prefix +
                      banner_image,
                  }
                : explaceHolderImage
            }
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.buttonText]} font={'SemiBold'}>
            {name}
          </Text>
          <View style={styles.tagContainer}>
            {/* <View style={styles.tagContent}>
              <Image
                style={styles.starIcon}
                resizeMode={'contain'}
                source={starIcon}
              />
              <Text style={[styles.tagText]} font={'SemiBold'}>
                4.8
              </Text>
            </View> */}
            <View style={styles.tagContent}>
              <Text style={[styles.tagText]} font={'SemiBold'}>
                Beginner
              </Text>
            </View>
          </View>
          <Text
            style={styles.textDescription}
            font={'Regular'}
            numberOfLines={3}>
            {description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    // console.log('this.props.subCategories:', this.props.subCategories);
    const {
      name,
      type,
      banner_image_dir,
      banner_image,
      image_prefix,
    } = this.props.navigation.getParam('category');
    return (
      <FlatList
        data={this.props.subCategories}
        renderItem={this.renderList.bind(this)}
        contentContainerStyle={styles.weeklyGoalCausal}
        keyExtractor={item => item.id}
      />
    );
  }
}

const styles = StyleSheet.create({
  weeklyGoalCausal: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  weeklyGoalRows: {
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2E6E6',
    width: WIDTH * 0.2,
    height: WIDTH * 0.2,
    borderRadius: 10,
  },
  imageRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10,
    backgroundColor: '#F7F7F7',
    padding: 5,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  bgImage: {
    width: WIDTH * 0.2 - 10,
    height: WIDTH * 0.2 - 10,
    aspectRatio: 1,
  },
  helpCircle: {
    width: 20,
    height: 20,
    marginBottom: 5,
  },
  mainImage: {
    width: WIDTH * 0.2 - 10,
    height: WIDTH * 0.2 - 10,
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  buttonText: {
    marginTop: 5,
    textAlign: 'left',
    fontSize: WIDTH*0.038,
    color: '#032426',
    marginVertical: 2,
  },
  textDescription: {
    fontSize: 12,
    color: '#032426',
    marginVertical: 2,
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tagContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#F2E6E6',
    marginRight: 5,
  },
  tagText: {
    fontSize: 12,
    color: '#032426',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 2,
  },
  starIcon: {
    width: 15,
    height: 13,
    marginRight: 5,
    marginTop: -2,
    alignSelf: 'center',
  },
});
