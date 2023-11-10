import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

import starIcon from '@balletworkout/assets/images/star-icon.png';
import {Text} from '@balletworkout/components';

interface Props {
  navigation: any;
}

const ReviewInfo = ({navigation}: Props) => {
  return (
    <View style={styles.tagContainer}>
      <TouchableOpacity style={styles.tagContent}>
        <Image
          style={styles.starIcon}
          resizeMode={'contain'}
          source={starIcon}
        />
        <Text style={[styles.tagText]} font={'SemiBold'}>
          4.8
        </Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.tagContent}>
        {/* <Text style={[styles.tagText]} font={'SemiBold'}>
                    120 Reviews
                </Text> */}
      </TouchableOpacity>
    </View>
  );
};
export default ReviewInfo;
const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
  },
  divider: {
    backgroundColor: '#032426',
    height: 12,
    width: 1,
    marginRight: 5,
  },
  tagContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
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
