import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Platform,
  PushNotificationIOS,
  NetInfo,
  Alert,
} from 'react-native';
import {Content, Container, Button} from 'native-base';
import {Viewport} from '@skele/components';
import Exercise from './components/Exercise';
import {PADDING_LEFT_RIGHT, WIDTH} from './../../../utilities/Theme';
import {baseServerUri} from './../../../common/appConstants';
import GoalModal, {GOAL_FORM_ENUM} from './components/GoalModal';
import {findArray, fromToTimezone, isDatePast} from './../../../utilities/Functions';
// import { store } from './../../../store';
import PushNotificationService from '../../../common/tools/PushNotificationService';
import i18n from '../../../common/i18n';
import Loader from '../../../common/components/Loader';
import moment from 'moment';
import {AppEventsLogger} from 'react-native-fbsdk';
import GoalTag from './components/GoalTag';
import {Text} from '@balletworkout/components';
import ReviewInfo from './components/ReviewInfo';
import exImage from '@balletworkout/assets/images/goal-detail-example.png';
import ScrollableVideoHeader from '../../../common/components/ScrollableVideoHeader';
import InAppPurchaseModalNew from '../../../common/components/InAppPurchaseModalNew';
import ScrollabeHeader from '../../../common/components/ScrollabeHeader';
import {VideoModal} from '../../../common/components/VideoModal';
import GiftModel from '../../../common/components/GiftModel';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-community/async-storage';
import { AFLogEvent } from '../../../utilities/AppsFlyer';

// list of all possible enums in child
const VIEW_CALLBACK_ENUMS = {
  ...GOAL_FORM_ENUM,
  GOAL_NOTIFICATION_CANCELED: 'goalnotification/canceled',
};

interface Props {
  exercises: any;
  subCategory: any;
  navigation: any;
  subCategoryType: string;
  callbackHandler: Function;
  notifService: PushNotificationService;
  store: any;
  category: any;
  connection: any;
}

interface State {
  isGoalModalVisible: boolean;
  goalAlreadyStarted: any;
  goalsStarted: any;
  showVideos: boolean;
  isLoading: boolean;
  purchaseExpired: boolean;
  videoPaused: boolean;
  videoModelVisibility: boolean;
  iapModelVisibility: boolean;
  selectedVideoIndex: number;
  playAll: boolean;
  modalVisible: boolean
}

export default class Exercises extends Component<Props, State> {
  state = {
    isGoalModalVisible: false,
    goalAlreadyStarted: 'no',
    goalsStarted: [],
    showVideos: true,
    isLoading: false,
    videoPaused: false,
    purchaseExpired: true,
    videoModelVisibility: false,
    iapModelVisibility: false,
    selectedVideoIndex: 1,
    playAll: false,
    modalVisible: false
  };

  isUnmounted: boolean;

  /**
   * @var PushNotificationService
   */
  notifService = this.props.notifService;

  /**
   * store subscription
   */
  unSubscribeStore: any;

  /**
   * When Component will mount
   */
  componentDidMount() {
    const {store, navigation, exercises} = this.props;
    const subCategory = navigation.getParam('subCategory');
    AppEventsLogger.logEvent('View content', {
      'Content ID': subCategory.name,
      'Content Type': 'Exercise Video List',
    });

    let goalsStarted = store.getState().goals.goalsStarted;

    this.isUnmounted = false;

    let isLoading = store.getState().exercises.isLoading;

    this.setState({isLoading});
    this.setState({goalsStarted: goalsStarted}, this.initialization.bind(this));
    this.setState({videoPaused: false});
    this.unSubscribeStore = store.subscribe(() => {
      if (!this.isUnmounted) {
        let isLoading = store.getState().exercises.isLoading;

        // console.log('inside store subscribe', isLoading);

        this.setState({isLoading});
        let goalsStarted = store.getState().goals.goalsStarted;
        this.setState(
          {goalsStarted: goalsStarted},
          this.initialization.bind(this),
        );
        this._clearNotifications();

        let purchaseExpiry = store.getState().auth.userData
          ? store.getState().auth.userData.purchase_validity_expiry
          : 0;

        let purchaseExpired = purchaseExpiry - Date.now() <= 0;
        // console.log('Purchase status:', purchaseExpiry, purchaseExpired);
        this.setState({purchaseExpired});
      }
    });
  }

  _showVideos() {
    this.setState({showVideos: !this.state.showVideos});
    this.setState({videoPaused: true});
  }

