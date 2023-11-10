import React, {Component} from 'react';
import {StyleSheet,Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import NetInfo from '@react-native-community/netinfo';
import {Root} from 'native-base';
import {Provider} from 'react-redux';
import configureStore, {exportedStore} from './src/store';
import AppNavigator from './src/Navigator';
import PushNotificationService from './src/common/tools/PushNotificationService';
import DefaultPreference from 'react-native-default-preference';
// import firebase from 'react-native-firebase';
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
// import { Notification, NotificationOpen } from 'react-native-firebase/notifications';
import {NavigationActions} from 'react-navigation';
import * as RNIap from 'react-native-iap';

// I18n internationalization
import {withTranslation, I18nextProvider} from 'react-i18next';
import i18n from './src/common/i18n';
import Logo from './src/common/components/Logo';
import {HEIGHT, PRIMARY_COLOR, PRIMARY_COLOR_NEW} from './src/utilities/Theme';
import {
  saveNotificationTokenId,
  purgeStore,
  verifyingPurchaseSuccess,
  verifyPurchase,
  updateFCMToken,
  logOutUser,
} from './src/common/auth/actions';
import http from './src/common/tools/axiosClient';
import Splash from './src/common/components/Splash';
import {AFInit, AFLogEvent} from './src/utilities/AppsFlyer';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import OneSignal from 'react-native-onesignal';
console.disableYellowBox = true;

// Build a notification channel rnfirebase
// const channel = new firebase.notifications.Android.Channel('ballet-workout', 'Ballet Workout', firebase.notifications.Android.Importance.High)
//   .setDescription('Ballet Workout Notifications')
//   .setSound('ballet_notif_1.mp3');
// firebase.notifications().android.createChannel(channel);

const WrappedAppNavigator = ({t, screenProps}) => (
  <AppNavigator screenProps={{...screenProps, t}} />
);
const ReloadAppOnLanguageChange = withTranslation('translation', {
  bindI18n: 'languageChanged',
  bindStore: false,
})(WrappedAppNavigator);

interface Props {}
interface State {
  isLoading: boolean;
  store: any;
  firstTimeLaunch: string;
  isConnectedToNetwork: boolean;
  isGetDataFromAPI: boolean;
  isFinishSplash: boolean;
  showSplashScreen: boolean;
}
export default class App extends Component<Props, State> {
  notifService = new PushNotificationService((notif: any) =>
    this._onNotification(notif),
  );
  unsubscribeNetInfo: Function;
  onTokenRefreshListener: any;
  firstTimeLaunch: boolean;
  pushNotifDisplayedListener: Function;
  pushNotifListener: Function;
  pushNotificationOpenedListener: Function;

  constructor(props: any) {
    super(props);
    const {store, persistor} = configureStore(() =>
      this._onStoreReady(persistor),
    );

    this.state = {
      isLoading: true,
      store: store,
      firstTimeLaunch: '',
      isConnectedToNetwork: true,
      isGetDataFromAPI: false,
      isFinishSplash: false,
      showSplashScreen: true
    };
    this.checkCloudMessagingPermissions();
  }

  async ActiveAppsflyer() {
    try {
      const downloaded: string | null = await AsyncStorage.getItem('downloaded');
      const success = await AFInit();
      console.log('AppsFlyer Initialization Result........', success);
      const result = await AFLogEvent('App_Started', {app: 'App_Started'});
      console.log('AppsFlyer App Started result.......', result);
      if (downloaded) {
        console.log('user already downloaded this app......');
      } else {
        const settingData = await AsyncStorage.setItem('downloaded','true');
        const result = await AFLogEvent('New_Downloads', {
          download: 'New_Download',
        });
        console.log('AppsFlyer new Download result.......', result);
      }
    } catch (error) {
      console.log('AppsFlyer AsyncStorage Error in App.tsx.......', error);
    }
  }

  componentDidMount() {
    SplashScreen.hide();
    /* O N E S I G N A L   S E T U P */
    OneSignal.setAppId("9158d885-a514-40be-b870-df7e427db2e3");
    OneSignal.setLogLevel(6, 0);
    // OneSignal.setExternalUserId('');
    // OneSignal.setRequiresUserPrivacyConsent(this.state.requiresPrivacyConsent);
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
        console.log("Prompt response:", response);
    });
    this.ActiveAppsflyer();
    AsyncStorage.setItem('isRegistering', '0');
    this.unsubscribeNetInfo = NetInfo.addEventListener(
      this.connectionListener.bind(this),
    );
    this._firebaseInitilization();
  }


  connectionListener: Function = (connectionInfo: any) => {
    // console.log('connected to network: ', connectionInfo);
    this.setState({isConnectedToNetwork: connectionInfo.isConnected});
  };

  /**
   * On redux persist hydrated data
   */
  async _onStoreReady(persistor: any) {
    // await DefaultPreference.get('app_first_launch_performed').then(async (value: any) => {
    // console.log("app_first_launch_performed", value);
    // 	if (Platform.OS === 'ios') {
    // 		if (value === null || typeof value === 'undefined') {
    // 			this.state.store.dispatch(logOutUser());
    // 			// await persistor.flush();
    // 		}
    // 	}
    // });
    // await this.setState({ firstTimeLaunch: await DefaultPreference.get('app_first_launch_performed') });

    if (
      typeof this.state.store.getState().auth.tokenData !== 'undefined' &&
      this.state.store.getState().auth.tokenData !== null
    ) {
      await this._isPurchaseValid();
      this.onTokenRefreshListener = messaging().onTokenRefresh(fcmToken => {
        if (fcmToken) {
          this.state.store.dispatch(updateFCMToken(fcmToken));
        }
      });
    }
    if (this.state.store.getState().auth.notificationTokenId === null) {
      this.state.store.dispatch(saveNotificationTokenId());
    }

    // console.log('this.state.store.getState():', this.state.store.getState());
    const language = await AsyncStorage.getItem('language');

    let lang =
      this.state.store.getState().auth.isLoggedIn &&
      this.state.store.getState().auth.userData
        ? this.state.store.getState().auth.userData?.language || language 
        : 'en-US';
    i18n.changeLanguage(lang);
    this.setState({isGetDataFromAPI: true});
    if (this.state.isFinishSplash) {
    }
    this.setState({isLoading: false});
    // this.setState({isLoading: false});
  }

  async _isPurchaseValid() {
    try {
      const isConnected = await RNIap.initConnection();
      let availablePurchases = await RNIap?.getAvailablePurchases();
      if (availablePurchases.length > 0) {
        let purchase = availablePurchases[0];
        let purchaseData = {
          platform: Platform.OS,
          purchaseData: purchase,
          productId: purchase.productId,
        };

        let token = this.state.store.getState().auth.tokenData.token;

        let purchaseStatusResponse = await http().post(
          `user/add-and-verify-purchase`,
          purchaseData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // console.log('Expire.........',purchaseStatusResponse)

        let {
          data: {expiry},
        } = purchaseStatusResponse;

        this.state.store.dispatch(verifyingPurchaseSuccess(expiry));
      } else {
        this.state.store.dispatch(verifyPurchase(true));
      }
    } catch (error) {}
  }

  _firebaseInitilization() {
    crashlytics().setCrashlyticsCollectionEnabled(true);
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        if (remoteMessage.data.type === 'schedule_notification') {
          this.state.store.dispatch(
            NavigationActions.navigate({
              routeName: 'schedule',
            }),
          );
        }
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          if (remoteMessage.data.type === 'schedule_notification') {
            this.state.store.dispatch(
              NavigationActions.navigate({
                routeName: 'schedule',
              }),
            );
          }
        }
      });
  }

  async checkCloudMessagingPermissions() {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      // console.log('has permissions cloud messaging');
      // user has permissions
    } else {
      // console.log('no permissions cloud messaging');
      try {
        // console.log('requesting permission...');
        await messaging().requestPermission();
        // User has authorised
      } catch (error) {
        // console.log('requesting permission error: ', error);
        // User has rejected permissions
      }
    }
  }

  /**
   * on notification open/receive callback
   * @param notification
   */
  _onNotification(notification: any) {
    console.log('NOTIFICATION click.......', notification);

    if (
      Platform.OS === 'android' &&
      notification.category === 'GOAL REMINDER'
    ) {
      //console.log('Reminder');
      this.state.store.dispatch(
        NavigationActions.navigate({
          routeName: 'exercises',
          params: {
            id: notification.userInfo.goal_id,
            subCategoryType: 'GOAL',
            subCategory: {
              ...notification.userInfo,
              id: notification.userInfo.goal_id,
            },
          },
        }),
      );
    }

    if (
      Platform.OS === 'ios' &&
      typeof notification.data !== 'undefined' &&
      typeof notification.data.goal_id !== 'undefined'
    ) {
      //console.log('Reminder');
      this.state.store.dispatch(
        NavigationActions.navigate({
          routeName: 'exercises',
          params: {
            id: notification.data.goal_id,
            subCategoryType: 'GOAL',
            subCategory: {...notification.data, id: notification.data.goal_id},
          },
        }),
      );
    }
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  }

  componentWillUnmount() {
    // this.pushNotifDisplayedListener();
    // this.pushNotifListener();
    // this.pushNotificationOpenedListener();
    this.unsubscribeNetInfo();
  }

  render() {
    return this.state.showSplashScreen ?
      <Splash parentCallback={(progress: boolean)=> this.setState({ showSplashScreen: progress })} />
      : (
        <Provider store={this.state.store}>
          <Root>
            <I18nextProvider i18n={i18n}>
              <ReloadAppOnLanguageChange
                screenProps={{
                  notifService: this.notifService,
                  store: this.state.store,
                  firstTimeLaunch: this.state.firstTimeLaunch,
                  setFirstTime: () => this.setState({firstTimeLaunch: '1'}),
                  isConnectedToNetwork: this.state.isConnectedToNetwork,
                }}
              />
            </I18nextProvider>
          </Root>
        </Provider>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR_NEW,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    width: '100%',
    height: HEIGHT,
  },
});
