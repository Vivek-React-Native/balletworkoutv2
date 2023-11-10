import React, {Component} from 'react';
import {View, Text, StyleSheet, Alert, Linking} from 'react-native';
import ScheduleDays from './components/ScheduleDays';
import Loader from '../../../common/components/Loader';
import {
  deRegisterToclass,
  registerToclass,
} from './../../../container/ScheduleContainer/actions';
import i18n from '../../../common/i18n';
import {
  HEIGHT,
  PRIMARY_COLOR_NEW,
  SECONDARY_COLOR,
} from '../../../utilities/Theme';
import {isIphoneSe} from '../../../utilities/Screen';
import {AppEventsLogger} from 'react-native-fbsdk';

interface Props {
  navigation: any;
  schedule: any;
  store: any;
  registrations: any;
  registrationDetails: any;
}
interface State {
  isLoading: boolean;
  schedule: any;
}

export default class Schedule extends Component<Props, State> {
  unSubscribeStore: Function;
  registrationErrorShown: boolean = false;

  state = {
    isLoading: false,
    schedule: [],
  };

  componentDidMount() {
    this.mounted = true;
    const {store} = this.props;
    AppEventsLogger.logEvent('View content', {
      'Content ID': 'Schedule',
      'Content Type': 'Schedule',
    });
    let isLoading = store.getState().schedule.isLoading;

    let schedule = store.getState().schedule;
    this.setState({isLoading, schedule});

    this.unSubscribeStore = store.subscribe(() => {
      let isLoading = store.getState().schedule.isLoading;

      let schedule = store.getState().schedule;

      this.setState({isLoading, schedule});

      let registrationError = store.getState().schedule.registrationError;

      if (registrationError != null && !this.registrationErrorShown) {
        // console.log('executed');
        this.registrationErrorShown = true;
        Alert.alert(registrationError.message);
      }
    });
  }

  componentWillUnmount() {
    this.unSubscribeStore();
  }

  handleLink(link: string) {
    Linking.openURL(link).catch(console.warn);
  }

  registerClass(classId: string, isRegistered: boolean) {
    if (!isRegistered) {
      Alert.alert(
        i18n.t('schedule.register_title'),
        i18n.t('schedule.register_confirm') + '?',
        [
          {text: 'OK', onPress: () => this.register(classId, isRegistered)},
          {text: i18n.t('settings.cancel'), style: 'cancel'},
        ],
      );
    } else {
      Alert.alert(
        i18n.t('schedule.deregister_title'),
        i18n.t('schedule.deregister_confirm') + '?',
        [
          {text: 'OK', onPress: () => this.register(classId, isRegistered)},
          {text: i18n.t('settings.cancel'), style: 'cancel'},
        ],
      );
    }
  }

  register(classId: string, isRegistered: boolean) {
    const {store} = this.props;
    this.registrationErrorShown = false;
    if (!isRegistered) store.dispatch(registerToclass(classId));
    else store.dispatch(deRegisterToclass(classId));
  }

  render() {
    const {schedule, registrations, registrationDetails} = this.props;
    return (
      <View style={styles.container}>
        {!this.state.isLoading || <Loader />}
        <Text style={styles.textBold}>{i18n.t('settings.class_schedule')}</Text>
        <Text style={styles.textSubtitle}>
          {i18n.t('settings.class_schedule_sub_title')}
        </Text>
        <ScheduleDays
          days={schedule}
          registrations={registrations}
          registrationDetails={registrationDetails}
          registerClass={this.registerClass.bind(this)}
        />
        <View style={styles.addressWrapper}>
          {/* <Text style={styles.registrationInfo}>To join the classes please register through <Text style={{ textDecorationLine: 'underline' }} onPress={() => this.handleLink('mailto:info@balletworkout.be')}>info@balletworkout.be</Text></Text> */}
          <Text style={styles.addressHeader}>
            {i18n.t('schedule.location')}
          </Text>

          <Text style={styles.addressText}>
            Sint-Andriesplaats 24, 2000 Antwerpen
          </Text>
          {/* <Text
            style={styles.addressLinkText}
            onPress={() => this.handleLink('https://www.balletworkout.be/')}>
            www.balletworkout.be
          </Text> */}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textBold: {
    textAlign: 'left',
    paddingHorizontal: '5%',
    fontSize: 35,
    color: '#032426',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textSubtitle: {
    textAlign: 'left',
    paddingHorizontal: '5%',
    fontSize: 20,
    color: '#032426',
    marginBottom: 15,
  },
  addressWrapper: {
    flex: 0,
    //height: HEIGHT * 0.12,
    alignSelf: 'stretch',
    backgroundColor: '#D2959F',
    paddingBottom: 30,
    paddingTop: 15,
    // shadowColor: PRIMARY_COLOR,
    // shadowOpacity: 0.2,
    // borderTopRightRadius: 10,
    // borderTopLeftRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  addressText: {
    color: '#F2E6E6',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    fontSize: isIphoneSe ? 14 : 17,
    paddingTop: 5,
  },
  addressHeader: {
    color: '#F2E6E6',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    fontSize: isIphoneSe ? 20 : 25,
    fontWeight: 'bold',
  },
  registrationInfo: {
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    fontSize: isIphoneSe ? 14 : 17,
    marginBottom: isIphoneSe ? 6 : 10,
  },
  addressLinkText: {
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    //textAlign: 'center',
    fontSize: 15,
    marginTop: isIphoneSe ? 6 : 10,
  },
});
