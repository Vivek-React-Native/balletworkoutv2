import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

export default class PushNotificationService {

    lastId = 0;

    constructor(onNotification: any) {
        this.configure(onNotification);

        this.lastId = 0;
    }

    configure(onNotification: any) {
        PushNotification.configure({

            // (required) Called when a remote or local notification is opened or received
            onNotification: onNotification, //this._onNotification,

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
              * (optional) default: true
              * - Specified if permissions (ios) and token (android and ios) will requested or not,
              * - if not, you must call PushNotificationsHandler.requestPermissions() later
              */
            requestPermissions: true,
        });
    }

    localNotif() {
        this.lastId++;
        PushNotification.localNotification({
            /* Android Only Properties */
            id: '' + this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            ticker: "My Notification Ticker", // (optional)
            autoCancel: true, // (optional) default: true
            largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
            smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
            bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
            subText: "This is a subText", // (optional) default: none
            color: "red", // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: 'some_tag', // (optional) add tag to message
            group: "group", // (optional) add group to message
            ongoing: false, // (optional) set whether this is an "ongoing" notification

            /* iOS only properties */
            alertAction: 'view', // (optional) default: view
            category: "category", // (optional) default: null
            userInfo: { "user": "sagar" }, // (optional) default: null (object containing additional notification data)

            /* iOS and Android properties */
            title: "Local Notification", // (optional)
            message: "My Notification Message", // (required)
            playSound: false, // (optional) default: true
            soundName: 'ballet_notif_1.mp3', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
            actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
        });
    }

    goalNotif({ id, notifTime, title, message, type, time, data, notifType }) {
        PushNotification.localNotificationSchedule({
            date: Platform.OS === 'ios' && type === 'time' && notifTime.getDate() === (new Date()).getDate() ? new Date(notifTime.getTime() + time): notifTime,

            /* Android Only Properties */
            id: '' + id, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            //ticker: "My Notification Ticker", // (optional)
            autoCancel: true, // (optional) default: true
            largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
            smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
            //bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
            //subText: "This is a subText", // (optional) default: none
            //color: "blue", // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: 'some_tag', // (optional) add tag to message
            group: "group", // (optional) add group to message
            ongoing: false, // (optional) set whether this is an "ongoing" notification

            /* iOS only properties */
            alertAction: 'view', // (optional) default: view
            category: notifType || "category", // (optional) default: null
            userInfo: data, // (optional) default: null (object containing additional notification data)

            /* iOS and Android properties */
            title: title, // (optional)
            message: message, // (required)
            playSound: true, // (optional) default: true
            soundName: 'ballet_notif_1.mp3', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            repeatType: type,
            repeatTime: time
        });
    }

    checkPermission(cbk) {
        return PushNotification.checkPermissions(cbk);
    }

    cancelNotif(id: any) {
        PushNotification.cancelLocalNotifications({ id: '' + id });
    }

    cancelAll() {
        PushNotification.cancelAllLocalNotifications();
    }
}