  /**
   * initialization of goals started state
   * and determination of goal started
   */
  initialization() {
    let subCategory = this.props.navigation.getParam('subCategory');
    let goalExists = findArray(this.state.goalsStarted, {
      goal_id: subCategory.id,
      is_finished: 0,
    });
    if (goalExists.length > 0) {
      this.setState({goalAlreadyStarted: 1});
    } else {
      this.setState({goalAlreadyStarted: 'no'});
    }
  }

  showVideo(data: any, index: number) {
    this.setState({playAll: false});
    this.setState({selectedVideoIndex: index});
    this.setState({videoModelVisibility: true});
  }

  /**
   * Render an single exercise
   * @param exercise
   */
  renderExercise(
    exercise: any,
    purchaseExpired: boolean,
    subCategoryType: string,
    index: number,
  ) {
    const {navigation} = this.props;
    let subCategory = this.props.navigation.getParam('subCategory');
    return (
      <Exercise
        purchaseExpired={purchaseExpired}
        show={this.state.showVideos}
        setShowVideos={this._showVideos.bind(this)}
        showVideo={(data: any) => this.showVideo(data, index)}
        setIapModelVisibility={this.setIapModelVisibility.bind(this)}
        key={exercise.id}
        navigation={navigation}
        exercise={exercise}
        source={{uri: baseServerUri + exercise.video_dir + exercise.video_file}}
        title={exercise.title}
        subCategory={subCategory}
        subCategoryType={subCategoryType}
        connection={this.props.connection}
      />
    );
  }

  /**
   * View callback handler
   */
  viewCallbackHandler = (type: string, data: any) => {
    const {exercises, subCategoryType} = this.props;
    switch (type) {
      case VIEW_CALLBACK_ENUMS.SAVE_AND_START_GOAL_FORM_ENUM:
        this._setGoalModalVisibility(false);
        this._initializeNotification(data);
        this.props.callbackHandler(type, data);
        setTimeout(() => {
          // this._goToExerciseWithMultipleExercise(exercises, subCategoryType);
        }, 1000);
        break;
      case VIEW_CALLBACK_ENUMS.CANCEL_AND_PROCEED:
        this._setGoalModalVisibility(false);
        this._goToExerciseWithMultipleExercise(exercises, subCategoryType);
        break;
      case VIEW_CALLBACK_ENUMS.GOAL_NOTIFICATION_CANCELED:
        this.props.callbackHandler(type, data);
        break;
      case VIEW_CALLBACK_ENUMS.CANCEL_ONLY:
        this.setState({isGoalModalVisible: false});
        break;
      default:
        return;
    }
  };

  /**
   * on press start dancing button
   */
  _onPressStartButton(playAll = false) {
    const {exercises, subCategoryType} = this.props;
    // console.log(exercises, subCategoryType);
    if (subCategoryType === 'GOAL' && this.state.goalAlreadyStarted === 'no') {
      this._setGoalModalVisibility(true);
    } else {
      this._goToExerciseWithMultipleExercise(exercises, subCategoryType);
    }
  }

  /**
   * Create notification
   * @param goal
   */
  private _initializeNotification(goal: any) {
    if (goal.notification_on) {
      // if notification is set to ON by user

      let time = goal.notification_time.split(':');
      let frequencyType =
        goal.notification_frequency === 'day' ||
        goal.notification_frequency === 'week'
          ? goal.notification_frequency
          : 'time';
      let repeatTime =
        goal.notification_frequency === 'day' ||
        goal.notification_frequency === 'week'
          ? null
          : parseInt(goal.notification_frequency) * (1000 * 60 * 60 * 24); // 1 day multiplied by goal type days

      let notifTime: Date = new Date();
      notifTime.setHours(time[0], time[1], 0);

      let currentTime = new Date();
      currentTime.setHours(currentTime.getHours(), currentTime.getMinutes(), 0);

      if (currentTime.toString() === notifTime.toString()) {
        if (
          goal.notification_frequency === 'day' ||
          goal.notification_frequency === 'week'
        ) {
          notifTime = moment()
            .add(goal.notification_frequency, 1)
            .toDate();
          notifTime.setHours(time[0], time[1], 0);
        } else {
          notifTime = new Date(
            Date.now() +
              parseInt(goal.notification_frequency) * (1000 * 60 * 60 * 24),
          );
          notifTime.setHours(time[0], time[1], 0);
        }
      }

      let notifData = {
        id: goal.notifId,
        notifTime: notifTime,
        title: i18n.t('common.goal_reminder_notif_title'),
        message: goal.name,
        type: frequencyType,
        time: repeatTime,
        data: goal,
        notifType: 'GOAL REMINDER',
      };

      this.notifService.goalNotif(notifData);
    }
  }

