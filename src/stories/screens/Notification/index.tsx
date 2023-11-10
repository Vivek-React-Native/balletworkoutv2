import React, { Component } from 'react';
import { View, Switch, StyleSheet, Text } from 'react-native';
import { PRIMARY_COLOR, SECONDARY_COLOR } from './../../../utilities/Theme';
import { List, ListItem, Body, Right, Button } from 'native-base';
import i18n from './../../../common/i18n';
import AppHeader from './../../../common/components/AppHeader/AppHeader';

const VIEW_CALLBACK_ENUM = {
    UPDATE_NOTIFICATION_PREFERENCE: 'notications/update-notification-preference',
    GOAL_NOTIFICATION_CANCELED: 'notification/cancelled-notification',
};

interface Props {
    store: any;
    navigation: any;
    callbackHandler: Function;
}
interface State {
    notification: boolean;
}
export default class Notification extends Component<Props, State> {

    state = {
        notification: this.props.store.getState().auth.notifications.on,
    }

    notificationToggle(value: any) {
        this.setState({ notification: value });
    }

    _onSubmit() {
        let on = this.state.notification;
        let sound = 'default';
        this.props.callbackHandler(VIEW_CALLBACK_ENUM.UPDATE_NOTIFICATION_PREFERENCE, { on, sound });

        if(!on) {
            this.props.callbackHandler(VIEW_CALLBACK_ENUM.GOAL_NOTIFICATION_CANCELED);
        }

    }

    render() {
        return (
            <View style={styles.contianer}>
                <AppHeader navigation={this.props.navigation} />

                <List>

                    <ListItem style={[styles.listItem]} itemHeader first>
                        <Text style={styles.listItemHeaderText}>{i18n.t('settings.notification_setting.header')}</Text>
                    </ListItem>

                    <ListItem style={styles.listItem}>
                        <Body>
                            <Text style={styles.listItemText}>{i18n.t('settings.notification_setting.notification_on')}</Text>
                        </Body>
                        <Right>
                            <Switch
                                trackColor={{ true: SECONDARY_COLOR, false: '#fff' }}
                                thumbColor={PRIMARY_COLOR}
                                style={styles.switchStyle}
                                onValueChange={this.notificationToggle.bind(this)}
                                value={this.state.notification} />
                        </Right>
                    </ListItem>
                </List>

                <View style={styles.buttonContainer}>
                    <Button block onPress={() => this._onSubmit()}
                        style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>{i18n.t('settings.notification_setting.save_setting').toUpperCase()}</Text>
                    </Button>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    contianer: {
        flex: 1
    },
    switchStyle: {
        borderWidth: 2,
        borderRadius: 15,
        borderColor: PRIMARY_COLOR,
    },
    listItem: {
        marginLeft: 0,
        paddingLeft: 15,
        paddingRight: 15,
    },
    listItemText: {
        fontFamily: 'Montserrat-Regular',
        color: PRIMARY_COLOR,
    },
    listItemHeaderText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: PRIMARY_COLOR,
    },
    buttonContainer: {
        flex: 1,
        paddingRight: 15,
        paddingLeft: 15,
    },
    submitButton: {
        backgroundColor: PRIMARY_COLOR,
    },
    submitButtonText: {
        color: '#fff'
    }
});

export { VIEW_CALLBACK_ENUM as CALLBACK_ENUMS }
