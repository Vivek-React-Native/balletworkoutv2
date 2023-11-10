import AUTH from './constants';
import axios from 'axios';
import {baseUrlApi} from './../appConstants';
import jwtDecode from 'jwt-decode';
import {fetchedAccountDetails} from './../../container/ProfileContainer/actions';
import {NavigationActions} from 'react-navigation';
// import firebase from 'react-native-firebase';
import messaging from '@react-native-firebase/messaging';
import {PURGE} from 'redux-persist';
import {AppEventsLogger} from 'react-native-fbsdk';
import {addPurchaseDataSuccess} from '../components/InAppPurchaseModal/actions';
import {setToDefaultPref} from '../../utilities/Functions';
import AsyncStorage from '@react-native-community/async-storage';
import {AFLogEvent} from '../../utilities/AppsFlyer';

const http = axios.create({
  baseURL: baseUrlApi,
  timeout: 90000,
  headers: {'Content-Type': 'application/json'},
});

function LoggingIn() {
  return {
    type: AUTH.LOGIN,
  };
}

export function loginSuccess(tokenData: any) {
  return {
    type: AUTH.LOGIN_SUCCESS,
    payload: tokenData,
  };
}

function loginFailure(errors: any) {
  return {
    type: AUTH.LOGIN_FAILURE,
    payload: errors,
  };
}

function loggingInWithFb() {
  return {
    type: AUTH.LOGIN_WITH_FB,
  };
}

function loginWithFbSuccess(tokenData: any) {
  return {
    type: AUTH.LOGIN_WITH_FB_SUCCESS,
    payload: tokenData,
  };
}

function loginWithFbFailure(errors: any) {
  return {
    type: AUTH.LOGIN_WITH_FB_FAILURE,
    payload: errors,
  };
}

function updatingUserData(userData: any) {
  return {
    type: AUTH.UPDATE_USER_DETAILS,
    payload: userData,
  };
}

function updateNotification(notification: any) {
  return {
    type: AUTH.UPDATE_NOTIFICATION_PREFERENCES,
    payload: notification,
  };
}

function registering() {
  return {
    type: AUTH.REGISTER,
  };
}

function registerSuccess(tokenData: any) {
  return {
    type: AUTH.REGISTER_SUCCESS,
    payload: tokenData,
  };
}

function registerFailure(errors: any) {
  return {
    type: AUTH.REGISTER_FAILURE,
    payload: errors,
  };
}

export function loggingOutUser() {
  return {
    type: AUTH.USER_LOGOUT,
  };
}

export function loggingOutUserSuccess() {
  return {
    type: AUTH.USER_LOGOUT_SUCCESS,
  };
}

export function loggingOutUserFailure() {
  return {
    type: AUTH.USER_LOGOUT_FAILURE,
  };
}

function deletingAccount() {
  return {
    type: AUTH.DELETE_USER,
  };
}

function deletingAccountSuccess() {
  return {
    type: AUTH.DELETE_USER_SUCCESS,
  };
}

function deletingAccountFailure(error: any) {
  return {
    type: AUTH.DELETE_USER_FAILURE,
    payload: error,
  };
}

function verifyingPurchase() {
  return {
    type: AUTH.VERIFY_USER_PURCHASE,
  };
}

export function verifyingPurchaseSuccess(purchaseExpiry: any) {
  return {
    type: AUTH.VERIFY_USER_PURCHASE_SUCCESS,
    payload: purchaseExpiry,
  };
}

function verifyingPurchaseFailure(error: any) {
  return {
    type: AUTH.VERIFY_USER_PURCHASE_FAILURE,
    payload: error,
  };
}

function savingNotificationTokenId() {
  return {
    type: AUTH.SAVE_NOTIFICATION_TOKEN_ID,
  };
}

export function savingNotificationTokenIdSuccess(notificationToken: string) {
  return {
    type: AUTH.SAVE_NOTIFICATION_TOKEN_ID_SUCCESS,
    payload: notificationToken,
  };
}

