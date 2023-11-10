import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, Image } from 'react-native';
import { List, ListItem, Left, Body, Right } from 'native-base';
import timelineImage from './../../../../assets/images/schedule_timeline.png';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../../../utilities/Theme';
import { findArray } from '../../../../utilities/Functions';
import Icon from 'react-native-vector-icons/Ionicons';
import { exportedStore } from '../../../../store';
import i18n from '../../../../common/i18n';

interface Props {
    scheduleTime: any;
    registrations: any;
    registerClass: Function;
    day: string;
    registrationDetails: any;
}
interface State {
    availableSpots: number;
    spotsVisible: boolean;
}
export default class ScheduleTime extends Component<Props, State> {

    unSubscribeStore: Function;
    mounted: boolean = true;
    state = {
        availableSpots: 0,
        spotsVisible: false,
    };

    componentDidMount() {
        let state = exportedStore.getState();
        let { availableSpots, spotsVisible } = state.schedule;
        if (this.mounted) {
            this.setState({ availableSpots, spotsVisible });
        }

        this.unSubscribeStore = exportedStore.subscribe(() => {
            let state = exportedStore.getState();
            let { availableSpots, spotsVisible } = state.schedule;
            if (this.mounted) {
                this.setState({ availableSpots, spotsVisible });
            }
        });
    }

    renderScheduleTime(time: string, daySchedule: any) {
        if (daySchedule[time] === "") {
            return null;
        }

        let timings = time.split('-');
        let timeStart = timings[0];
        let timeEnd = timings[1];


        let classId = this.props.day + ':' + daySchedule[time];

        const { registrations, registrationDetails } = this.props;
        const registeredClass = findArray(registrations, { class_id: classId });
        let scheduleRegistration = typeof registrations != 'undefined' ? registeredClass.length > 0 : false;
        let fullRegistration = typeof registrationDetails != 'undefined' && typeof registrationDetails[classId] != 'undefined' ? registrationDetails[classId][0].is_full : false;

        let regRemaining = typeof registrationDetails != 'undefined' && typeof registrationDetails[classId] != 'undefined' ? registrationDetails[classId][0].remaining : this.state.availableSpots;

        return (
            <ListItem
                button
                key={time}
                style={styles.timeListItem}
                onPress={() => this.props.registerClass(scheduleRegistration ? registeredClass[0].id : classId, scheduleRegistration)}>
                <Left style={styles.timeLeft}>
                    <Image style={styles.timelineImage} source={timelineImage} />
                    <Text style={[styles.scheduleTimeText]}>{timeStart}</Text>
                    <Text style={[styles.scheduleTimeText]}>{timeEnd}</Text>
                </Left>
                <Body style={[styles.timeBody, !this.state.spotsVisible ? { justifyContent: 'center'} : null]}>
                    <View style={styles.timeBodyChildren}>
                        {!fullRegistration || <Icon style={styles.registrationCheckMark} name='alert-circle-outline' color={SECONDARY_COLOR} />}
                        <Text style={[styles.timeBodyText]}>{daySchedule[time]} </Text>
                    </View>
                    {
                        !this.state.spotsVisible ||
                        <View style={styles.timeBodyChildren}>
                            <Text style={styles.timeRightText}>{i18n.t('schedule.available_spots_text')}: {regRemaining}</Text>
                        </View>
                    }
                </Body>
                <Right style={styles.timeRight}>
                    {!scheduleRegistration || <Icon style={styles.registrationCheckMark} name='ios-checkmark-circle' color={SECONDARY_COLOR} />}
                </Right>
            </ListItem>
        );
    }

    componentWillUnmount() {
        this.mounted = false;
        this.unSubscribeStore();
    }

    render() {
        const { scheduleTime } = this.props;
        return (
            <View style={styles.container}>
                <List>
                    {
                        typeof scheduleTime !== 'undefined' ? Object.keys(scheduleTime).map((timeKey, index) => this.renderScheduleTime(timeKey, scheduleTime)) : null
                    }
                </List>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    timeListItem: {
        height: 100,
        marginLeft: 0,
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomColor: '#eeeeee',
        borderBottomWidth: 2
    },
    timeBody: {
        flex: 3.5,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    timeBodyChildren: {
        flexDirection: 'column',
    },
    timeLeft: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    timeRight: {
        height: "100%",
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    },
    timeRightText: {
        fontFamily: 'Montserrat-Medium',
        color: PRIMARY_COLOR,
        fontSize: 15,
    },
    timelineImage: {
        top: 0,
        left: 0,
        position: 'absolute',
        width: 11,
        height: 80,
        alignSelf: 'flex-start',
        resizeMode: 'contain',
    },
    scheduleTimeText: {
        marginLeft: 20,
        fontFamily: 'Montserrat-Medium',
        color: PRIMARY_COLOR,
        opacity: .8
    },
    timeBodyText: {
        fontFamily: 'Montserrat-SemiBold',
        color: PRIMARY_COLOR,
        fontSize: 15,
    },
    registrationCheckMark: {
        fontSize: 25
    }
});
