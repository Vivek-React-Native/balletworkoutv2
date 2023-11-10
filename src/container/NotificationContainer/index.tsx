import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Notification from './../../stories/screens/Notification';
import { connect } from 'react-redux';
import { updateNotification } from './../../common/auth/actions';
import { CALLBACK_ENUMS } from '../../stories/screens/Notification';
import PushNotificationService from './../../common/tools/PushNotificationService';
import { turnOffGoalNotification, turnOnGoalNotification } from './../../container/GoalsContainer/actions';

interface Props {
    screenProps: any;
    navigation: any;
    updateNotification: Function;
    store: any;
    notifService: any;
    turnOffGoalNotification: Function;
    turnOnGoalNotification: Function;
}
interface State { }
export class NotificationContainer extends Component<Props, State> {

    storeUnsubscribe: any = null;
    /**
     * @var PushNotificationService
     */
    notifService = new PushNotificationService(() => { });

    /**
     * callback handler
     * @param type 
     * @param data 
     */
    callbackHandler(type: String, data: any) {
        switch (type) {
            case CALLBACK_ENUMS.UPDATE_NOTIFICATION_PREFERENCE:
                this.props.updateNotification(data);
                if (data.on) {
                    this._initializeNotification();
                }
                break;
            case CALLBACK_ENUMS.GOAL_NOTIFICATION_CANCELED:
                this._clearNotifications();
                break;
        }
    }

    /**
     * Create notification
     * @param goal 
     */
    private _initializeNotification() {
        const { store } = this.props.screenProps;

        let goalsStarted = store.getState().goals.goalsStarted;

        this.notifService.cancelAll();

        goalsStarted.map((goal: any) => {
            if (goal.is_finished !== 1) { // if notification is not finished

                let time = goal.notification_time.split(':');
                let notifTime = new Date();
                notifTime.setHours(time[0], time[1], 0)

                let notifData = {
                    id: goal.notifId,
                    notifTime: notifTime,
                    title: 'Goal Reminder',
                    message: goal.name
                };
                this.notifService.goalNotif(notifData);
                this.props.turnOnGoalNotification(goal.notifId);
            }
        });
    }

    /**
     * Clear already created goal notification
     * @param id 
     */
    _clearNotifications() {
        const { store } = this.props.screenProps;
        let goalsStarted = store.getState().goals.goalsStarted;
        this.notifService.cancelAll(); // first cancel all

        goalsStarted.map((goal: any, index: number) => {
            this.props.turnOffGoalNotification(goal.notifId);
        });

    }

    render() {
        const { screenProps: { store }, navigation } = this.props;
        return (
            <View style={styles.container}>
                {
                    this.props.screenProps.isConnectedToNetwork ?
                        null :
                        <Notification />
                }
                <Notification
                    callbackHandler={this.callbackHandler.bind(this)}
                    navigation={navigation}
                    store={store} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    }
});


const mapStateToProps = (state: any) => {
    const { auth } = state;

    return auth;
}

const mapDispatchToProps = (dispatch: Function) => {
    return {
        updateNotification: (notification: any) => { dispatch(updateNotification(notification)) },
        turnOffGoalNotification: (notifId: any) => { dispatch(turnOffGoalNotification(notifId)) },
        turnOnGoalNotification: (notifId: any) => { dispatch(turnOnGoalNotification(notifId)) },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationContainer)