function savingNotificationTokenIdFailure(error: any) {
  return {
    type: AUTH.SAVE_NOTIFICATION_TOKEN_ID_FAILURE,
    payload: error,
  };
}

function doLogin(loginData: any) {
  return (dispatch: Function, getState: Function) => {
    dispatch(LoggingIn());

    if (loginData.username === '' || loginData.password === '') {
      dispatch(loginFailure({message: 'Email/Password incorrect'}));
    } else {
      let notifToken = getState().auth.notificationTokenId || '';

      loginData['notification_token_id'] = notifToken;

      http
        .post(baseUrlApi + 'user/login', loginData)
        .then(async (response: any) => {
          let decodedToken = jwtDecode(response.data.access_token);

          dispatch(
            loginSuccess({
              tokenData: {
                token: response.data.access_token,
                tokenInfo: decodedToken,
              },
              userData: response.data.user,
            }),
          );

          dispatch(
            fetchedAccountDetails({
              first_name: response.data.user.first_name,
              last_name: response.data.user.last_name,
              email: response.data.user.email,
              country: response.data.user.country,
              language: response.data.user.language,
              timezone: response.data.user.timezone,
            }),
          );

          dispatch(verifyPurchase(true));
          setToDefaultPref('first_time_registration', 1);
          AsyncStorage.setItem('isRegistering', '0');
          const [result] = await AFLogEvent('Logins', {email: loginData.email});
          console.log('AppsFlyer Login result.......', result);
        })
        .catch((error: any) => {
          if (typeof error.response === 'undefined') {
            dispatch(
              loginFailure({
                message: 'Server not rechable, please try again later',
              }),
            );
            return;
          }
          // dispatch(loginFailure({message: error.toString(), error: error}));
          dispatch(loginFailure(error.response.data));
        });
    }
  };
}

/**
 * Login with FB
 * @param loginData
 */
function doLoginWithFb(loginData: any) {
  return (dispatch: Function, getState: Function) => {
    dispatch(LoggingIn());

    let notifToken = getState().auth.notificationTokenId || '';

    loginData['notification_token_id'] = notifToken;

    http
      .post(baseUrlApi + 'user/signin-with-facebook', loginData)
      .then(async(response: any) => {
        let decodedToken = jwtDecode(response.data.access_token);
        dispatch(
          loginSuccess({
            tokenData: {
              token: response.data.access_token,
              tokenInfo: decodedToken,
            },
            userData: response.data.user,
          }),
        );

        dispatch(
          fetchedAccountDetails({
            first_name: response.data.user.first_name,
            last_name: response.data.user.last_name,
            email: response.data.user.email,
            country: response.data.user.country,
            language: response.data.user.language,
            timezone: response.data.user.timezone,
          }),
        );

        dispatch(verifyPurchase(true));
        setToDefaultPref('first_time_registration', 1);
        AsyncStorage.setItem('isRegistering', '0');
        const [result] = await AFLogEvent('Logins', response.data);
        console.log('AppsFlyer Facebook Login result.......', result);
      })
      .catch((errors: any) => {
        if (typeof errors.response === 'undefined') {
          dispatch(
            loginFailure({
              message: 'Server not rechable, please try again later',
            }),
          );
          return;
        }
        dispatch(loginFailure(errors.response.data));
      });
  };
}
/**
 * Login with FB
 * @param loginData
 */