  /**
   * Clear already created goal notification
   * @param id
   */
  _clearNotifications() {
    const {store} = this.props;
    if (Platform.OS === 'android') {
      // if device is android

      let goalsStarted = store.getState().goals.goalsStarted;

      // loop through all goals to find out finished goals and notification is still ON to remove notification.
      goalsStarted.map((goal: any, index: number) => {
        if (goal.is_finished === 1 && goal.notification_on === true) {
          this.notifService.cancelNotif(goal.notifId);
          this.viewCallbackHandler(
            VIEW_CALLBACK_ENUMS.GOAL_NOTIFICATION_CANCELED,
            goal.notifId,
          );
        }
      });
    } else {
      // if device is iOS

      this.notifService.cancelAll(); // first cancel all

      let goalsStarted = store.getState().goals.goalsStarted;

      // now loop through goals and set notification OFF for finished goals and reinitialize pending goals
      goalsStarted.map((goal: any, index: number) => {
        if (goal.is_finished === 1 && goal.notification_on === true) {
          // if finished but notification status is still ON then turn it OFF
          this.viewCallbackHandler(
            VIEW_CALLBACK_ENUMS.GOAL_NOTIFICATION_CANCELED,
            goal.notifId,
          );
        } else if (goal.is_finished === 0 && goal.notification_on === true) {
          // if notification status is on and goal not finished then intialize notification
          this._initializeNotification(goal);
        }
      });
    }
  }

  /**
   * Navigation to exercise screen with multiple exercises
   * @param data
   * @param subCategoryType
   */
  _goToExerciseWithMultipleExercise(data: any, subCategoryType: string) {
    this.setState({playAll: true});
    this.setState({selectedVideoIndex: 0});
    this.setState({videoModelVisibility: true});
    // this.props.navigation.navigate('exercise', {
    //     type: 'MULTIPLE_EXERCISES',
    //     categoryType: subCategoryType,
    //     subCategory: this.props.navigation.getParam('subCategory'),
    //     data: data,
    // });
  }

  /**
   * set visibility of Goal modal
   * @param value
   */
  _setGoalModalVisibility(value: boolean) {
    this.setState({isGoalModalVisible: value});
  }

  /**
   * on cancel starting goal
   * @param value
   */
  _onModalCancel(value: boolean) {
    const {exercises, subCategoryType} = this.props;
    this.setState({isGoalModalVisible: value});
    this._goToExerciseWithMultipleExercise(exercises, subCategoryType);
  }

  setIapModelVisibility(iapModelVisibility: boolean) {
    this.setState({iapModelVisibility});
  }

  modelOpen = async (bool:any) => {
    const setdata = await AsyncStorage.getItem('openModel')
    const videoData = await AsyncStorage.getItem('videoSeen')
    const {store} = this.props;
    const { email, first_name } = store.getState().auth.userData

    if(videoData == 'true'){
      setTimeout(()=>  this.setState({ modalVisible: bool }), 300)
     
      await AsyncStorage.setItem('videoSeen', 'false')
      return 
    }

    if(setdata == null){
      const result = await AFLogEvent('Promo Masthead', {email: email,firstName: first_name});
      console.log('AppsFlyer Promo Masthead result.......', result);
      this.setState({ modalVisible: bool })
      await AsyncStorage.setItem('openModel', 'true')
    }
    
  }

