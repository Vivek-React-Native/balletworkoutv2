import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import i18n from '@balletworkout/common/i18n';
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import Text from './Text';
import {baseServerUri} from '../appConstants';
import fakeScreens from '@balletworkout/assets/images/fake-screens-split.png';
import defaultImage from '@balletworkout/assets/images/default-profile.jpg';
import myProfileIcon from '@balletworkout/assets/images/my-profile.png';
import classScheduleIcon from '@balletworkout/assets/images/class-schedule.png';
import languagesIcon from '@balletworkout/assets/images/languages.png';
import notificationIcon from '@balletworkout/assets/images/notification.png';
import settingIcon from '@balletworkout/assets/images/setting.png';
import {policyUrl, termsUrl, supportUrl} from '../appConstants';
import {HEIGHT, WIDTH} from '../../utilities/Theme';
import goalplaceHolderImage from '@balletworkout/assets/images/Ballerina_GOALS.jpg';
import {logOutUser} from '../auth/actions';
import bottomImage from './../../assets/images/logo_250_splash.png';
import * as RNLocalize from 'react-native-localize';
import {PRIMARY_COLOR_NEW} from '@balletworkout/utilities/Theme';
import DrawerLogo from '../../assets/DrawerLogo.svg'
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal';
interface ISideMenuProps {
  navigation?: any;
  drawerOpenProgress?: any;
}

