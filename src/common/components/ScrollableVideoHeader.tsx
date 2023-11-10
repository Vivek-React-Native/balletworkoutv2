import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  Animated,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Video from 'react-native-video';
import {
  scaleWithPixel,
  heightHeightHeader as _heightHeader,
} from '@balletworkout/utilities/Functions';
import exImage from '@balletworkout/assets/images/goal-detail-example.png';
import playBtn from '@balletworkout/assets/images/play-btn.png';
import {Text} from '@balletworkout/components';
import {HEIGHT, WIDTH} from '@balletworkout/utilities/Theme';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from './Loader';
import {Spinner} from 'native-base';
import {SECONDARY_COLOR} from '../../utilities/Theme';

let unmount = false;

interface Props {
  navigation: any;
  children: any;
  video: any;
  defaultVideo: any;
  title: string;
  purchaseExpired: string;
  loading?: boolean;
  paused?: boolean;
  isChangedVideo?: boolean;
  setIapModelVisibility?: Function;
  middleTitle: string;
  hideMiddle?: boolean;
  onMiddleHandler?: Function;
  onGoNextVideo?: Function;
  onGoPreviousVideo?: Function;
  videoTitle?: string;
  category: any;
}

export default function ScrollableVideoHeader({
  navigation,
  children,
  video,
  defaultVideo,
  title = '',
  loading = false,
  paused = false,
  purchaseExpired,
  setIapModelVisibility = () => {},
  middleTitle = '',
  videoTitle = '',
  hideMiddle = true,
  onMiddleHandler = () => {},
  onGoNextVideo = () => {},
  onGoPreviousVideo = () => {},
  category = {}
}: Props) {
  const deltaY = new Animated.Value(0);
  const heightImageBanner = scaleWithPixel(HEIGHT / 2.4, 1);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(paused);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [heightHeader, setHeightHeader] = useState(_heightHeader());

  const playerRef = useRef(null);

  useEffect(() => {
    unmount = true;
    return () => {
      // console.log('unmounted====================================:');
      setIsPaused(true);
    };
  }, []);

  useEffect(() => {
    setIsPaused(paused);
    // console.log('DATA...........',category)
  }, [paused]);

  const onLoadHandler = () => {
    setIsVideoLoading(false);
    // setIsPaused(true);
    if (playerRef) {
      setIsPaused(false);
      setTimeout(() => playerRef.current.seek(0));
    }
  };

  const onEndHandler = () => {
    if (playerRef) {
      setIsPaused(true);
      setTimeout(() => {
        playerRef.current.seek(0);
        setIsPaused(false);
      });
    }
  };

  const onPlayHandler = () => {
    setIsVideoLoading(false);
    if (isPaused) {
      if (playerRef) {
        setIsPaused(false);
      }
    } else {
      setIsPaused(true);
    }
  };

  const onProgressHandler = (progress: any) => {
    setIsVideoLoading(false);
    if (purchaseExpired) {
      if (progress.currentTime > 15) {
        setIsPaused(true);
        setTimeout(() => playerRef.current.seek(0));
        setIapModelVisibility(true);
      }
    }
  };

  const onNextHandler = () => {
    if (purchaseExpired) {
      setIapModelVisibility(true);
    } else {
      setIsPaused(false);
      setTimeout(() => onGoNextVideo());
    }
  };

  const onPreviousHandler = () => {
    if (purchaseExpired) {
      setIapModelVisibility(true);
    } else {
      setIsPaused(false);
      setTimeout(() => onGoPreviousVideo());
    }
  };

  const onMiddleHd = () => {
    if (purchaseExpired) {
      setIapModelVisibility(true);
    } else {
      onMiddleHandler();
    }
  };
  return (
    <View style={{flex: 1}}>
      <Animated.View
        style={[
          styles.imgBanner,
          // {
          //     height: deltaY.interpolate({
          //         inputRange: [
          //             0,
          //             scaleWithPixel(HEIGHT / 6),
          //             scaleWithPixel(HEIGHT / 6),
          //         ],
          //         outputRange: [heightImageBanner, heightHeader, heightHeader],
          //     }),
          // },
        ]}>
        {isVideoLoading && (
          <View style={styles.loadingContainer}>
            <Spinner color={SECONDARY_COLOR} />
          </View>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate('categories', {
            category: category,
          })}
          style={styles.backButton}>
          <Icon name="left" style={{fontSize: 20}} />
        </TouchableOpacity>
        {!hideMiddle && (
          <TouchableOpacity
            onPress={() => onMiddleHd()}
            style={{
              position: 'absolute',
              width: 60,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              borderRadius: 30,
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}>
            <Image
              source={playBtn}
              style={{width: 60, height: 60}}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
        )}
        {/*{!hideMiddle && <TouchableOpacity*/}
        {/*    onPress={() => onMiddleHd()}*/}
        {/*    style={styles.middleButton}>*/}
        {/*    <Text>{middleTitle}</Text>*/}
        {/*</TouchableOpacity>}*/}
        <View style={{width: WIDTH, flex: 1}}>
          <Video
            ref={playerRef}
            fullscreen={isFullscreen}
            source={defaultVideo}
            style={{width: WIDTH, flex: 1}}
            resizeMode={'cover'}
            playInBackground={false}
            ignoreSilentSwitch={'ignore'}
            onBuffer={() => {
              // console.log('video buffer');
            }}
            onLoadStart={() => setIsVideoLoading(true)}
            onLoad={() => onLoadHandler()}
            onEnd={() => onEndHandler()}
            hideShutterView={true}
            bufferConfig={{
              minBufferMs: 5000,
              maxBufferMs: 20000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
            }}
            paused={isPaused}
            muted={true}
            onProgress={onProgressHandler}
            onFullscreenPlayerDidDismiss={() => {
              setIsFullscreen(false);
              setIsPaused(true);
              setTimeout(() => setIsPaused(false));
            }}
          />
          {/*<View*/}
          {/*    style={styles.seekBar}*/}
          {/*>*/}
          {/*    <View style={styles.seekBarLeftContainer}>*/}
          {/*        <TouchableOpacity style={styles.seekButton} onPress={() => onPreviousHandler()}>*/}
          {/*            <Icon name="fastbackward" style={{fontSize: 15}} color={'#ffffff'}/>*/}
          {/*        </TouchableOpacity>*/}
          {/*        <TouchableOpacity style={styles.seekButton} onPress={() => onPlayHandler()}>*/}
          {/*            <Icon name={isPaused ? 'caretright' : 'pause'} style={{fontSize: 15}} color={'#ffffff'}/>*/}
          {/*        </TouchableOpacity>*/}
          {/*        <TouchableOpacity style={styles.seekButton}>*/}
          {/*            <Icon name="fastforward" style={{fontSize: 15}} color={'#ffffff'} onPress={() => onNextHandler()}/>*/}
          {/*        </TouchableOpacity>*/}
          {/*    </View>*/}
          {/*    <View style={styles.seekBarTitleContainer}>*/}
          {/*        <Text style={{color: '#000000'}} numberOfLines={1}>{videoTitle}</Text>*/}
          {/*    </View>*/}
          {/*    <View style={[styles.seekBarRightContainer]}>*/}
          {/*        <TouchableOpacity style={[styles.seekButton]} onPress={() => setIsMuted(!isMuted)}>*/}
          {/*            <Icon name={isMuted ? "sound" : "sound"} style={{fontSize: 15}} color={'#ffffff'}/>*/}
          {/*        </TouchableOpacity>*/}
          {/*        <TouchableOpacity*/}
          {/*            style={[styles.seekButton, {marginRight: 0}]}*/}
          {/*            onPress={() => {*/}
          {/*                if (purchaseExpired) {*/}
          {/*                    setIapModelVisibility(true);*/}
          {/*                } else {*/}
          {/*                    setIsFullscreen(true);*/}
          {/*                }*/}
          {/*            }}>*/}
          {/*            <Icon name={isFullscreen ? "shrink" : "arrowsalt"} style={{fontSize: 15}} color={'#ffffff'}/>*/}
          {/*        </TouchableOpacity>*/}

          {/*    </View>*/}
          {/*</View>*/}
        </View>
      </Animated.View>
      <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
        <ScrollView
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {y: deltaY},
                },
              },
            ],
            {useNativeDriver: false},
          )}
          onContentSizeChange={() => {
            setHeightHeader(_heightHeader());
          }}
          scrollEventThrottle={8}
          contentContainerStyle={{
            paddingBottom: 30,
            marginTop: Platform.OS === 'android' ? 15 : 15,
          }}>
          {/*<View style={{height: WIDTH - heightHeader + 15}}/>*/}
          <Text
            style={{
              fontSize: 28,
              color: '#032426',
              textAlign: 'center',
              paddingHorizontal: 20,
            }}>
            {title}
          </Text>
          {children}
        </ScrollView>
      </SafeAreaView>
      {loading && <Loader />}
    </View>
  );
}

const styles = StyleSheet.create({
  imgBanner: {
    // position: 'absolute',
    width: '100%',
    height: HEIGHT / 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    zIndex: 1000,
  },
  loadingContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    zIndex: 1000,
    left: 20,
    top: Platform.OS == 'ios' ? 40 : 15,
    paddingTop:10,
  },
  pauseButton: {
    position: 'absolute',
    width: WIDTH / 1.5,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  playButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 208, 216,0.6)',
  },
  middleButton: {
    position: 'absolute',
    height: 40,
    top: 35,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 200,
    zIndex: 1001,
    borderRadius: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 208, 216, 0.8)',
  },
  seekBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 208, 216, 0.4)',
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
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 208, 216, 0.6)',
    marginRight: 10,
  },
});
