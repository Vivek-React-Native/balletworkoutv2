import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Text} from '@balletworkout/components';
import Video from 'react-native-video';
import moment from 'moment';

import {HEIGHT, WIDTH} from '@balletworkout/utilities/Theme';
import Icon from 'react-native-vector-icons/AntDesign';
import {Spinner} from 'native-base';
import {SECONDARY_COLOR} from '../../utilities/Theme';
import {baseServerUri} from '../appConstants';
import {debounce, getTrainingTime} from '../../utilities/Functions';
import {useDispatch, useSelector} from 'react-redux';
import TrainingProgressCore from '../training';
import LinearGradient from 'react-native-linear-gradient';
import ForwardIcon from '@balletworkout/assets/images/play-forward.png';
import BackwardIcon from '@balletworkout/assets/images/play-backward.png';
import VolumeIcon from '@balletworkout/assets/images/volume-on.png';
import VolumeOffIcon from '@balletworkout/assets/images/volume-off.png';
import VPlayIcon from '@balletworkout/assets/images/player-play.png';
import VPauseIcon from '@balletworkout/assets/images/player-pause.png';
import Rate, {AndroidMarket} from 'react-native-rate';
import AsyncStorage from '@react-native-community/async-storage';
import { AFLogEvent } from '../../utilities/AppsFlyer';
interface Props {
  visible: boolean;
  playAll: boolean;
  category: any;
  exercises: any[];
  playIndex: number;
  successCallBack?: Function;
  cancelCallBack?: Function;
  onGoNextVideo?: Function;
  onGoPreviousVideo?: Function;
  connection:any
  store:any;
}

