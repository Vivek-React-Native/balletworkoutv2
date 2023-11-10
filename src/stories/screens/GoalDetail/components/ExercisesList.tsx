import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from '@balletworkout/components';
import {WIDTH, HEIGHT} from '@balletworkout/utilities/Theme';
import bgImage from '@balletworkout/assets/images/weekly-goal-bg.png';
import beautyPosture from '@balletworkout/assets/images/beautiful_posture.png';
import starIcon from '@balletworkout/assets/images/star-icon.png';
import playIcon from '@balletworkout/assets/icons/play.png';

const ListItem = ({item, onPressHandler}) => {
  return (
    <TouchableOpacity
      style={styles.imageRowContainer}
      onPress={() => onPressHandler(item)}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.mainImage}
          resizeMode={'contain'}
          source={beautyPosture}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.buttonText]} font={'SemiBold'}>
          {item.name}
        </Text>
        <View style={styles.tagContainer}>
          <View style={styles.tagContent}>
            <Image
              style={styles.starIcon}
              resizeMode={'contain'}
              source={starIcon}
            />
            <Text style={[styles.tagText]} font={'SemiBold'}>
              4.8
            </Text>
          </View>
          <View style={styles.tagContent}>
            <Text style={[styles.tagText]} font={'SemiBold'}>
              Beginner
            </Text>
          </View>
        </View>
        <Text style={styles.textDescription} font={'Regular'}>
          {item.description}
        </Text>
      </View>
      <View style={styles.rightImageContainer}>
        <Image
          style={styles.rightImage}
          resizeMode={'contain'}
          source={playIcon}
        />
      </View>
    </TouchableOpacity>
  );
};
const ExercisesList = ({onPressList}) => {
  const [goalsList, setGoalsList] = useState([
    {
      name: 'Daily Full Body Fit',
      rate: 4.8,
      description: 'Daily: 20min',
    },
    {
      name: 'Grand Ecard in 14 days',
      rate: 4.8,
      description: 'Daily: 20min',
    },
    {
      name: 'Grand Ecard in 21 days',
      rate: 4.8,
      description: 'Daily: 20min',
    },
    {
      name: 'Beautiful Posture in 14 days',
      rate: 4.8,
      description: 'Daily: 20min',
    },
    {
      name: 'Beautiful Posture in 14 days',
      rate: 4.8,
      description: 'Daily: 20min',
    },
  ]);
  return (
    <FlatList
      data={goalsList}
      renderItem={({item}) => (
        <ListItem item={item} onPressHandler={onPressList} />
      )}
      contentContainerStyle={styles.container}
    />
  );
};
export default ExercisesList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2E6E6',
    width: WIDTH * 0.2,
    height: WIDTH * 0.2,
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
    width: WIDTH * 0.2,
    height: WIDTH * 0.2,
    aspectRatio: 1,
  },
  mainImage: {
    position: 'absolute',
    width: WIDTH * 0.15,
    height: WIDTH * 0.15,
    backgroundColor: 'transparent',
  },
  buttonText: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 14,
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
  rightImageContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D2959F',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignSelf: 'center',
  },
  rightImage: {
    width: 16,
    height: 16,
  },
});
