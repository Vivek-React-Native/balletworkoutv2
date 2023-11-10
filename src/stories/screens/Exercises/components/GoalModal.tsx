import React, {Component} from 'react';
import {View, StyleSheet, TimePickerAndroid, TouchableOpacity, ScrollView} from 'react-native';
import {
    PRIMARY_COLOR_NEW,
    SECONDARY_COLOR_NEW,
} from './../../../../utilities/Theme';
import {isIphoneSe} from './../../../../utilities/Screen';
import {baseServerUri} from './../../../../common/appConstants';
import i18n from '../../../../common/i18n';
import moment from 'moment';
import {FootModal} from "../../../../common/components/FootModal";
import {Text} from "@balletworkout/components";
import WheelPicker from "../../../../common/components/WheelPicker";
import {FootModalNoAnimating} from "../../../../common/components/FootModalNoAnimating";

const VIEW_CALLBACK_ENUMS = {
    SAVE_AND_START_GOAL_FORM_ENUM: 'goalsform/add',
    CANCEL_AND_PROCEED: 'goalsform/proceed',
    CANCEL_ONLY: 'goalsform/cancel',
};

const HOURS = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
const MINUTES = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];

interface Props {
    subCategory: any;
    callbackHandler: Function;
    isVisible: false;
    onCancel: Function;
}

interface State {
    goalsData: any
    hourIndex: number,
    minuteIndex: number,
}

export default class GoalModal extends Component<Props, State> {

    state = {
        iosNotificationTime: new Date(),
        hour: '00',
        minute: '00',
        hourIndex: 0,
        minuteIndex: 0,
        goalsData: {
            goal_id: 0,
            name: '',
            duration: 0,
            times_performed: 0,
            goal_image: '',
            notification_time: 'Set Time',
            notification_on: true,
            is_finished: 0,
            notification_frequency: 'day',
            notifId: 0,
            description: '',
        },
    };

