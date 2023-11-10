import appsFlyer from 'react-native-appsflyer';

// onInstallConversionDataListener: true,
// timeToWaitForATTUserAuthorization: 10,
// onDeepLinkListener: true,
// if (Platform.OS == 'ios') {
//   appsFlyer.setCurrentDeviceLanguage("EN");
// }
// appsFlyer.setAppInviteOneLinkID('oW4R');

// AppsFlyer initialization flow. ends with initSdk.

// Sends in-app events to AppsFlyer servers. name is the events name ('simple event') and the values are a JSON ({info: 'fff', size: 5})

export async function AFLogEvent(name, values) {
  const data = await appsFlyer.logEvent(name, values);
  return data;
}

export function AFInit() {
  const data = appsFlyer.initSdk({
    devKey: '5f3vfVEcD9NPDMPjRHLnE8',
    isDebug: true, // set to true if you want to see data in the logs
    appId: '1447342760', // iOS app id
  });
  return data
}