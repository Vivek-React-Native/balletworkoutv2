import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {baseServerUri} from '../../../../common/appConstants';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import ImagePicker from 'react-native-image-crop-picker';
import {isAndroid} from '../../../../utilities/Screen';
import i18n from '../../../../common/i18n';
import goalplaceHolderImage from '@balletworkout/assets/images/Ballerina_GOALS.jpg';
import {
  PADDING_LEFT_RIGHT,
  LIGHT_PRIMARY_COLOR,
  PRIMARY_COLOR_NEW,
} from '../../../../utilities/Theme';
const CALLBACK_ENUM = {
  UPLOAD_PROFILE_PICTURE: 'profile/upload_profile_picture',
};

interface Props {
  store: any;
  callbackHandler: Function;
}
interface State {
  profilePicture: string;
}

export default class ProfilePicture extends Component<Props, State> {
  unSubscribeStore: Function = null;

  constructor(props: any) {
    super(props);
  }

  state = {
    profilePicture: ''
  };

  componentDidMount(){
    const {store} = this.props;

    this.unSubscribeStore = store.subscribe(() => {
      let userData = store.getState().auth.userData;
      // console.log('userData...', userData)
      // console.log('profile_picture...', profile_picture)
      this.setState({ profilePicture: baseServerUri + userData?.profile_picture_dir + userData?.profile_picture });
    });
  }

  _onPressImageEdit() {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    })
      .then((image: any) => {
        let data = {
          uri: image.path,
          name: isAndroid ? image.path.split('/').reverse()[0] : image.filename,
          type: image.mime,
        };

        this.props.callbackHandler(CALLBACK_ENUM.UPLOAD_PROFILE_PICTURE, data);
      })
      .catch(error => {
        // console.log(error);
      });
  }

  componentWillUnmount() {
    this.unSubscribeStore();
  }

  render() {
    // console.log('image...',this.state.profilePicture)
    return (
      <View style={styles.container}>
        <View style={styles.imageBackground}>
          <Text style={styles.textBold}>{i18n.t('settings.my_profile')}</Text>
          <View style={[styles.imageWrapper, styles.shadow]}>
            {/* <Image
              style={styles.profilePicture}
              source={{uri: this.state.profilePicture}}
            /> */}
            <TouchableWithoutFeedback onPress={() => this._onPressImageEdit()}>
              <View style={styles.editOverlay}>
                {this.state.profilePicture ? (
                  <Image
                    style={styles.profilePicture}
                    source={
                      this.state.profilePicture.includes('null')
                        ? goalplaceHolderImage
                        : {uri: this.state.profilePicture}
                    }
                  />
                ) : (
                  <Text style={styles.editOverlayText}>
                    <Icon name="pencil" />
                  </Text>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: 'transparent',
    marginBottom: 20,
    //height: 160,
  },
  textBold: {
    textAlign: 'left',
    paddingHorizontal: '5%',
    fontSize: 35,
    color: '#032426',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  imageBackground: {
    flex: 0,
    backgroundColor: LIGHT_PRIMARY_COLOR,
    //height: 200,
    marginTop: -1,
    paddingVertical: 15,
  },
  imageWrapper: {
    // position: 'absolute',
    // top: 20,
    alignSelf: 'center',
    // backgroundColor: '#ffffff',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ffffff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    resizeMode: 'cover',
    width: 125,
    height: 125,
    alignSelf: 'center',
    borderRadius: 62.5,
  },
  shadow: {
    // elevation: 10,
    // shadowColor: 'black',
    // shadowOffset: {width: 2, height: 5},
    // shadowRadius: 10,
    // shadowOpacity: 0.2,
  },
  editOverlay: {
    // flex: 1,
    // position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    // left: 0,
    // top: 0,
    backgroundColor: PRIMARY_COLOR_NEW,
  },
  editOverlayText: {
    color: '#ffffff',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 30,
  },
});
export {CALLBACK_ENUM as PROFILE_PICTURE_CALLBACK_ENUM};