    constructor(props: any) {
        super(props);
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    setValueForInput = (key: string, value: any) => {
        let goalsData = this.state.goalsData;
        goalsData[key] = value;
        this.setState({goalsData});
    }

    componentWillMount() {
        const {subCategory} = this.props;
        const _hour = moment(new Date()).format('HH');
        const _minute = moment(new Date()).format('mm');
        const hourIndex = HOURS.findIndex(item => item === _hour);
        const minuteIndex = MINUTES.findIndex(item => item === _minute);
        if (hourIndex > 0) {
            this.setState({hourIndex});
        }
        if (minuteIndex > 0) {
            this.setState({minuteIndex});
        }
        if (typeof subCategory.type === 'undefined' || subCategory.type === 'GOAL') {
            let goalsData = this.state.goalsData;
            goalsData.goal_id = subCategory.id;
            goalsData.name = subCategory.name;
            goalsData.duration = subCategory.duration; // goal duration to complete in days
            goalsData.times_performed = 0;
            goalsData.notification_time = (new Date()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            goalsData.goal_image = baseServerUri + subCategory.banner_image_dir + subCategory.banner_image;
            goalsData.notification_on = true;
            goalsData.is_finished = 0;
            goalsData.notification_frequency = subCategory.notification_frequency;
            goalsData.description = subCategory.description;

            this.setState({goalsData});
        }
    }

    /**
     * Save Goal
     */
    _onSaveAndStartGoal() {
        let goalsData = this.state.goalsData;
        goalsData['notifId'] = Math.abs((new Date().getTime()) & 0xffffffff);
        this.setState({goalsData}, () => this.props.callbackHandler(VIEW_CALLBACK_ENUMS.SAVE_AND_START_GOAL_FORM_ENUM, this.state.goalsData));
    }

    /**
     * cancelling goal
     */
    _onCancelButton() {
        this.props.callbackHandler(VIEW_CALLBACK_ENUMS.CANCEL_ONLY);
    }

    /**
     * toggle notification switch
     * @param value
     */
    notificationToggle(value: any) {
        this.setValueForInput('notification_on', value);
    }

    /**
     * set date for processing
     * @param newDate
     */
    setDate(newDate: Date) {
        this.setState({iosNotificationTime: newDate});
        let newNotificationTime = moment(newDate).format('HH:mm') //newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        this.setValueForInput('notification_time', newNotificationTime);
    }

    /**
     * android time picker
     */
    async _openAndroidDatePicker() {
        let currentTime = new Date();
        try {
            const {action, hour, minute,} = await TimePickerAndroid.open({
                hour: currentTime.getHours(),
                minute: currentTime.getMinutes(),
                is24Hour: true,
                mode: 'spinner',
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                this.setValueForInput('notification_time', hour + ':' + minute);
            }
        } catch ({code, message}) {

        }
    }

    _onCancelModal() {
        this.props.onCancel(false);
    }

    render() {
        const {subCategory} = this.props;
        const {hour, minute, hourIndex, minuteIndex} = this.state;


        return (
            <FootModalNoAnimating
                visible={this.props.isVisible}
                title={i18n.t('exercises.start_goal_modal_title')}
                cancelCallBack={() => this._onCancelButton()}
            >
                <View style={styles.content}>
                    <Text style={styles.subTitleText}>"{subCategory.name}"</Text>
                    <Text style={styles.subTitleText2}>Choose when you would like to be reminded:</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{height: 250, width: 75}}>
                            <WheelPicker
                                ref={(sp) => {this.sp = sp}}

                                dataSource={HOURS}
                                selectedIndex={hourIndex}
                                itemHeight={75}
                                wrapperHeight={250}
                                wrapperColor={'#ffffff'}
                                highlightColor={'#d8d8d8'}
                                renderItem={(data, index, isSelected) => {
                                    return(
                                        <View>
                                            <Text style={{
                                                color: isSelected ? '#fff' : '#999',
                                                fontSize: isSelected ? 30 : 25
                                            }}>{data}</Text>
                                        </View>
                                    )
                                }}
                                onValueChange={(data, selectedIndex) => {
                                    this.setState({hour: data});
                                    this.setValueForInput('notification_time', data + ':' + minute);
                                }}
                            />
                        </View>
                        <Text style={{fontSize: 35, paddingHorizontal: 10, color: PRIMARY_COLOR_NEW}}>:</Text>
                        <View style={{height: 250, width: 75}}>
                            <WheelPicker
                                ref={(sp) => {this.sp = sp}}

                                dataSource={MINUTES}
                                selectedIndex={minuteIndex}
                                itemHeight={75}
                                wrapperHeight={250}
                                wrapperColor={'#ffffff'}
                                highlightColor={'#d8d8d8'}
                                renderItem={(data, index, isSelected) => {
                                    return(
                                        <View>
                                            <Text style={{
                                                color: isSelected ? '#fff' : '#999',
                                                fontSize: isSelected ? 30 : 25
                                            }}>{data}</Text>
                                        </View>
                                    )
                                }}
                                onValueChange={(data, selectedIndex) => {
                                    // console.log(data);
                                    this.setState({minute: data});
                                    this.setValueForInput('notification_time', hour + ':' + data);
                                }}
                            />
                        </View>
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.startButton}
                                          onPress={() => this._onSaveAndStartGoal()}>
                            <Text style={{color: '#fff', fontSize: 20}}>{i18n.t('exercises.save_and_start_goal_btn')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </FootModalNoAnimating>
        );
    }
}

const styles = StyleSheet.create({
    content: {

    },
    subTitleText: {
        fontSize: isIphoneSe ? 24 : 25,
        color: PRIMARY_COLOR_NEW,
        textAlign: 'left',
        marginTop: 0,
    },
    subTitleText2: {
        fontSize: isIphoneSe ? 12 : 14,
        color: SECONDARY_COLOR_NEW,
        textAlign: 'left',
        marginTop: 0,
    },
    modalButtons: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButton: {
        width: '70%',
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: PRIMARY_COLOR_NEW,
    },
});
export {VIEW_CALLBACK_ENUMS as GOAL_FORM_ENUM};