  /**
   * render
   */
  render() {
    const {selectedVideoIndex, videoModelVisibility, playAll} = this.state;
    const {exercises, subCategoryType, navigation, store} = this.props;
    const subCategory = navigation.getParam('subCategory');
    const {
      banner_image_dir,
      banner_image,
      image_prefix,
      access_type,
    } = subCategory;
    const _image = subCategory['goal_image']
      ? {uri: subCategory['goal_image']}
      : subCategory['banner_image']
      ? {uri: baseServerUri + banner_image_dir + image_prefix + banner_image}
      : exImage;

    let trialExpiry: any =
    store.getState().auth.userData &&
      typeof store.getState().auth.userData.created_on !== 'undefined'
        ? fromToTimezone(
            store.getState().auth.userData.created_on,
            'UTC',
            RNLocalize.getTimeZone(),
          )
            .add('3', 'days')
            .format('Y-MM-DD HH:mm:ss')
        : null;
     const EnableGiftBanner = this.state.purchaseExpired === true && isDatePast(trialExpiry)

    if (subCategoryType == 'GOAL') {
      return (
        <ScrollabeHeader
          // navigation={()=> this.props.navigation.navigate('category',{category: this.props.category})}
          navigation={() => this.props.category ? navigation.navigate('categories', {category: this.props.category}) : navigation.goBack()}
          image={_image}
          title={subCategory['name']}
          middleTitle={
            subCategoryType === 'GOAL' && this.state.goalAlreadyStarted === 'no'
              ? 'Add this goal'
              : i18n.t('exercises.start_dancing_button').toUpperCase()
          }
          hideMiddle={false}
          onMiddleHandler={() => {
            if (!this.state.purchaseExpired) {
              if (
                subCategoryType === 'GOAL' &&
                this.state.goalAlreadyStarted === 'no'
              ) {
                this._setGoalModalVisibility(true);
              } else {
                this.setState({playAll: true});
                this.setState({selectedVideoIndex: 0});
                this.setState({videoModelVisibility: true});
              }
            } else {
              this.setIapModelVisibility(true);
            }
          }}
          loading={this.state.isLoading}>

          {this.state.purchaseExpired ? 
            (<GiftModel
              onCancel={() => this.setState({ modalVisible: false })}
              visibility={this.state.modalVisible}
              store={store}
            />): null
          }

          <GoalModal
            isVisible={this.state.isGoalModalVisible}
            callbackHandler={this.viewCallbackHandler}
            subCategory={subCategory}
            onCancel={this._onModalCancel.bind(this)}
          />
          <View style={styles.viewWrapper}>
            <ReviewInfo navigation={navigation} />
            <Text style={{textAlign: 'center'}} font={'Regular'}>
              {this.props.subCategory['description']}
            </Text>
            <GoalTag
              navigation={navigation}
              length={exercises != 'undefined' ? exercises.length : 0}
            />
            <Text style={{fontSize: 20, marginTop: 20}}>
              {i18n.t('goals.goal_exercise_view')}
            </Text>
            <View style={{backgroundColor: '#fff'}}>
              {typeof exercises != 'undefined' && exercises.length > 0
                ? exercises.map((exercise: any, index: number) => {
                    return this.renderExercise(
                      exercise,
                      this.state.purchaseExpired && access_type != 'FREE',
                      subCategoryType,
                      index,
                    );
                  })
                : null}
            </View>
          </View>
          <VideoModal
            connection={this.props.connection}
            visible={videoModelVisibility}
            playAll={playAll}
            category={subCategory}
            exercises={
              typeof exercises != 'undefined' && exercises.length > 1
                ? exercises
                : []
            }
            playIndex={selectedVideoIndex}
            cancelCallBack={() => {
              this.modelOpen(true);
              this.setState({videoModelVisibility: false});
            }}
            onGoNextVideo={() => {
              if (
                typeof exercises != 'undefined' &&
                exercises.length > 1 &&
                selectedVideoIndex < exercises.length - 1
              ) {
                this.setState({selectedVideoIndex: selectedVideoIndex + 1});
              }
            }}
            store={this.props.store}
            onGoPreviousVideo={() => {
              if (
                typeof exercises != 'undefined' &&
                exercises.length > 1 &&
                selectedVideoIndex > 0
              ) {
                this.setState({selectedVideoIndex: selectedVideoIndex - 1});
              }
            }}
          />
          <InAppPurchaseModalNew
            onCancel={() =>  {
              this.modelOpen(true);
              this.setIapModelVisibility(false);
            }}
            visibility={this.state.iapModelVisibility}
            store={store}
          />

          
        </ScrollabeHeader>
      );
    } else {
      return (
        <ScrollableVideoHeader
          category={this.props.category}
          purchaseExpired={this.state.purchaseExpired && access_type != 'FREE'}
          setIapModelVisibility={this.setIapModelVisibility.bind(this)}
          navigation={navigation}
          image={_image}
          videoTitle={
            typeof exercises != 'undefined' && exercises.length > 1
              ? exercises[selectedVideoIndex].title
              : 'Unknown'
          }
          video={
            typeof exercises != 'undefined' && exercises.length > 1
              ? {
                  uri:
                    baseServerUri +
                    exercises[selectedVideoIndex].video_dir +
                    exercises[selectedVideoIndex].video_file,
                }
              : exImage
          }
          title={subCategory['name']}
          loading={this.state.isLoading}
          defaultVideo={
            typeof exercises != 'undefined' && exercises.length > 1
              ? {
                  uri:
                    baseServerUri +
                    exercises[1].video_dir +
                    exercises[1].video_file,
                }
              : exImage
          }
          middleTitle={
            subCategoryType === 'GOAL' && this.state.goalAlreadyStarted === 'no'
              ? 'Add this goal'
              : i18n.t('exercises.start_dancing_button').toUpperCase()
          }
          hideMiddle={false}
          onMiddleHandler={() => {
            this.setState({playAll: true});
            this.setState({selectedVideoIndex: 0});
            this.setState({videoModelVisibility: true});
          }}
          onGoNextVideo={() => {
            if (
              typeof exercises != 'undefined' &&
              exercises.length > 1 &&
              selectedVideoIndex < exercises.length - 1
            ) {
              this.setState({selectedVideoIndex: selectedVideoIndex + 1});
            }
          }}
          onGoPreviousVideo={() => {
            if (
              typeof exercises != 'undefined' &&
              exercises.length > 1 &&
              selectedVideoIndex > 0
            ) {
              this.setState({selectedVideoIndex: selectedVideoIndex - 1});
            }
          }}>

          { this.state.purchaseExpired ?
            (<GiftModel
              onCancel={() => this.setState({ modalVisible: false })}
              visibility={this.state.modalVisible}
              store={store}
            />): null
          }

          <GoalModal
            isVisible={this.state.isGoalModalVisible}
            callbackHandler={this.viewCallbackHandler}
            subCategory={subCategory}
            onCancel={this._onModalCancel.bind(this)}
          />
          <View style={styles.viewWrapper}>
            <ReviewInfo navigation={navigation} />
            <Text style={{textAlign: 'center'}} font={'Regular'}>
              {this.props.subCategory?.description}
            </Text>
            <GoalTag
              navigation={navigation}
              length={exercises != 'undefined' ? exercises.length : 0}
            />
            <Text style={{fontSize: 20, marginTop: 20}}>
              {i18n.t('goals.goal_exercise_view')}
            </Text>
            <View style={{backgroundColor: '#fff'}}>
              {typeof exercises != 'undefined' && exercises.length > 0
                ? exercises.map((exercise: any, index: number) => {
                    return this.renderExercise(
                      exercise,
                      this.state.purchaseExpired && access_type != 'FREE',
                      subCategoryType,
                      index,
                    );
                  })
                : null}
            </View>
          </View>
          <VideoModal
            connection={this.props.connection}
            visible={videoModelVisibility}
            playAll={playAll}
            category={subCategory}
            playAll
            exercises={
              typeof exercises != 'undefined' && exercises.length > 1
                ? exercises
                : []
            }
            playIndex={selectedVideoIndex}
            cancelCallBack={() => {
              this.modelOpen(true);
              this.setState({videoModelVisibility: false});
            }}
            onGoNextVideo={() => {
              if (
                typeof exercises != 'undefined' &&
                exercises.length > 1 &&
                selectedVideoIndex < exercises.length - 1
              ) {
                this.setState({selectedVideoIndex: selectedVideoIndex + 1});
              }
            }}
            store={this.props.store}
            onGoPreviousVideo={() => {
              if (
                typeof exercises != 'undefined' &&
                exercises.length > 1 &&
                selectedVideoIndex > 0
              ) {
                this.setState({selectedVideoIndex: selectedVideoIndex - 1});
              }
            }}
          />
          {/*<View style={{flex: 0}}>*/}
          {/*    <Button onPress={() => this._onPressStartButton()} block style={styles.startExerciseBtn}>*/}
          {/*        <Text style={styles.startExerciseBtnText}>*/}
          {/*            {i18n.t('exercises.start_dancing_button').toUpperCase()}*/}
          {/*        </Text>*/}
          {/*    </Button>*/}
          {/*</View>*/}
          <InAppPurchaseModalNew
            onCancel={() =>  {
              this.modelOpen(true);
              this.setIapModelVisibility(false);
            }}
            visibility={this.state.iapModelVisibility}
            store={store}
          />
         
        </ScrollableVideoHeader>
      );
    }
  }

  /**
   * on component unmount
   */
  componentWillUnmount() {
    this.isUnmounted = true;
    this.unSubscribeStore();
  }
}

const styles = StyleSheet.create({
  container: {},
  viewWrapper: {
    flex: 1,
    paddingLeft: PADDING_LEFT_RIGHT,
    paddingRight: PADDING_LEFT_RIGHT,
    marginBottom: 40,
  },
  videoView: {
    //flex: 1,
    //alignSelf: 'stretch',
    height: (WIDTH - PADDING_LEFT_RIGHT) * 0.75,
    width: WIDTH - PADDING_LEFT_RIGHT,
  },
  video: {
    //position: 'absolute',
    height: (WIDTH - PADDING_LEFT_RIGHT * 2) * 0.75,
    width: WIDTH - PADDING_LEFT_RIGHT * 2,
    //resizeMode: 'contain'
  },
  startExerciseBtn: {
    backgroundColor: '#D2959F',
  },
  startExerciseBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
  },
});

export {VIEW_CALLBACK_ENUMS as CALLBACK_ENUMS};
