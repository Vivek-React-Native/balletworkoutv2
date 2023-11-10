import React, {Component} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {
  doRegister,
  doRegisterationWithFb,
  doRegisterationWithApple,
} from './../../common/auth/actions';

import Register, {CALLBACK_ENUMS} from './../../stories/screens/Register';
import {WIDTH, PADDING_LEFT_RIGHT, HEIGHT} from '../../utilities/Theme';
import NoConnection from '../../common/components/NoConnection';
import {getDefaultPref} from '../../utilities/Functions';
import {Container, Header, Left, Body, Right} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';

// import doRegister from './reducer';

interface Props {
  navigation: any;
  doRegister: Function;
  doRegisterWithFb: Function;
  doRegisterWithApple: Function;
  screenProps: any;
}
interface State {
  showRegitration: boolean;
}
class RegisterContainer extends Component<Props, State> {
  static navigationOptions = {
    header: null,
  };

  state = {
    showRegitration: false,
  };

  constructor(props: any) {
    super(props);

    this.beforeRegistration();
  }

  async beforeRegistration() {
    const {store} = this.props.screenProps;
    let isFirst = store.getState().ChooseDays.isFirst;
    let first_time_registration = await getDefaultPref(
      'first_time_registration',
    );

    // console.log('first_time_registration', first_time_registration);

    let loginStatus = store.getState().auth.isLoggedIn;
    if (loginStatus) {
      if (!isFirst) {
        this.props.navigation.navigate('app');
      } else {
        this.props.navigation.navigate('welcome');
      }
      // console.log('loggedin block');
    } else if (!loginStatus && first_time_registration !== null) {
      // console.log('else if block');
      // this.props.navigation.navigate('login');
    } else {
      // console.log('else block', first_time_registration);
    }
  }

  callbackHandler = (type: string, data: any) => {
    switch (type) {
      case CALLBACK_ENUMS.REGISTER_FORM_REGISTRATION:
        this.props.doRegister(data);
        break;
      case CALLBACK_ENUMS.REGISTER_WITH_FACEBOOK:
        this.props.doRegisterWithFb(data);
        break;
      case CALLBACK_ENUMS.REGISTER_WITH_APPLE:
        this.props.doRegisterWithApple(data);
        break;
    }
  };

  render() {
    const {store} = this.props.screenProps;

    return (
      <Container style={styles.container}>
        {this.props.screenProps.isConnectedToNetwork ? null : <NoConnection />}
        {/*<StatusBar*/}
        {/*    hidden*/}
        {/*    barStyle="light-content" />*/}
        <Header transparent style={{height: 70, flex: 0}}>
          <Left>
            <TouchableOpacity
              style={{marginLeft: 5}}
              onPress={() => this.props.navigation.navigate('login')}>
              <Icon name="left" style={{fontSize: 20}} />
            </TouchableOpacity>
          </Left>
          <Body />
          <Right />
        </Header>
        {/*<Image source={require('./../../assets/images/registerBack.png')} resizeMode="cover" style={styles.imageBackground}></Image>*/}
        {/*<LinearGradient colors={['rgba(70,76,110,0.7)', 'rgba(210,149,159,0.5)']} style={styles.overlay}></LinearGradient>*/}
        <Register
          store={store}
          callbackHandler={this.callbackHandler}
          navigation={this.props.navigation}
        />
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    width: WIDTH >= 768 ? WIDTH - PADDING_LEFT_RIGHT * 2 : '100%',
    height: Platform.OS === 'ios' ? HEIGHT : HEIGHT - 15,
    resizeMode: 'cover',
    marginLeft: PADDING_LEFT_RIGHT,
  },
  viewWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    width: '100%',
    height: HEIGHT,
  },
});

const mapStateToProps = (state: any) => {
  const {auth} = state;

  return {
    auth,
  };
};

const mapDispatchToProps = (dispatch: Function) => {
  return {
    doRegister: (userData: any) => {
      dispatch(doRegister(userData));
    },
    doRegisterWithFb: (loginData: any) => {
      dispatch(doRegisterationWithFb(loginData));
    },
    doRegisterWithApple: (loginData: any) => {
      dispatch(doRegisterationWithApple(loginData));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterContainer);