let unmount = false;
export const VideoModal = ({
  visible,
  playAll = false,
  category,
  exercises,
  playIndex,
  cancelCallBack = () => {},
  onGoNextVideo = () => {},
  onGoPreviousVideo = () => {},
  connection,
  store,
}: Props) => {
  const dispatch = useDispatch();
  const trainingData = useSelector(state =>
    TrainingProgressCore.selectors.trainings(state),
  );
  const isChanged = useSelector(state =>
    TrainingProgressCore.selectors.isChanged(state),
  );

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [seconds, setSeconds] = useState(1);
  const [counter, setCounter] = useState(0);
  const [timer, setTimer] = useState('0:00:00');

  const lastElement = exercises.length - 1

  // const playerRef = useRef(null);

  const debounceQuery = useRef(debounce(() => setSeconds(Math.random()), 1000))
    .current;

  useEffect(() => {
    if (exercises.length > 0) {
      // console.log('exercises[playIndex]:++++++++++++++', exercises[playIndex]);
      if (exercises[playIndex].video_dir) {
        setVideoUrl(
          baseServerUri +
            exercises[playIndex].video_dir +
            exercises[playIndex].video_file,
        );
      } else {
        alert('Invalid Video!');
        closeHandler();
      }
      setVideoTitle(exercises[playIndex].title);
      setTimer('0:00:00');
      const elapsedTime = getTrainingTime(
        trainingData,
        category.id,
        exercises[playIndex].id,
        moment(new Date()).format('YYYY-MM-DD'),
      );
      setCounter(elapsedTime);
    }
  }, [playIndex]);

  useEffect(() => {
    // console.log('trainingData:++++++++++++++', trainingData);
  }, [isChanged]);

  useEffect(() => {
    unmount = true;
    return () => {
      unmount = false;
    };
  }, []);

  useEffect(() => {
    // console.log('seconds:++++++++++++++', counter);
    if (visible && !isPaused) {
      if (!isVideoLoading) {
        setCounter(counter + 1);
      }
      debounceQuery();
    }
  }, [seconds]);
  useEffect(() => {
    if (visible) {
      debounceQuery();
      const elapsedTime = getTrainingTime(
        trainingData,
        category.id,
        exercises[playIndex].id,
        moment(new Date()).format('YYYY-MM-DD'),
      );
      setCounter(elapsedTime);
    } else {
      if (counter > 2) {
        saveProgress();
      }
    }
  }, [visible]);

  useEffect(() => {
    if (!isPaused) {
      debounceQuery();
    }
    handleAppReview();
  }, [isPaused]);
  const saveProgress = () => {
    dispatch(
      TrainingProgressCore.actions.saveTrainingProgress({
        categoryId: category.id,
        exerciseId: exercises[playIndex].id,
        category: category,
        exercise: exercises[playIndex],
        date: moment(new Date()).format('YYYY-MM-DD'),
        // date: '2021-11-30',
        time: counter,
      }),
    );
  };

  const closeHandler = () => {
    // console.log('closeHandler:');
    setIsPaused(true);
    cancelCallBack();
  };
  const onLoadHandler = () => {
    // console.log('onLoad...')
    setIsVideoLoading(false);
    // setIsPaused(true);
    // if (playerRef) {
      setIsPaused(false);
      // setTimeout(() => playerRef.current.seek(0));
    // }
  };

  const onEndHandler = async () => {
    // console.log('onLoadEnd...')
    const videoName = exercises[playIndex]?.title
    const [ result ] = await AFLogEvent('Video_Seen', { videoName: videoName });
    console.log('AppsFlyer Video Seen result.......', result);

    appsFlyer()
    
    setIsVideoLoading(true)
    // if (playerRef) {
      if (playIndex < exercises.length - 1) {
        onNextHandler();
      } else {
        setIsPaused(true);
      }
    // }
  };

  const onPlayHandler = () => {
    setIsVideoLoading(false);
    if (isPaused) {
      // if (playerRef) {
        setIsPaused(false);
      // }
    } else {
      setIsPaused(true);
    }
  };

  const onProgressHandler = (progress: any) => {
    setIsVideoLoading(false);
    const time = Math.floor(progress.currentTime)
    setTimer(progress.currentTime > 10 ? `0:00:${time}` : `0:00:0${time}`)
  };

  const appsFlyer = async () => {
    const setdata = await AsyncStorage.getItem('videoSeen')
    if(setdata == null){
      await AsyncStorage.setItem('videoSeen', 'true')
      const { email, first_name } = store.getState().auth.userData
      const result = await AFLogEvent('Seen Promo', {email: email,firstName: first_name});
      console.log('AppsFlyer promo seen result.......', result);
      cancelCallBack()
    }
  }

  const onNextHandler = () => {
    // console.log('Next Video')
    if (playAll) {
      setIsPaused(false);
      saveProgress();
      setTimeout(() => onGoNextVideo(), 10);
    } else {
      setIsPaused(true);
      setTimeout(() => {
        // playerRef.current.seek(0);
        setIsPaused(false);
      });
    }
  };

  const onPreviousHandler = () => {
    setIsPaused(false);
    setTimeout(() => onGoPreviousVideo());
  };

  const handleAppReview = () => {
    // console.log('handleAppReview');
    AsyncStorage.getItem('appReviewIsSet').then(valueReview => {
      var isReviewGiven = false;
      if (valueReview != null) {
        if (valueReview === '1') {
          isReviewGiven = true;
        }
      }
      // console.log('isReviewGiven.....',isReviewGiven);
      if (isReviewGiven === false) {
        AsyncStorage.getItem('counterOfAppReview').then(value => {
          // console.log(value);
          if (value != null) {
            if (Number(value) === 5) {
              AsyncStorage.setItem('counterOfAppReview', '0');
              const options = {
                AppleAppID: '1447342760',
                GooglePackageName: 'be.balletworkout.app',
                preferredAndroidMarket: AndroidMarket.Google,
                preferInApp: true,
                openAppStoreIfInAppFails: false,
                fallbackPlatformURL: 'https://www.balletworkout.be/',
              };
              Rate.rate(options, async (success) => {
                if (success) {
                  // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
                  //setrated(true);
                  const settingData = await AsyncStorage.setItem('appReviewIsSet', '1');
                  const result = await AFLogEvent('Review_left', { Review: 'Review Added' });
                  console.log('AppsFlyer Review result.......', result);
                }
              });
            } else {
              AsyncStorage.setItem(
                'counterOfAppReview',
                String(Number(value) + 1),
              );
            }
          } else {
            AsyncStorage.setItem('counterOfAppReview', '0');
          }
        });
      }
    });
  };

  return connection && (
    <View>
      <Modal
        isVisible={visible}
        style={[styles.bottomModal, {backgroundColor: '#ffffff'}]}>
        <View
          style={{
            height: HEIGHT,
            backgroundColor: '#ffffff',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              margin: 0,
            }}>
            <View
              style={[
                styles.contentFilterBottom,
                {backgroundColor: 'transparent'},
              ]}>
              {/*<TouchableOpacity style={styles.contentSwipeDown} onPress={() => cancelCallBack()}>*/}
              {/*    <View style={styles.lineSwipeDown}/>*/}
              {/*</TouchableOpacity>*/}
              <View style={{flexDirection:'row',marginTop: Platform.OS =='ios' ? HEIGHT * 0.05 : HEIGHT * 0.02,paddingLeft: WIDTH * 0.03}}>
                  <TouchableOpacity
                    onPress={closeHandler}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: WIDTH *0.1,
                      height: WIDTH *0.1,
                      zIndex: 5000
                    }}>
                    <Icon name="left" style={{fontSize: WIDTH * 0.06,color:'#000000'}} />
                  </TouchableOpacity>
                  <View style={{ marginLeft: -WIDTH * 0.13,}}>
                    <Text style={{
                        width: WIDTH,
                        color: '#A45A79',
                        fontSize: 17,
                        textAlign: 'center',
                        zIndex: 0,
                      }}>{exercises[playIndex]?.title}</Text>
                    <Text
                      style={{
                        width: WIDTH,
                        color: '#000000',
                        fontSize: 17,
                        textAlign: 'center',
                        zIndex: 0,
                      }}>
                      {playIndex + 1}/{exercises.length}
                    </Text>
                  </View>
                  
              </View>
              
              <View
                style={{
                  flex: 1,
                  width: WIDTH,
                }}>
                {isVideoLoading && (
                  <View style={styles.loadingContainer}>
                    <Spinner color={SECONDARY_COLOR} />
                  </View>
                )}
                <View
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '80%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000,
                  }}>
                  <Video
                    source={{uri: videoUrl}}
                    style={{width: WIDTH, flex: 1, aspectRatio: 1,marginBottom: HEIGHT * 0.1}}
                    resizeMode={'contain'}
                    onBuffer={() => {
                      // console.log('onBuffer...');
                    }}
                    onLoadStart={() => {
                      // console.log('onLoadStart...')
                      setIsVideoLoading(true)
                    }}
                    onLoad={() => onLoadHandler()}
                    onEnd={() => onEndHandler()}
                    bufferConfig={{
                      minBufferMs: 15000,
                      maxBufferMs: 20000,
                      bufferForPlaybackMs: 2500,
                      bufferForPlaybackAfterRebufferMs: 5000,
                    }}
                    paused={isPaused}
                    muted={isMuted}
                    onProgress={onProgressHandler}
                    // ref={playerRef}
                    // fullscreen={isFullscreen}
                    // playInBackground={false}
                    // ignoreSilentSwitch={'ignore'}
                    // hideShutterView={true}
                    // onFullscreenPlayerDidDismiss={() => {
                    //   setIsFullscreen(false);
                    //   setIsPaused(true);
                    //   setTimeout(() => setIsPaused(false));
                    // }}
                  />
                </View>
              </View>

              <Text
                style={{
                  color: '#D2959F',
                  fontSize: WIDTH * 0.04,
                  bottom: HEIGHT * 0.16,
                  zIndex: 1500,
                }}>
                {timer}
              </Text>
              <LinearGradient
                colors={['rgba(255,255,255,1)', 'rgba(0,0,0,0.9)']}
                style={styles.seekBar}>
                <View style={styles.seekBarLeftContainer}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.seekButton]}
                    onPress={() => setIsMuted(!isMuted)}>
                    {isMuted && (
                      <Image
                        style={styles.playerIcon}
                        resizeMode={'contain'}
                        source={VolumeOffIcon}
                      />
                    )}
                    {!isMuted && (
                      <Image
                        style={styles.playerIcon}
                        resizeMode={'contain'}
                        source={VolumeIcon}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.seekBarTitleContainer}>
                  {playAll && (
                    <TouchableOpacity
                      style={styles.seekButton}
                      activeOpacity={0.9}
                      onPress={() => onPreviousHandler()}>
                        {
                          playIndex == 0 ? null :
                          <Image
                          style={styles.playerIcon}
                          resizeMode={'contain'}
                          source={BackwardIcon}
                          />
                        }
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.playButton}
                    activeOpacity={0.9}
                    onPress={() => onPlayHandler()}>
                    {isPaused && (
                      <Image
                        style={styles.playerIcon}
                        resizeMode={'contain'}
                        source={VPlayIcon}
                      />
                    )}
                    {!isPaused && (
                      <Image
                        style={styles.playerIcon}
                        resizeMode={'contain'}
                        source={VPauseIcon}
                      />
                    )}
                  </TouchableOpacity>
                  {playAll ?
                    <TouchableOpacity
                      style={styles.seekButton}
                      activeOpacity={0.9}
                      onPress={() => onNextHandler()}>
                      {lastElement != playIndex ? 
                      ( <Image
                          style={styles.playerIcon}
                          resizeMode={'contain'}
                          source={ForwardIcon}
                        />) : 
                      null}
                    </TouchableOpacity>
                  : null}
                </View>
                <View style={[styles.seekBarRightContainer]}>
                  <TouchableOpacity
                    style={[styles.seekButton, {marginRight: 0}]}
                    // onPress={() => {
                    //   setIsFullscreen(true);
                    // }}
                    >
                    {/*<Icon name={isFullscreen ? "shrink" : "arrowsalt"}*/}
                    {/*      style={{fontSize: 15}} color={'#ffffff'}/>*/}
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    borderWidth: 1,
    height: 40,
    minWidth: 80,
  },
  contentHeader: {
    position: 'absolute',
    width: '100%',
    height: 55,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    top: 25,
    zIndex: 1002,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomModal: {
    justifyContent: 'center',
    margin: 0,
  },
  contentFilterBottom: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSwipeDown: {
    alignItems: 'center',
  },
  lineSwipeDown: {
    width: 30,
    height: 2.5,
    backgroundColor: '#ccc',
  },
  contentActionModalBottom: {
    height: 50,
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  seekBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: HEIGHT * 0.15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    zIndex: 1001,
  },
  seekBarLeftContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  seekBarTitleContainer: {
    flex: 1,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    // backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  seekBarRightContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  seekButton: {
    width: WIDTH * 0.12,
    height: WIDTH * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  playButton: {
    width: WIDTH * 0.2,
    height: WIDTH * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 38,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    marginHorizontal: 20,
  },
  playerIcon: {
    width: WIDTH * 0.08,
    height: WIDTH * 0.08,
    alignSelf: 'center',
  },
});
