import React, {Component} from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {
  Header,
  Body,
  Left,
  Right,
  StyleProvider,
  Container,
  Title,
} from 'native-base';
import Logo from './Logo';
import Avatar from './Avatar';
import {
  HEIGHT,
  PADDING_LEFT_RIGHT,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  WIDTH,
} from './../../../../utilities/Theme';
import {
  isIPhone,
  isIpad,
  isTab,
  isIphoneWithNotch,
} from './../../../../utilities/Screen';
import {
  isDatePast,
  toDateHoursLeft,
  fromToTimezone,
} from '../../../../utilities/Functions';
import {connect} from 'react-redux';
import * as RNLocalize from 'react-native-localize';
import {LanguageIcon, SettingsIcon} from '../../../../assets/icons/Svgs';
import {Text} from '@balletworkout/components';
import i18n from '@balletworkout/common/i18n';
import HeaderText from './HeaderText';
import menuImage from '@balletworkout/assets/images/menu-left.png';
import gradientImage from '@balletworkout/assets/images/hearder-gradient-circle.png';

interface Props {
  store: any;
  navigation: any;
  userData: any;
  HeaderTextStyle: any;
  banner: boolean;
}

interface State {}

export class HomeHeader extends Component<Props, State> {
  render() {
    const {store, navigation, userData, HeaderTextStyle, banner} = this.props;
    // console.log('userData', userData);
    let trialExpiry =
      userData && typeof userData.created_on !== 'undefined'
        ? fromToTimezone(userData.created_on, 'UTC', RNLocalize.getTimeZone())
            .add('7', 'days')
            .format('Y-MM-DD HH:mm:ss')
        : null;

    return (
      <View
        style={[
          styles.conatainer,
          {marginTop: banner ? 0 : HEIGHT * 0.03}
        ]}>
        <View style={[{flex: 1, marginLeft: WIDTH * 0.01},HeaderTextStyle,
          // {marginTop: banner ? -HEIGHT * 0.012 : HEIGHT * 0.01}
          ]}>
          <HeaderText />
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}>
          <Image
            style={styles.image}
            resizeMode={'contain'}
            source={menuImage}
          />
        </TouchableOpacity>
        {
          // trialExpiry !== null && !isDatePast(trialExpiry) ? <View style={styles.headerTimer}>
          // 	<Text style={styles.headerTimerText}>FREE TRIAL: {toDateHoursLeft(trialExpiry)} left</Text>
          // </View> : null
        }

        {/*<Header noShadow androidStatusBarColor={trialExpiry !== null && !isDatePast(trialExpiry) ? SECONDARY_COLOR : PRIMARY_COLOR} style={styles.header}>*/}
        {/*	<Left style={styles.headerLeftRight}>*/}
        {/*		/!* <Mascot navigation={navigation} /> *!/*/}
        {/*	</Left>*/}
        {/*	<Body style={styles.headerBody}>*/}
        {/*		<Logo />*/}
        {/*	</Body>*/}
        {/*	<Right style={[styles.headerLeftRight, {paddingTop: 15}]}>*/}
        {/*		<TouchableOpacity style={styles.transparent} onPress={() => navigation.navigate('settings')}>*/}
        {/*			<SettingsIcon width="35" height="35" color={'#d2959f'} />*/}
        {/*		</TouchableOpacity>*/}
        {/*	</Right>*/}
        {/*</Header>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  conatainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  header: {
    height: isIPhone ? 85 : 65,
    paddingLeft: isIpad || isTab ? 25 : PADDING_LEFT_RIGHT,
    paddingRight: isIpad || isTab ? 25 : PADDING_LEFT_RIGHT,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'space-between',
  },
  headerBody: {
    flex: 0,
  },
  headerLeftRight: {
    flex: 1,
  },
  headerTimer: {
    backgroundColor: SECONDARY_COLOR,
    padding: 5,
    // paddingTop: isIphoneWithNotch() ? 25 : 0
  },
  headerTimerText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    fontSize: 17,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  textBold: {
    textAlign: 'center',
    paddingHorizontal: '5%',
    fontSize: 34,
    color: '#032426',
  },
  menuButton: {
    backgroundColor: '#F7F7F7',
    width: 45,
    height: 45,
    marginLeft: 50,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },
  image: {
    width: 20,
    height: 20,
    aspectRatio: 1,
  },
});

const mapStateToProps = (state: any) => ({
  userData: state.auth.userData,
});

export default connect(mapStateToProps)(HomeHeader);
