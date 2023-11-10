import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {WIDTH, HEIGHT} from '@balletworkout/utilities/Theme';
import i18n from '@balletworkout/common/i18n';
import {Text} from '@balletworkout/components';
import {Content} from 'native-base';
import welcomeImage from '@balletworkout/assets/images/welcome.png';
import gradientImage from '@balletworkout/assets/images/welcome-gradient.png';
import {PRIMARY_COLOR_NEW} from '../../../utilities/Theme';
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal';

interface Props {
  navigation: any;
  screenProps: any;
}

const WelcomePage = (props: Props) => {
  const currentUser = useSelector(state => state.auth.userData);
  const onNext = () => {
    props.navigation.navigate('choose');
  };
  useEffect(() => {
    console.log('currentUser:', currentUser.email);
    SettingOneSignalEmail(currentUser.email)
  }, [currentUser]);
  
  const SettingOneSignalEmail = async (email: any) => {
    OneSignal.setEmail(email)
  }

  return (
    <Content contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={welcomeImage}
          resizeMode={'stretch'}
          style={styles.image}
        />
        <Image
          source={gradientImage}
          resizeMode={'cover'}
          style={styles.gradient}
        />
      </View>
      
      <View>
        {!currentUser?.isLoading && currentUser && (
          <Text style={styles.textBold}>
            {i18n.t('welcome.welcome')}
            {currentUser && currentUser?.first_name
              ? `, ${currentUser['first_name']}`
              : ''}
          </Text>
        )}
        <Text style={styles.textRegular} font="Regular">
          {i18n.t('welcome.message')}
        </Text>
        <TouchableOpacity style={styles.nextButton} onPress={() => onNext()}>
          <Text style={{color: '#ffffff'}}>{i18n.t('welcome.next')}</Text>
        </TouchableOpacity>
      </View>
    </Content>
  );
};

export default WelcomePage;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    height: HEIGHT * 0.7,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '40%',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  nextButton: {
    backgroundColor: PRIMARY_COLOR_NEW,
    borderRadius: 10,
    width: '30%',
    height: WIDTH * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: HEIGHT * 0.015,
    alignSelf:'center'
  },
  textBold: {
    textAlign: 'center',
    fontSize: WIDTH * 0.065,
    color: '#032426',
    width: WIDTH * 0.9,
    alignSelf: 'center'
  },
  textRegular: {
    textAlign: 'center',
    paddingHorizontal: '5%',
    fontSize: WIDTH * 0.035,
    color: '#828282',
    paddingBottom: HEIGHT * 0.015,
  },
});
