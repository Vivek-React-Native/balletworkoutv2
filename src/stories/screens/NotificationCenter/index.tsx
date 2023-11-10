import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { Card, CardItem } from 'native-base';
import { SECONDARY_COLOR, PRIMARY_COLOR, PADDING_LEFT_RIGHT, LIGHT_GREY } from '../../../utilities/Theme';
import { exportedStore } from '../../../store';
import fetchNotifications from '../../../container/NotificationCenterContainer/actions';
import Loader from '../../../common/components/Loader';
import moment from 'moment';

interface Props { }
interface State {
    notifications: any;
    isLoading: boolean;
}

export default class NotificationCenter extends Component<Props, State> {

    unSubscribeStore: Function;

    state = {
        notifications: [],
        isLoading: true,
    };

    componentWillMount() {
        exportedStore.dispatch(fetchNotifications());

        let notifications = exportedStore.getState().notificationCenter.notifications;
        this.setState({ notifications });

        this.unSubscribeStore = exportedStore.subscribe(() => {

            let notifications = exportedStore.getState().notificationCenter.notifications;

            let isLoading = exportedStore.getState().notificationCenter.isLoading;

            this.setState({ notifications, isLoading });
        });
    }

    _renderListItem({ item }) {
        return (
            <Card key={item.id}>
                <CardItem style={styles.notification} >
                    <Text style={styles.notificationTime}>{moment(item.created_at, 'YYYY-MM-DD').format('ll')}</Text>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationBody}>{item.body}</Text>
                </CardItem>
            </Card>
        );
    }

    _refreshList() {
        exportedStore.dispatch(fetchNotifications());
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    render() {
        return (
            <View style={styles.container}>
                {!this.state.isLoading || <Loader />}
                <FlatList
                    onRefresh={() => this._refreshList()}
                    data={this.state.notifications}
                    refreshing={this.state.isLoading}
                    renderItem={this._renderListItem} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: PADDING_LEFT_RIGHT,
        paddingRight: PADDING_LEFT_RIGHT,
    },
    notification: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    notificationTitle: {
        fontFamily: 'Montserrat-SemiBold',
        color: SECONDARY_COLOR,
        fontSize: 18,
        marginBottom: 10,
    },
    notificationBody: {
        fontFamily: 'Montserrat-Regular',
        color: PRIMARY_COLOR,
        fontSize: 16
    },
    notificationTime: {
        alignSelf: 'flex-end',
        fontFamily: 'Montserrat-Regular',
        color: LIGHT_GREY
    }
});
