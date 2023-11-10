import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {WIDTH, HEIGHT} from '@balletworkout/utilities/Theme';
import i18n from '@balletworkout/common/i18n';
import {Content} from 'native-base';
import {PRIMARY_COLOR_NEW} from '../../../utilities/Theme';
import SmoothPicker from 'react-native-smooth-picker';
import {Text} from '@balletworkout/components';
import Carousel from 'react-native-snap-carousel';
import ChooseDaysCore from '../../../common/chooseDays';
import TrainingProgressCore from '../../../common/training';
import moment from 'moment';
import WheelPickerHorizontal from '../../../common/components/WheelPickerHorizontal';
import WheelPicker from '../../../common/components/WheelPicker';
interface Props {
  navigation: any;
  screenProps: any;
}

const dataCity = ['1', '2', '3', '4', '5', '6', '7'];

const opacities = {
  0: 1,
  1: 0.5,
  2: 0.2,
  3: 0.1,
  4: 0.1,
};
const sizeText = {
  0: 60,
  1: 40,
  2: 40,
};
const Item = React.memo(({opacity, selected, vertical, fontSize, name}) => {
  return (
    <View
      style={[
        styles.OptionWrapper,
        {
          opacity,
          borderRadius: 30,
          width: 100,
          height: 100,
          paddingTop: 10,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: selected ? PRIMARY_COLOR_NEW : 'transparent',
        },
      ]}>
      <Text style={{color: selected ? '#ffffff' : '#032426', fontSize}}>
        {name}
      </Text>
    </View>
  );
});

const ItemToRender = ({item, index}, indexSelected, vertical) => {
  const selected = index === indexSelected;
  const gap = Math.abs(index - indexSelected);

  let opacity = opacities[gap];
  if (gap > 3) {
    opacity = opacities[4];
  }
  let fontSize = sizeText[gap];
  if (gap > 1) {
    fontSize = sizeText[2];
  }

  return (
    <Item
      opacity={opacity}
      selected={selected}
      vertical={vertical}
      fontSize={fontSize}
      name={item}
    />
  );
};
const ChooseDaysPage = (props: Props) => {
  const currentUser = useSelector(state => state.profile);
  const carousalRef = useRef(null);
  const dispatch = useDispatch();
  const cDays = useSelector(state =>
    ChooseDaysCore.selectors.chooseDays(state),
  );
  const isFirst = useSelector(state => ChooseDaysCore.selectors.isFirst(state));
  const [selected, setSelected] = useState(2);
  useEffect(() => {}, [currentUser]);

  const onNext = () => {
    dispatch(ChooseDaysCore.actions.saveChooseDays(selected));
    props.navigation.navigate('main');
  };

  return (
    <Content contentContainerStyle={styles.container}>
      <Text style={styles.textBold}>{i18n.t('welcome.choose_message')}</Text>
      <View style={[styles.wrapperHorizontal, {height: '50%'}]}>
        <WheelPickerHorizontal
          ref={sp => {}}
          dataSource={dataCity}
          selectedIndex={0}
          itemHeight={95}
          wrapperHeight={WIDTH}
          wrapperColor={'#ffffff'}
          highlightColor={'#d8d8d8'}
          onValueChange={(data, selectedIndex) => {}}
          renderItem={(data, index, isSelected) => {
            return (
              <View>
                <Text
                  style={{
                    color: isSelected ? '#fff' : '#bbb',
                    fontSize: isSelected ? WIDTH * 0.12 : WIDTH * 0.09,
                  }}>
                  {data}
                </Text>
              </View>
            );
          }}
        />
      </View>

      <View
        style={{
          height: HEIGHT * 0.2,
          width: WIDTH,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <TouchableOpacity style={styles.nextButton} onPress={() => onNext()}>
          <Text style={{color: '#ffffff'}}>{i18n.t('welcome.letsgo')}</Text>
        </TouchableOpacity>
      </View>
    </Content>
  );
};

export default ChooseDaysPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textBold: {
    marginTop: 20,
    textAlign: 'left',
    paddingHorizontal: WIDTH * 0.04,
    fontSize: WIDTH * 0.09,
    color: '#032426',
  },
  textRegular: {
    textAlign: 'center',
    paddingHorizontal: '5%',
    fontSize: 14,
    color: '#828282',
  },
  wrapperHorizontal: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
  },
  OptionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: PRIMARY_COLOR_NEW,
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    width: '35%',
    textAlign: 'center',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
