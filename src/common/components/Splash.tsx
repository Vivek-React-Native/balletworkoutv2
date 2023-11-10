import React, {Component} from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import splashImage from './../../assets/images/bigsplashNew.png';
import * as Progress from 'react-native-progress';
import DrawerLogo from '../../assets/DrawerLogo.svg'
import { WIDTH, HEIGHT } from '../../utilities/Theme';

const {width, height} = Dimensions.get('window');

interface Props {
  parentCallback:any;
}
interface State {
  timer: number
}
export default class Splash extends Component<Props, State> {
  constructor(props: any) {
    super(props);
  }
  
  interval:any

  state = {timer: 0};

  componentDidMount() {
    this.interval = setInterval(
      () => {
        if(this.state.timer <= 1){
          this.setState({timer: this.state.timer + 0.1})
        }else {
          this.onTrigger(false);
          clearInterval(this.interval);
        }
      },
      80,
    );
  }
  onTrigger = done => {
    this.props.parentCallback(done);
  };

  render() {
    return (
      <View style={[styles.container]}>
        <Image
          source={splashImage}
          resizeMode={'cover'}
          style={styles.imageContainer} />
            <View style={{flex: 2}} />
            <View style={{flex: 1,alignItems: 'center',justifyContent:"space-between",marginVertical: HEIGHT * 0.03}}>
              <Progress.Bar
                progress={this.state.timer}
                width={width * 0.8}
                unfilledColor={'#ffffff'}
                color={'#A15B78'}
                style={{marginTop: HEIGHT * 0.03}}
              />
              <DrawerLogo width={WIDTH * 0.6} height={HEIGHT * 0.1} />
            </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImageWrapper: {
    // flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    //top: "18%",
  },
  imageContainer: {
    width: width,
    height: height,
    position: 'absolute',
    borderWidth: 1
  },
  progressContainer: {
    marginTop: '70%',
  },
  image: {
    flex: 0,
    width: width,
  },
  bottomLogo: {
    width: 230,
    height: 30,
    position: 'absolute',
    bottom: 30,
  },
  progress: {
    flex: 0,
    width: '80%',
    height: 100,
  },
});

