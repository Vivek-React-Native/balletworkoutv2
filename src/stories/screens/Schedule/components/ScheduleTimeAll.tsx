import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {List, ListItem, Left, Body, Right} from 'native-base';
import timelineImage from './../../../../assets/images/schedule_timeline.png';
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  PRIMARY_COLOR_NEW,
} from '../../../../utilities/Theme';
import {findArray} from '../../../../utilities/Functions';
import Icon from 'react-native-vector-icons/Ionicons';
import i18n from '../../../../common/i18n';
import {exportedStore} from '../../../../store';

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
export default class ScheduleTimeAll extends Component<Props, State> {
  unSubscribeStore: Function;
  mounted: boolean = true;
  state = {
    availableSpots: 0,
    spotsVisible: false,
    selected: false,
    selectedIndex: -1,
  };

  componentDidMount() {
    let state = exportedStore.getState();
    let {availableSpots, spotsVisible} = state.schedule;
    if (this.mounted) {
      this.setState({availableSpots, spotsVisible});
    }

    this.unSubscribeStore = exportedStore.subscribe(() => {
      let state = exportedStore.getState();
      let {availableSpots, spotsVisible} = state.schedule;
      if (this.mounted) {
        this.setState({availableSpots, spotsVisible});
      }
    });
  }

