import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import i18n from '@balletworkout/common/i18n';
import {Text} from '@balletworkout/components';
interface Props {
  selected?: string;
  onHealtyCallBack?: Function;
  onDeleciousCallBack?: Function;
  onPopularCallBack?: Function;
}
const RecipesTabs = ({
  selected = '',
  onHealtyCallBack = () => {},
  onDeleciousCallBack = () => {},
  onPopularCallBack = () => {},
}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          selected === 'healthy' ? styles.selectedButton : {},
        ]}
        onPress={() => onHealtyCallBack()}>
        <Text
          font={'Regular'}
          style={[selected === 'healthy' ? styles.selectedText : {}]}>
          Healthy
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          selected === 'delicious' ? styles.selectedButton : {},
        ]}
        onPress={() => onDeleciousCallBack()}>
        <Text
          font={'Regular'}
          style={[selected === 'delicious' ? styles.selectedText : {}]}>
          Delicious
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          selected === 'most' ? styles.selectedButton : {},
        ]}
        onPress={() => onPopularCallBack()}>
        <Text
          font={'Regular'}
          style={[selected === 'most' ? styles.selectedText : {}]}>
          Most Popular
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecipesTabs;

const styles = StyleSheet.create({
  container: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedButton: {
    backgroundColor: '#032426',
  },
  selectedText: {
    color: '#fff',
  },
});
