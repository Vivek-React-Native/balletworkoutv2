import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Card, CardItem, Body, Left, Right} from 'native-base';
import {isIPhoneX, isAndroid, isIphoneSe} from './../../../../utilities/Screen';
import {PADDING_LEFT_RIGHT, WIDTH} from './../../../../utilities/Theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import {baseServerUri} from './../../../../common/appConstants';
import {Text} from '@balletworkout/components';
import i18n from '../../../../common/i18n';

const {height, width} = Dimensions.get('window');

interface Props {
  categories: any;
  navigation: any;
  purchaseExpired: boolean;
  setIapModelVisibility: Function;
}

interface State {}

export default class Category extends Component<Props, State> {
  renderListItem(category: any, key: number, isLast: boolean) {
    const {navigation, purchaseExpired, setIapModelVisibility} = this.props;

    let exercise1 = i18n.t('exercise.exercisesTitle');
    // console.log('Category......', exercise1);
    var counter = '0';
    if (category.id === 45) {
      counter = '23';
    } else if (category.id === 1) {
      counter = '61';
    } else if (category.id === 2) {
      counter = '91';
    } else if (category.id === 3) {
      counter = '151';
    } else if (category.id === 24) {
      counter = '145';
    }
    return (
      <TouchableOpacity
        key={key}
        onPress={() =>
          this._determineCategoryAccess(category)
            ? this.props.navigation.navigate('categories', {
                category: category,
              })
            : setIapModelVisibility(true)
        }
        style={[styles.cardItem, !isLast ? styles.marginBottom : null]}>
        <View style={styles.cardImageContainer}>
          <Image
            style={styles.cardImage}
            resizeMode={'contain'}
            source={{
              uri:
                baseServerUri + category.home_image_dir + category.home_image,
            }}
          />
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardText} font={'SemiBold'}>
            {category.name}
          </Text>
          <Text style={styles.cardSubText} font={'Regular'}>
            {`${counter} ${exercise1}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  _determineCategoryAccess(category: any) {
    const {purchaseExpired} = this.props;
    if (category.access_type === 'FREE') {
      return true;
    } else if (!purchaseExpired && category.access_type === 'PAID') {
      return true;
    } else {
      return false;
    }
  }

  render() {
    // console.log('this.props.categories', this.props.categories);
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.textBold}>{i18n.t('home.workout')}</Text>
        </View>
        <Card transparent style={styles.card}>
          {this.props.categories.length > 0
            ? this.props.categories.map((item: any, index: number) => {
                return this.renderListItem(
                  item,
                  index,
                  this.props.categories.length - 1 === index,
                );
              })
            : null}
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0, //isIPhoneX ? 3: isAndroid? 2.5: 2,
    alignSelf: 'stretch',
    //flexDirection: 'column',
    paddingHorizontal: PADDING_LEFT_RIGHT - WIDTH * 0.025,
    paddingBottom: 15,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  textBold: {
    textAlign: 'left',
    fontSize: 24,
    color: '#032426',
    marginTop: 20,
  },
  card: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardItem: {
    backgroundColor: '#F7F7F7',
    borderRadius: 15,
    height: WIDTH / 2 ,
    width: WIDTH / 2 - 30,
    maxWidth: 170,
    maxHeight: 150,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  cardBody: {
    height: 35,
  },
  marginBottom: {
    marginBottom: 5,
    borderRadius: 10,
  },
  cardImageContainer: {
    flex: 1,
    borderRadius: 10,
    width: WIDTH * 0.37,
    backgroundColor: '#F2E6E6',
  },
  cardImage: {
    flex: 1,
    resizeMode: 'cover',
    aspectRatio: WIDTH * 0.0035,
    alignSelf: 'center',
  },
  cardText: {
    color: '#000000',
    fontSize: isIphoneSe ? 14 : 16,
    height: 20,
    marginTop: 3,
  },
  cardSubText: {
    fontSize: isIphoneSe ? 10 : 12,
    height: 17,
    alignSelf: 'center',
    textAlign: 'center',
  },
  chevron: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    fontSize: isIphoneSe ? 16 : 20,
    color: '#fff',
  },
});
