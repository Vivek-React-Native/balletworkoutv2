import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, SafeAreaView, Image, StatusBar} from 'react-native';
import GoalCarousel from './components/GoalCarousel';
import Category from './components/Category';
import i18n from '../../../common/i18n';
import InAppPurchaseModalNew from '../../../common/components/InAppPurchaseModalNew';
import ConfettiAnimation from '../../../common/components/ConfettiAnimation';
import {navigationAfterRegistration} from './../../../common/temp/actions';
import messaging from '@react-native-firebase/messaging';
import {updateFCMToken} from '../../../common/auth/actions';
import {AppEventsLogger} from 'react-native-fbsdk';
import HomeHeader from './components/HomeHeader';
import GiftBannerHeader from '../../../common/components/GiftBannerHeader';
import GiftModel from '../../../common/components/GiftModel';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-community/async-storage';
import gradientImage from '@balletworkout/assets/images/hearder-gradient-circle.png';
export interface Props {
  store: any;
  categories: any;
  navigation: any;
}
import {
  isDatePast,
  toDateHoursLeft,
  fromToTimezone,
} from '../../../utilities/Functions';
import { HEIGHT, WIDTH } from '../../../utilities/Theme';
import { Platform } from 'react-native';
import OneSignal from 'react-native-onesignal';
export interface State {
  entries: any;
  data: any;
  purchaseExpired: boolean;
  iapModelVisibility: boolean;
  showConfettiAnimation: boolean;
  modalVisible: boolean;
  freeTrails: any;
  videoSeen: any;
}
export default class Home extends Component<Props, State> {
  unSubscribeStore: Function;

  static navigationOptions = {
    tabBarLabel: i18n.t('home.tab_bar.workout'),
  };

  state = {
    data: this.props.store.getState().goals.goalsStarted,
    purchaseExpired: true,
    iapModelVisibility: false,
    showConfettiAnimation: false,
    modalVisible: false,
    freeTrails: '',
    videoSeen: ''
  };

  componentDidMount() {
    const {navigation, store} = this.props;
    // console.log('PARAMS..........', this.props.categories)

    this.oneSignalInitialization()
    AppEventsLogger.logEvent('View content', {
      'Content ID': 'Home Screen',
      'Content Type': 'Home',
    });
    this.setState({data: store.getState().goals.goalsStarted});

    this.unSubscribeStore = store.subscribe(() => {
      this.setState({data: store.getState().goals.goalsStarted});

      let purchaseExpiry = store.getState().auth.userData
        ? store.getState().auth.userData.purchase_validity_expiry
        : 0;
      // console.log('purchaseExpiry:', purchaseExpiry);
      // console.log('Date.now():', Date.now());
      let purchaseExpired = purchaseExpiry - Date.now() <= 0;
      // console.log('purchaseExpired:', purchaseExpired);
      // console.log('Purchase status:', purchaseExpiry, purchaseExpired);
      this.setState({purchaseExpired});
    });

    // let showConfettiAnimation = store.getState().temp.afterRegistration;
    // if (showConfettiAnimation) {
    //   this.setState({showConfettiAnimation});
    //   store.dispatch(navigationAfterRegistration('destroy'));
    //   setTimeout(() => this.setState({showConfettiAnimation: false}), 6000);
    // }

    this._checkAndSendFCMToken();
    let trialExpiry =
      store.getState().auth.userData &&
      typeof store.getState().auth.userData.created_on !== 'undefined'
        ? fromToTimezone(
            store.getState().auth.userData.created_on,
            'UTC',
            RNLocalize.getTimeZone(),
          )
            .add('3', 'days')
            .format('Y-MM-DD HH:mm:ss')
        : null;
        AsyncStorage.getItem('isRegistering').then(value => {
          let showConfettiAnimation = value === '1' ? true : false
          if (showConfettiAnimation) {
            AsyncStorage.setItem('isRegistering', '0');
            this.setState({showConfettiAnimation});
            store.dispatch(navigationAfterRegistration('destroy'));
            setTimeout(() => this.setState({showConfettiAnimation: false}), 6000);
          }
        });

    this.getAsyncvalue()

    // AsyncStorage.getItem('isHomeFirstTime').then(value => {
    // console.log('value', value);
    //   if (value != null && value === '0') {
    //     if (this.state.purchaseExpired === true && isDatePast(trialExpiry)) {
    //       AsyncStorage.setItem('isHomeFirstTime', '1');
    //       this.setModelVisble(true);
    //     }
    //   } 
    //   // else {
    //   //   if (this.state.purchaseExpired === true && isDatePast(trialExpiry)) {
    //   //     AsyncStorage.setItem('isHomeFirstTime', '1');
    //   //     this.setModelVisble(true);
    //   //   }
    //   // }
    // });

    // console.log('ComponentDidMount works..........')
  }