function doLoginWithApple(loginData: any) {
  return (dispatch: Function, getState: Function) => {
    dispatch(LoggingIn());

    let notifToken = getState().auth.notificationTokenId || '';

    loginData['notification_token_id'] = notifToken;

    http
      .post(baseUrlApi + 'user/signin-with-apple', loginData)
      .then(async(response: any) => {
        let decodedToken = jwtDecode(response.data.access_token);
        dispatch(
          loginSuccess({
            tokenData: {
              token: response.data.access_token,
              tokenInfo: decodedToken,
            },
            userData: response.data.user,
          }),
        );

        dispatch(
          fetchedAccountDetails({
            first_name: response.data.user.first_name,
            last_name: response.data.user.last_name,
            email: response.data.user.email,
            country: response.data.user.country,
            language: response.data.user.language,
            timezone: response.data.user.timezone,
          }),
        );
        dispatch(verifyPurchase(true));
        setToDefaultPref('first_time_registration', 1);
        AsyncStorage.setItem('isRegistering', '0');
        const [result] = await AFLogEvent('Logins', response.data);
        console.log('AppsFlyer Apple Login result.......', result);
      })
      .catch((errors: any) => {
        if (typeof errors.response === 'undefined') {
          dispatch(
            loginFailure({
              message: 'Server not rechable, please try again later',
            }),
          );
          return;
        }
        dispatch(loginFailure(errors.response.data));
      });
  };
}

/**
 * Registration with FB
 * @param userData
 */
function doRegisterationWithFb(userData: any) {
  return (dispatch: Function, getState: Function) => {
    dispatch(registering());
    let notifToken = getState().auth.notificationTokenId || '';

    userData['notification_token_id'] = notifToken;

    http
      .post(baseUrlApi + 'user/signup-with-facebook', userData)
      .then(async(response: any) => {
        dispatch(registerSuccess({token: response.data.access_token}));
        let decodedToken = jwtDecode(response.data.access_token);
        dispatch(
          loginSuccess({
            tokenData: {
              token: response.data.access_token,
              tokenInfo: decodedToken,
            },
            userData: response.data.user,
          }),
        );
        AppEventsLogger.logEvent('Complete registration', {
          'Registration Method': 'facebook',
        });
        dispatch(
          fetchedAccountDetails({
            first_name: response.data.user.first_name,
            last_name: response.data.user.last_name,
            email: response.data.user.email,
            country: response.data.user.country,
            language: response.data.user.language,
            timezone: response.data.user.timezone,
          }),
        );

        dispatch(verifyPurchase());

        // dispatch(
        //   NavigationActions.navigate({
        //     routeName: 'app',
        //     params: {},
        //     action: NavigationActions.navigate({
        //       routeName: 'home',
        //       params: {
        //         showTrialPopup:
        //           typeof response.data.show_trial_popup === 'undefined'
        //             ? null
        //             : true,
        //       },
        //     }),
        //   }),
        // );
        AsyncStorage.setItem('isRegistering', '1');
        AsyncStorage.setItem('isHomeFirstTime', '0');
        setToDefaultPref('first_time_registration', 1);
        const [result] = await AFLogEvent('New_Register', response.data);
        console.log('AppsFlyer Register With Facebook ID result.......', result);
      })
      .catch((errors: any) => {
        if (typeof errors.response === 'undefined') {
          dispatch(
            registerFailure({
              message: 'Server not rechable, please try again later',
            }),
          );
          return;
        }
        dispatch(registerFailure(errors.response.data));
      });
  };
}

/**
 * Registration with FB
 * @param userData
 */
function doRegisterationWithApple(userData: any) {
  return (dispatch: Function, getState: Function) => {
    dispatch(registering());
// console.log('Apple register mistake')
    let notifToken = getState().auth.notificationTokenId || '';

    userData['notification_token_id'] = notifToken;

    http
      .post(baseUrlApi + 'user/signup-with-apple', userData)
      .then(async(response: any) => {
        dispatch(registerSuccess({token: response.data.access_token}));
        let decodedToken = jwtDecode(response.data.access_token);
        dispatch(
          loginSuccess({
            tokenData: {
              token: response.data.access_token,
              tokenInfo: decodedToken,
            },
            userData: response.data.user,
          }),
        );
        AppEventsLogger.logEvent('Complete registration', {
          'Registration Method': 'Apple',
        });
        dispatch(
          fetchedAccountDetails({
            first_name: response.data.user.first_name,
            last_name: response.data.user.last_name,
            email: response.data.user.email,
            country: response.data.user.country,
            language: response.data.user.language,
            timezone: response.data.user.timezone,
          }),
        );

        dispatch(verifyPurchase());

        // dispatch(
        //   NavigationActions.navigate({
        //     routeName: 'app',
        //     params: {},
        //     action: NavigationActions.navigate({
        //       routeName: 'home',
        //       params: {
        //         showTrialPopup:
        //           typeof response.data.show_trial_popup === 'undefined'
        //             ? null
        //             : true,
        //       },
        //     }),
        //   }),
        // );
        AsyncStorage.setItem('isRegistering', '1');
        AsyncStorage.setItem('isHomeFirstTime', '0');
        setToDefaultPref('first_time_registration', 1);
        const [result] = await AFLogEvent('New_Register', response.data);
        console.log('AppsFlyer Register With Apple ID result.......', result);
      })
      .catch((errors: any) => {
        if (typeof errors.response === 'undefined') {
          dispatch(
            registerFailure({
              message: 'Server not rechable, please try again later',
            }),
          );
          return;
        }
        dispatch(registerFailure(errors.response.data));
      });
  };
}

