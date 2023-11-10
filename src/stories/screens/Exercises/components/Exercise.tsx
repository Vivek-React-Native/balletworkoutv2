import React, {Component} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {
  PADDING_LEFT_RIGHT,
  WIDTH,
  PRIMARY_COLOR,
} from '@balletworkout/utilities/Theme';
import {Viewport} from '@skele/components';
import {Text} from '@balletworkout/components';
import starIcon from '@balletworkout/assets/images/star-icon.png';
import playIcon from '@balletworkout/assets/icons/play.png';

const ViewportAwareView = Viewport.Aware(View);

interface Props {
  source: any;
  title: string;
  exercise: any;
  navigation: any;
  show: boolean;
  setShowVideos: Function;
  showVideo: Function;
  subCategory: any;
  subCategoryType: string;
  key: any;
  connection:any
}

interface State {
  isPaused: boolean;
  isMuted: boolean;
  showPoster: boolean;
  inViewPort: boolean;
}

export default class Exercise extends Component<Props, State> {
  _player: any = null;

  constructor(props: any) {
    super(props);
    this.state = {
      isPaused: true,
      isMuted: true,
      showPoster: true,
      inViewPort: false,
    };
  }

  _onViewportEnter() {
    this.setState({inViewPort: true});
    this.setState({isPaused: false});
    // console.log('entered');
  }

  _onViewportLeave() {
    this.setState({isPaused: true});
    // console.log('exit');
  }

  _onReadyForDisplay() {
    this.setState({showPoster: false});
  }

  _willReadyForDisplay() {
    this.setState({showPoster: true});
  }

  _onNavigate() {
    // const { exercise, navigation, setShowVideos, subCategory } = this.props;
    // let VideoArray = [exercise];
    // this.setState({showPoster: true});
    // navigation.push('exercise', {
    //     type: 'SINGLE_EXERCISE',
    //     data: VideoArray,
    //     callback: setShowVideos.bind(this),
    //     subCategory: subCategory
    // });

    const {
      exercise,
      navigation,
      showVideo,
      setShowVideos,
      subCategory,
      subCategoryType,
      purchaseExpired,
      setIapModelVisibility,
    } = this.props;
    if (purchaseExpired) {
      setIapModelVisibility(true);
    } else {
      showVideo(exercise);
    }
  }

  render() {
    const {exercise, key} = this.props;
    return (
      <View style={styles.container} key={key}>
        <TouchableOpacity
          style={styles.imageRowContainer}
          onPress={() => this._onNavigate()}>
          {/*<View style={styles.imageContainer}>*/}
          {/*    <Image style={styles.mainImage} resizeMode={'contain'} source={beautyPosture}/>*/}
          {/*</View>*/}

          <View style={styles.textContainer}>
            <Text style={[styles.buttonText]} font={'SemiBold'}>
              {this.props.title}
            </Text>
            <View style={styles.tagContainer}>
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
                <Text style={[styles.tagText]} font={'SemiBold'}>
                  Beginner
                </Text>
              </View>
            </View>
            <Text
              style={styles.textDescription}
              font={'Regular'}
              numberOfLines={3}>
              {exercise.description}
            </Text>
          </View>
          <View style={styles.rightImageContainer}>
            <Image
              style={styles.rightImage}
              resizeMode={'contain'}
              source={playIcon}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  componentWillUnmount() {
    if (this._player) this._player.seek(0);
    this.setState({isPaused: true});
  }
}

const styles = StyleSheet.create({
  container: {},
  videoView: {
    height: (WIDTH - PADDING_LEFT_RIGHT) * 0.75,
    width: WIDTH - PADDING_LEFT_RIGHT,
  },
  video: {
    height: (WIDTH - PADDING_LEFT_RIGHT * 2) * 0.75,
    width: WIDTH - PADDING_LEFT_RIGHT * 2,
  },
  exerciseTitle: {
    color: PRIMARY_COLOR,
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  poster: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255, 0.5)',
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2E6E6',
    width: WIDTH * 0.2,
    height: WIDTH * 0.2,
  },
  imageRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10,
    backgroundColor: '#F7F7F7',
    padding: 5,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  bgImage: {
    width: WIDTH * 0.2,
    height: WIDTH * 0.2,
    aspectRatio: 1,
  },
  mainImage: {
    position: 'absolute',
    width: WIDTH * 0.15,
    height: WIDTH * 0.15,
    backgroundColor: 'transparent',
  },
  buttonText: {
    marginTop: 5,
    textAlign: 'left',
    fontSize: 14,
    color: '#032426',
    marginVertical: 2,
    letterSpacing: 1.5
  },
  textDescription: {
    fontSize: 12,
    color: '#032426',
    marginVertical: 2,
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tagContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#F2E6E6',
    marginRight: 5,
  },
  tagText: {
    fontSize: 12,
    color: '#032426',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 2,
  },
  starIcon: {
    width: 15,
    height: 13,
    marginRight: 5,
    marginTop: -2,
    alignSelf: 'center',
  },
  rightImageContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D2959F',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignSelf: 'center',
  },
  rightImage: {
    width: 16,
    height: 16,
  },
});
