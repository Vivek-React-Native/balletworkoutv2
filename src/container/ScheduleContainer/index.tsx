import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import fetchSchedule, {fetchClassRegistration} from './actions';
import Schedule from './../../stories/screens/Schedule';
import AppHeaderNewTheme from './../../common/components/AppHeader/AppHeaderNewTheme';
import NoConnection from '../../common/components/NoConnection';

interface Props {
  navigation: any;
  screenProps: any;
  schedule: any;
  fetchSchedules: Function;
  registrations: any;
  fetchClassRegistration: Function;
  registrationDetails: any;
}
interface State {
  schedule: any;
  registrations: any;
  registrationDetails: any;
}

export class ScheduleContainer extends Component<Props, State> {
  unSubscribeStore: Function;

  state = {
    schedule: this.props.schedule,
    registrations: this.props.registrations,
    registrationDetails: this.props.registrationDetails,
  };

  componentWillMount() {
    const {
      screenProps: {store},
      fetchSchedules,
      fetchClassRegistration,
      schedule,
      registrations,
    } = this.props;
    fetchSchedules();
    fetchClassRegistration();

    this.setState({schedule, registrations});

    this.unSubscribeStore = store.subscribe(() => {
      let schedule = store.getState().schedule.schedule;
      let registrations = store.getState().schedule.registrations;
      let registrationDetails = store.getState().schedule.registrationDetails;

      this.setState({schedule, registrations, registrationDetails});
    });
  }

  componentWillUnmount() {
    this.unSubscribeStore();
  }

  render() {
    const {
      screenProps: {store},
    } = this.props;

    return (
      <View style={styles.container}>
        {this.props.screenProps.isConnectedToNetwork ? null : <NoConnection />}
        <AppHeaderNewTheme
          hasTabs={true}
          navigation={this.props.navigation}
          hasBackgroundColor={false}
        />
        <Schedule
          store={store}
          schedule={this.state.schedule}
          registrations={this.state.registrations}
          registrationDetails={this.state.registrationDetails}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

const mapStateToProps = (state: any) => {
  const {schedule} = state;

  return schedule;
};

const mapDispatchToProps = (dispatch: Function) => {
  return {
    fetchSchedules: () => dispatch(fetchSchedule()),
    fetchClassRegistration: () => dispatch(fetchClassRegistration()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScheduleContainer);