function doRegister(userData: any) {
  return (dispatch: Function, getState: Function) => {
    dispatch(registering());

    let notifToken = getState().auth.notificationTokenId || '';

    userData['notification_token_id'] = notifToken;

    http
      .post(baseUrlApi + 'user/register', userData)
      .then(async (response: any) => {
        dispatch(registerSuccess({token: response.data.access_token}));
        let decodedToken = jwtDecode(response.data.access_token);
        dispatch(
          loginSuccess({
            tokenData: {
              token: response.data.access_token,
              tokenInfo: decodedToken,
            },
            userData: response.data.user,
          }),
        );
        AppEventsLogger.logEvent('Complete registration', {
          'Registration Method': 'email',
        });

        dispatch(
          fetchedAccountDetails({
            first_name: response.data.user.first_name,
            last_name: response.data.user.last_name,
            email: response.data.user.email,
            country: response.data.user.country,
            language: response.data.user.language,
            timezone: response.data.user.timezone,
          }),
        );

        dispatch(verifyPurchase());

        // dispatch(
        //   NavigationActions.navigate({
        //     routeName: 'app',
        //     params: {},
        //     action: NavigationActions.navigate({
        //       routeName: 'home',
        //       params: {
        //         showTrialPopup:
        //           typeof response.data.show_trial_popup === 'undefined'
        //             ? null
        //             : true,
        //       },
        //     }),
        //   }),
        // );
        AsyncStorage.setItem('isRegistering', '1');
        AsyncStorage.setItem('isHomeFirstTime', '0');
        setToDefaultPref('first_time_registration', 1);

        const [result] = await AFLogEvent('New_Register', {email: userData.email, country: userData.country, firstName: userData.first_name, timezone: userData.timezone});
        console.log('AppsFlyer Register result.......', result);
      })
      .catch((errors: any) => {
        if (typeof errors.response === 'undefined') {
          dispatch(
            registerFailure({
              message: 'Server not rechable, please try again later',
            }),
          );
          return;
        }
        dispatch(registerFailure(errors.response.data));
      });
  };
}

