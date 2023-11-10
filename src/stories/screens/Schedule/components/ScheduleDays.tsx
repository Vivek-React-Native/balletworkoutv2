import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, Linking} from 'react-native';
import {Tab, Tabs, TabHeading} from 'native-base';
import ScheduleTime from './ScheduleTime';
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  HEIGHT,
} from './../../../../utilities/Theme';
import i18n from '../../../../common/i18n';
import ScheduleTimeAll from './ScheduleTimeAll';

interface Props {
  days: any;
  registrations: any;
  registerClass: Function;
  registrationDetails: any;
}
interface State {
  currentTab: number;
}
export default class ScheduleDays extends Component<Props, State> {
  state = {
    currentTab: 0,
  };

  renderTabHeading(title: string, index: number) {
    return (
      <TabHeading
        style={
          this.state.currentTab === index
            ? styles.activeTabHeading
            : styles.tabHeading
        }>
        <Text style={styles.tabTitle}>{title.substring(0, 3)}</Text>
      </TabHeading>
    );
  }

  renderDaysTab(day: any, index: number) {
    const {days, registrations, registrationDetails} = this.props;

    let date = day.match(/\[(.*?)\]/);

    return (
      <Tab locked={false} key={day} heading={this.renderTabHeading(day, index)}>
        <ScrollView>
          <View style={styles.allTabTextHeadingWrapper}>
            <Text style={styles.allTabTextHeading}>
              {date != null && typeof date[1] != 'undefined' ? date[1] : ''}
            </Text>
          </View>
          <View>
            <ScheduleTime
              scheduleTime={days[day]}
              day={day}
              registrations={registrations}
              registrationDetails={registrationDetails}
              registerClass={this.props.registerClass.bind(this)}
            />
          </View>
        </ScrollView>
      </Tab>
    );
  }

  renderTimeAllTab(day: any) {
    const {days, registrations, registrationDetails} = this.props;
    var hasValue = false;
    const dayObje = days[day];
    Object.keys(days[day]).map((timeKey, index) =>
      dayObje[timeKey] != ''
        ? (hasValue = true)
        : hasValue === true
        ? (hasValue = true)
        : (hasValue = false),
    );
    return (
      <View key={`all-` + day} style={styles.allTabTimeWrapper}>
        {hasValue && (
          <View style={styles.allTabTextHeadingWrapper}>
            <Text style={styles.allTabTextHeading}>
              {day.replace(/(\[|\])/g, '')}
            </Text>
          </View>
        )}
        <View>
          <ScheduleTimeAll
            scheduleTime={days[day]}
            day={day}
            registrations={registrations}
            registrationDetails={registrationDetails}
            registerClass={this.props.registerClass.bind(this)}
          />
        </View>
      </View>
    );
  }
  render() {
    const {days, registrations} = this.props;
    return (
      <View style={styles.container}>
        {typeof days != 'undefined' ? (
          //   <Tabs
          //     tabBarUnderlineStyle={styles.dayTabsUnderline}
          //     onChangeTab={({i}) => this.setState({currentTab: i})}>
          //     {Object.keys(days).map((day: any, index: number) =>
          //       this.renderDaysTab(day, index),
          //     )}
          //     <Tab
          //       locked={false}
          //       heading={this.renderTabHeading(
          //         i18n.t('schedule.overview_tab'),
          //         Object.keys(days).length,
          //       )}>
          //       <ScrollView>
          //         {Object.keys(days).map((day: any, index: number) =>
          //           this.renderTimeAllTab(day),
          //         )}
          //       </ScrollView>
          //     </Tab>
          //   </Tabs>
          <ScrollView>
            {Object.keys(days).map((day: any, index: number) =>
              this.renderTimeAllTab(day),
            )}
          </ScrollView>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dayTabsUnderline: {
    borderBottomColor: SECONDARY_COLOR,
    borderBottomWidth: 0,
    opacity: 0,
  },
  tabHeading: {
    backgroundColor: PRIMARY_COLOR,
  },
  activeTabHeading: {
    backgroundColor: SECONDARY_COLOR,
  },
  tabTitle: {
    color: '#ffffff',
  },
  dayTab: {
    flex: 1,
  },
  allTabTimeWrapper: {
    flex: 1,
  },
  allTabTextHeading: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#032426',
    fontSize: 16,
  },
  allTabTextHeadingWrapper: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    paddingTop: 10,
    //marginTop: 15,
    //backgroundColor: SECONDARY_COLOR,
  },
});