const SideMenu = ({navigation, drawerOpenProgress}: ISideMenuProps) => {
  const currentUser = useSelector(state => state.auth.userData);
  const dispatch = useDispatch();
  useEffect(() => {
    // console.log('currentUser: ', currentUser);
  }, []);

  const action = (route: string) => {
    navigation.closeDrawer();
    navigation.navigate(route);
  };

  const handleLink = (url: string) => {
    navigation.closeDrawer();
    Linking.openURL(url).catch((error: any) => console.warn(error));
  };

  const _onPressLogout = () => {
    Alert.alert(
      i18n.t('settings.logout'),
      i18n.t('settings.logout_confirm_message') + '?',
      [
        {
          text: 'OK',
          onPress: LogoutUser
        },
        {text: i18n.t('settings.cancel'), style: 'cancel'},
      ],
    );
  };

  const LogoutUser = async () => {
    OneSignal.logoutEmail((e)=> console.log('Email logout from OneSignal', e))
    const allkeys = await AsyncStorage.getAllKeys()
    await AsyncStorage.multiRemove(allkeys)
    setTimeout(() => navigation.navigate('auth'), 500);
    dispatch(logOutUser());
  };

  const scale = Animated.interpolate(drawerOpenProgress, {
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.1, 1],
    extrapolate: Animated.Extrapolate.CLAMP,
  });
  const translateX = Animated.interpolate(drawerOpenProgress, {
    inputRange: [0, 1],
    outputRange: [-WIDTH * 1.6, 0],
  });
  return (
    <View style={styles.container}>
      {/* <Image source={bottomImage} style={styles.topLogo} /> */}
      <DrawerLogo width={WIDTH * 0.6} height={HEIGHT * 0.1} style={[styles.topLogo, { top: Platform.OS=='ios' ? HEIGHT * 0.04 : HEIGHT * 0.02}]} />
      <Animated.View
        style={{transform: [{translateX}], backgroundColor: PRIMARY_COLOR_NEW}}>
        <TouchableOpacity
          style={styles.leftContainer}
          onPress={() => navigation.closeDrawer()}>
          <Image
            style={styles.fakeScreens}
            source={fakeScreens}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={{transform: [{scale}]}}>
        <View style={styles.profileContent}>
          <View style={styles.pictureContainer}>
            <Image
              style={styles.profilePicture}
              source={
                currentUser && currentUser.profile_picture
                  ? {
                      uri:
                        baseServerUri +
                        currentUser.profile_picture_dir +
                        currentUser.profile_picture,
                    }
                  : goalplaceHolderImage
              }
              resizeMode={'cover'}
            />
          </View>
          <Text style={styles.userNameText} font={'Regular'}>
            {currentUser?.first_name || ''}
          </Text>
        </View>
        <View style={{height: HEIGHT * 0.5,justifyContent:'space-evenly'}}>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => action('profile')}>
            <Image
              style={styles.listIcon}
              source={myProfileIcon}
              resizeMode={'cover'}
            />
            <Text style={styles.listText} font={'SemiBold'}>
              {i18n.t('settings.my_profile')}
            </Text>
          </TouchableOpacity>
          {RNLocalize.getCountry() === 'BE' && (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => action('schedule')}>
              <Image
                style={styles.listIcon}
                source={classScheduleIcon}
                resizeMode={'cover'}
              />
              <Text style={styles.listText} font={'SemiBold'}>
                {i18n.t('settings.class_schedule')}
              </Text>
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity style={styles.listItem} onPress={() => action('languageSettings')}>
                      <Image
                          style={styles.listIcon}
                          source={languagesIcon}
                          resizeMode={'cover'}
                      />
                      <Text style={styles.listText} font={'SemiBold'}>{i18n.t('settings.language')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.listItem} onPress={() => action('notification')}>
                      <Image
                          style={styles.listIcon}
                          source={notificationIcon}
                          resizeMode={'cover'}
                      />
                      <Text style={styles.listText} font={'SemiBold'}>{i18n.t('settings.notification')}</Text>
                  </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() =>
              handleLink(supportUrl + `?lang=${i18n.language.substring(0, 2)}`)
            }>
            <Image
              style={styles.listIcon}
              source={settingIcon}
              resizeMode={'cover'}
            />
            <Text style={styles.listText} font={'SemiBold'}>
              {i18n.t('settings.help_and_support')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() =>
              handleLink(policyUrl + `?lang=${i18n.language.substring(0, 2)}`)
            }>
            <Image
              style={styles.listIcon}
              source={settingIcon}
              resizeMode={'cover'}
            />
            <Text style={styles.listText} font={'SemiBold'}>
              {i18n.t('settings.privacy_policy')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() =>
              handleLink(termsUrl + `?lang=${i18n.language.substring(0, 2)}`)
            }>
            <Image
              style={styles.listIcon}
              source={settingIcon}
              resizeMode={'cover'}
            />
            <Text style={styles.listText} font={'SemiBold'}>
              {i18n.t('settings.terms_of_service')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => _onPressLogout()}>
            <Image
              style={styles.listIcon}
              source={settingIcon}
              resizeMode={'cover'}
            />
            <Text style={styles.listText} font={'SemiBold'}>
              {i18n.t('settings.logout')}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};
export default SideMenu;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  leftContainer: {
    width: WIDTH / 2.3,
    height: HEIGHT,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  fakeScreens: {
    width: HEIGHT * 0.2,
  },
  profileContent: {
    marginTop: HEIGHT * 0.16,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: HEIGHT * 0.01,
    paddingLeft: WIDTH * 0.05,
  },
  pictureContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: WIDTH * 0.007,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  profilePicture: {
    resizeMode: 'cover',
    width: WIDTH * 0.18,
    height: WIDTH * 0.18,
    alignSelf: 'center',
    borderRadius: 100,
  },
  userNameText: {
    fontSize: WIDTH * 0.05,
    color: '#ffffff',
    textAlign: 'left',
    width: WIDTH * 0.5,
    marginTop: HEIGHT * 0.012
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: WIDTH * 0.015,
    marginBottom: 5,
    width: WIDTH * 0.5
  },
  listIcon: {
    resizeMode: 'contain',
    width: 0,
    height: 0,
    alignSelf: 'center',
  },
  listText: {
    paddingHorizontal: 15,
    color: '#ffffff',
    fontSize: WIDTH * 0.042,
  },
  topLogo: {
    width: 230,
    height: 30,
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
    left: WIDTH * 0.2,
  },
});