  oneSignalInitialization(){
    /* O N E S I G N A L  H A N D L E R S */
    // OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
    //     this.OSLog("OneSignal: notification will show in foreground:", notifReceivedEvent);
    //     let notif = notifReceivedEvent.getNotification();

    //     const button1 = {
    //         text: "Cancel",
    //         onPress: () => { notifReceivedEvent.complete(); },
    //         style: "cancel"
    //     };

    //     const button2 = { text: "Complete", onPress: () => { notifReceivedEvent.complete(notif); }};

    //     Alert.alert("Complete notification?", "Test", [ button1, button2], { cancelable: true });
    // });
    OneSignal.setNotificationOpenedHandler(notification => {
        this.OSLog("OneSignal: notification opened:", notification);
    });
    OneSignal.setInAppMessageClickHandler(event => {
        this.OSLog("OneSignal IAM clicked:", event);
    });
    OneSignal.setInAppMessageLifecycleHandler({
        onWillDisplayInAppMessage: message => {
            this.OSLog("OneSignal: will display IAM: ", message.messageId)
        },
        onDidDisplayInAppMessage: message => {
            this.OSLog("OneSignal: did display IAM: ", message.messageId)
        },
        onWillDismissInAppMessage: message => {
            this.OSLog("OneSignal: will dismiss IAM: ", message.messageId)
        },
        onDidDismissInAppMessage: message => {
            this.OSLog("OneSignal: did dismiss IAM: ", message.messageId);
            console.log('Closed....');
            this.setState({ modalVisible: true })
        }
    });
    OneSignal.addEmailSubscriptionObserver((event) => {
        this.OSLog("OneSignal: email subscription changed: ", event);
    });
    OneSignal.addSMSSubscriptionObserver((event) => {
        this.OSLog("OneSignal: SMS subscription changed: ", event);
    });
    OneSignal.addSubscriptionObserver(event => {
        this.OSLog("OneSignal: subscription changed:", event);
    });
    OneSignal.addPermissionObserver(event => {
        this.OSLog("OneSignal: permission changed:", event);
    });
  }

  OSLog = (message: string, optionalArg?: Object) => {

    if (optionalArg) {
        message = message + " => " + JSON.stringify(optionalArg);
    }

    console.log('One Signal Massage...', message);
  }

  async _checkAndSendFCMToken() {
    const {store} = this.props;
    let dispatch = store.dispatch;
    let state = store.getState();

    let fcmToken = await messaging().getToken();

    if (fcmToken && state.auth.notificationTokenId != fcmToken) {
      dispatch(updateFCMToken(fcmToken));
      return;
    }
  }

  componentWillUnmount() {
    // console.log('ComponentWillUnmount works..........')
    this.unSubscribeStore();
  }

  setIapModelVisibility(iapModelVisibility: boolean) {
    this.setState({iapModelVisibility});
  }
  setModelVisble(modalVisible: boolean) {
    this.setState({modalVisible});
  }

  onbannerButton = () => {
    this.setModelVisble(true);
  };

  getAsyncvalue = async () => {
    const isVideoSeen = await AsyncStorage.getItem('videoSeen')
    const isNotFreeTrial = await AsyncStorage.getItem('openModel')
    
    if(isNotFreeTrial == 'true'){
      this.setState({ freeTrails: true })
    }else if(isVideoSeen == 'false'){
      this.setState({ videoSeen: true })
    }else{ 
      this.setState({ freeTrails: false, videoSeen: false })
    }

  }

  render() {
    const {store, categories} = this.props;
    let trialExpiry =
      store.getState().auth.userData &&
      typeof store.getState().auth.userData.created_on !== 'undefined'
        ? fromToTimezone(
            store.getState().auth.userData.created_on,
            'UTC',
            RNLocalize.getTimeZone(),
          )
            .add('3', 'days')
            .format('Y-MM-DD HH:mm:ss')
        : null;
    let EnableGiftBanner = this.state.purchaseExpired === true && isDatePast(trialExpiry)
    if(this.state.purchaseExpired){
      if(this.state.freeTrails || this.state.videoSeen){
        EnableGiftBanner = true
      }
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={Platform.OS=='ios' ? 'dark-content' : 'default'} hidden={false}/>
        <View style={{paddingBottom: EnableGiftBanner?10: 0}}>

          {EnableGiftBanner && (
            <View style={Platform.OS === 'ios' && styles.iOSzindex}>
              <GiftBannerHeader parentCallback={this.onbannerButton} />
            </View>
          )}

          {/*<View>*/}
          {/*    <Text style={styles.textBold}>{i18n.t('home.workout')}</Text>*/}
          {/*</View>*/}
          {!this.state.showConfettiAnimation || (
            <View style={{zIndex: 99}}>
              <ConfettiAnimation />
            </View>
          )}
          <Image
            source={gradientImage}
            resizeMode={'cover'}
            style={{ 
              position: 'absolute',
              top: -WIDTH * 0.2,
              left: -WIDTH * 0.15,
              width: EnableGiftBanner ? WIDTH * 0.6 : WIDTH * 0.55,
              height: EnableGiftBanner ? WIDTH * 0.6 : WIDTH * 0.55,
            }}
            />
          <HomeHeader store={store} banner={EnableGiftBanner} navigation={this.props.navigation} />
        </View>
        <ScrollView style={{marginTop: EnableGiftBanner ? 0 :  HEIGHT * 0.06}}>
          {/*<Title title={i18n.t('home.current_goals')} />*/}
          <GoalCarousel
            purchaseExpired={this.state.purchaseExpired}
            setIapModelVisibility={this.setIapModelVisibility.bind(this)}
            navigation={this.props.navigation}
            categories={this.props.categories.categoryList}
            data={this.state.data}
          />
          {/*<Title title={i18n.t('home.more_workout')} />*/}
          {/* <Text onPress={() => crashlytics().crash()}>Crash</Text> */}
          {/*<WeeklyGoal navigation={this.props.navigation}/>*/}
          <Category
            purchaseExpired={this.state.purchaseExpired}
            setIapModelVisibility={this.setIapModelVisibility.bind(this)}
            categories={categories.categoryList}
            navigation={this.props.navigation}
          />
        </ScrollView>
        <InAppPurchaseModalNew
          onCancel={() => this.setIapModelVisibility(false)}
          visibility={this.state.iapModelVisibility}
          store={store}
        />
        <GiftModel
          onCancel={() => this.setModelVisble(false)}
          visibility={this.state.modalVisible}
          store={store}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textBold: {
    textAlign: 'left',
    paddingHorizontal: '5%',
    fontSize: 24,
    color: '#032426',
    marginTop: 20,
  },
  iOSzindex: {
    zIndex: 1500,
  },
});