  setSelected(selected: boolean, index: Number) {
    this.setState({selected: selected});
    if (selected === true) {
      this.setState({selectedIndex: index});
    } else {
      this.setState({selectedIndex: -1});
    }
  }
  renderScheduleTime(time: string, daySchedule: any, index: any) {
    if (daySchedule[time] === '') {
      return null;
    }
    let timings = time.split('-');
    let timeStart = timings[0];
    let timeEnd = timings[1];

    let classId = this.props.day + ':' + daySchedule[time];
    const {registrations, registrationDetails} = this.props;
    let scheduleRegistration =
      typeof registrations != 'undefined'
        ? findArray(registrations, {class_id: classId}).length > 0
        : false;
    let fullRegistration =
      typeof registrationDetails != 'undefined' &&
      typeof registrationDetails[classId] != 'undefined'
        ? registrationDetails[classId][0].is_full
        : false;
    let regRemaining =
      typeof registrationDetails != 'undefined' &&
      typeof registrationDetails[classId] != 'undefined'
        ? registrationDetails[classId][0].remaining
        : this.state.availableSpots;
    return (
      //   <ListItem
      //     button
      //     key={time}
      //     style={styles.timeListItem}
      //     onPress={() =>
      //       scheduleRegistration || this.props.registerClass(classId)
      //     }>
      //     <Left style={styles.timeLeft}>
      //       <Image style={styles.timelineImage} source={timelineImage} />
      //       <Text style={styles.scheduleTimeText}>{timeStart}</Text>
      //       <Text style={styles.scheduleTimeText}>{timeEnd}</Text>
      //     </Left>
      //     <Body
      //       style={[
      //         styles.timeBody,
      //         !this.state.spotsVisible ? {justifyContent: 'center'} : null,
      //       ]}>
      //       <View style={styles.timeBodyChildren}>
      //         {!fullRegistration || (
      //           <Icon
      //             style={styles.registrationCheckMark}
      //             name="alert-circle-outline"
      //             color={SECONDARY_COLOR}
      //           />
      //         )}
      //         <Text style={styles.timeBodyText}>{daySchedule[time]} </Text>
      //       </View>
      //       {!this.state.spotsVisible || (
      //         <View style={styles.timeBodyChildren}>
      //           <Text style={styles.timeRightText}>
      //             {i18n.t('schedule.available_spots_text')}: {regRemaining}
      //           </Text>
      //         </View>
      //       )}
      //     </Body>
      //     <Right style={styles.timeRight}>
      //       {!scheduleRegistration || (
      //         <Icon
      //           style={styles.registrationCheckMark}
      //           name="ios-checkmark-circle"
      //           color={SECONDARY_COLOR}
      //         />
      //       )}
      //     </Right>
      //   </ListItem>

      <TouchableWithoutFeedback
        onPress={() =>
          scheduleRegistration || this.props.registerClass(classId)
        }>
        {/* // onPressIn={() => this.setSelected(true, index)}
        // onPressOut={() => this.setSelected(false, index)}> */}
        <View
          style={[
            styles.imageRowContainer,
            {
              backgroundColor: scheduleRegistration
                ? PRIMARY_COLOR_NEW
                : '#F7F7F7',
            },
          ]}>
          <View style={styles.timeContent}>
            <Text style={[styles.timeText,{color:'#D2959F'}]} font={'SemiBold'}>
              {timeStart}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.buttonText,
                {
                  color: scheduleRegistration ? '#F2E6E6' : '#032426',
                },
              ]}
              font={'SemiBold'}>
              {daySchedule[time]}
            </Text>
            <View style={[styles.tagContainer,{backgroundColor: scheduleRegistration?'#81CC6F':'#F2E6E6'}]}>
              {/* <View style={styles.tagContent}>
              <Image
                style={styles.starIcon}
                resizeMode={'contain'}
                source={starIcon}
              />
              <Text style={[styles.tagText]} font={'SemiBold'}>
                4.8
              </Text>
            </View> */}
              <View style={styles.tagContent}>
                <Text style={[styles.tagText, {color: scheduleRegistration?'#fff':'#032426'}]} font={'SemiBold'}>
                  {/* {i18n.t('schedule.available_spots_text')}: {regRemaining} */}
                  {scheduleRegistration
                    ? `${i18n.t('schedule.SignedUp')}`
                    : `${i18n.t(
                        'schedule.available_spots_text',
                      )}: ${regRemaining}`}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unSubscribeStore();
  }

  render() {
    const {scheduleTime, day} = this.props;
    return (
      <View style={styles.container}>
        <List>
          {typeof scheduleTime !== 'undefined'
            ? Object.keys(scheduleTime).map((timeKey, index) =>
                this.renderScheduleTime(timeKey, scheduleTime, index),
              )
            : null}
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //   },
  //   timeListItem: {
  //     height: 100,
  //     marginLeft: 0,
  //     paddingBottom: 10,
  //     paddingTop: 10,
  //     paddingLeft: 15,
  //     paddingRight: 15,
  //     borderBottomColor: '#eeeeee',
  //     borderBottomWidth: 2,
  //   },
  //   timeBody: {
  //     flex: 3.5,
  //     alignSelf: 'stretch',
  //     justifyContent: 'space-between',
  //     flexDirection: 'column',
  //     alignItems: 'flex-start',
  //   },
  //   timeBodyChildren: {
  //     flexDirection: 'column',
  //   },
  //   timeLeft: {
  //     flex: 1,
  //     alignSelf: 'stretch',
  //     flexDirection: 'column',
  //     justifyContent: 'space-between',
  //   },
  //   timeRight: {
  //     height: '100%',
  //     width: '100%',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     padding: 5,
  //   },
  //   timeRightText: {
  //     fontFamily: 'Montserrat-Medium',
  //     color: PRIMARY_COLOR,
  //     fontSize: 15,
  //   },
  //   timelineImage: {
  //     top: 0,
  //     left: 0,
  //     position: 'absolute',
  //     width: 11,
  //     height: 80,
  //     alignSelf: 'flex-start',
  //     resizeMode: 'contain',
  //   },
  //   scheduleTimeText: {
  //     marginLeft: 20,
  //     fontFamily: 'Montserrat-Medium',
  //     color: PRIMARY_COLOR,
  //     opacity: 0.8,
  //   },
  //   timeBodyText: {
  //     fontFamily: 'Montserrat-SemiBold',
  //     color: PRIMARY_COLOR,
  //     fontSize: 15,
  //   },
  //   registrationCheckMark: {
  //     fontSize: 25,
  //   },
  imageRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 10,
    //marginBottom: 5,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#032426',
    fontWeight: 'bold',
  },
  tagContainer: {
    alignItems: 'center',
    marginTop: 5,
    borderRadius: 100
  },
  tagContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 12,
    justifyContent: 'center',
    alignSelf: 'center',
    fontFamily: 'poppins-regular',
    fontWeight: '500'
  },
  timeContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F2E6E6',
  },
  timeText: {
    fontSize: 18,
    color: PRIMARY_COLOR_NEW,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 2,
  },
});