export function refreshToken(dispatch: Function, getState: Function) {
  let token = getState().auth.tokenData.token;

  var freshTokenPromise = http
    .post(
      'user/refresh-user-token',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then(({data}) => {
      dispatch({
        type: AUTH.REFRESH_USER_TOKEN_SUCCESS,
      });

      let decodedToken = jwtDecode(data.access_token);

      dispatch(
        loginSuccess({
          tokenData: {
            token: data.access_token,
            tokenInfo: decodedToken,
          },
          userData: data.user,
        }),
      );

      return data.access_token
        ? Promise.resolve(data.access_token)
        : Promise.reject({
            message: 'could not refresh token',
          });
    })
    .catch((e: any) => {
      // console.log('RefreshToken........', e);
      dispatch({
        type: AUTH.REFRESH_USER_TOKEN_FAILURE,
      });

      if (typeof e.response !== 'undefined' && e.response.status === 401) {
        dispatch(logOutUser());
        dispatch(NavigationActions.navigate({routeName: 'login'}));
      }

      return Promise.reject(e);
    });
  // });

  dispatch({
    type: AUTH.REFRESH_USER_TOKEN,

    // we want to keep track of token promise in the state so that we don't try to refresh
    // the token again while refreshing is in process
    freshTokenPromise,
  });

  return freshTokenPromise;
}

export function logOutUser() {
  return (dispatch: Function) => {
    dispatch(loggingOutUser());
    dispatch(loggingOutUserSuccess());
  };
}

export function deleteAccount() {
  return (dispatch: Function, getState: Function) => {
    dispatch(deletingAccount());

    let token = getState().auth.tokenData.token;
    http
      .post(
        'user/delete-user',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(({data}) => {
        dispatch(deletingAccountSuccess());
        dispatch(logOutUser());
      })
      .catch(({response}) => {
        dispatch(deletingAccountFailure(response.data.error));
      });
  };
}

export function verifyPurchase(live: boolean = true) {
  return (dispatch: Function, getState: Function) => {
    dispatch(verifyingPurchase());

    let token = getState().auth.tokenData.token;

    http
      .post(
        `user/verify-purchase`,
        {
          live: live,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(({data}) => {
        dispatch(verifyingPurchaseSuccess(data.expiry));
        dispatch(
          addPurchaseDataSuccess({
            expiryTime: data.expiry,
            productId: 'serverTrial',
          }),
        );
      })
      .catch((error: any) => {
        if (typeof error.response === 'undefined') {
          dispatch(
            verifyingPurchaseFailure('Cannot reach server, network failure'),
          );
          return;
        }
        dispatch(verifyingPurchaseFailure(error.response.data));
      });
  };
}

export function saveNotificationTokenId() {
  return (dispatch: Function, getState: Function) => {
    dispatch(savingNotificationTokenId());
    messaging()
      .getToken()
      .then((token: string) => {
        if (token) {
          // console.log('PushNotification Token', token);
          dispatch(savingNotificationTokenIdSuccess(token));
        } else {
          console.log('PushNotification Token Error');
          dispatch(savingNotificationTokenIdFailure('some error occurred'));
        }
      })
      .catch(e => {
        dispatch(savingNotificationTokenIdFailure('some error occurred'));
      });
  };
}

function updatingFCMToken() {
  return {
    type: AUTH.SEND_NOTIFICATION_TOKEN_ID,
  };
}

function updatingFCMTokenSuccess(token: string) {
  return {
    type: AUTH.SEND_NOTIFICATION_TOKEN_ID_SUCCESS,
    payload: token,
  };
}

function updatingFCMTokenFailure(error: any) {
  return {
    type: AUTH.SEND_NOTIFICATION_TOKEN_ID_FAILURE,
    payload: error,
  };
}

export function updateFCMToken(fcmToken: string = '') {
  return (dispatch: Function, getState: Function) => {
    let token = getState().auth.tokenData.token;
    if (fcmToken !== '') {
      dispatch(updatingFCMToken());
      http
        .post(
          `user/update-fcm-token`,
          {notification_token_id: fcmToken},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(({data}) => {
          dispatch(updatingFCMTokenSuccess(fcmToken));
        })
        .catch(({response}) => {
          if (typeof response === 'undefined') {
            dispatch(
              updatingFCMTokenFailure({
                message: 'Server not rechable, please try again later',
              }),
            );
            return;
          }
          dispatch(updatingFCMTokenFailure(response.error));
        });
    }
  };
}

export function purgeStore() {
  return {
    type: PURGE,
    key: 'root',
    result: () => null,
  };
}

export {
  doLogin,
  doRegister,
  doRegisterationWithFb,
  doLoginWithFb,
  doRegisterationWithApple,
  doLoginWithApple,
  updatingUserData,
  updateNotification,
};


// https://app.balletworkout.be/api/v1/user/register for Register
// https://app.balletworkout.be/api/v1/user/signup-with-facebook for Facebook Register
// https://app.balletworkout.be/api/v1/user/signup-with-apple for Apple Register