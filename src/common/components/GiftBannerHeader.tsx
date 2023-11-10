import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import i18n from './../../common/i18n';
import logoImage from './../../assets/images/logo_250_splash.png';
import goalplaceHolderImage from '@balletworkout/assets/images/Ballerina-3Dv3.png';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { WIDTH, HEIGHT } from '../../utilities/Theme';
interface Props {
  extraStyle;
  cancelCallBack?: Function;
  //successCallBack?: Function;
}
interface State {}
export default class GiftBannerHeader extends Component<Props, State> {
  public static defaultProps: Partial<Props> = {};

  render() {
    return (
      <SafeAreaView>
        <TouchableOpacity
          style={styles.container}
          onPress={() => this.props.parentCallback()}>
          <Text style={styles.text}>{i18n.t('home.gameBannertext')}</Text>
          <Image
            style={styles.image}
            resizeMode={'contain'}
            source={goalplaceHolderImage}
          />
          {/* <TouchableOpacity
            onPress={() => cancelCallBack()}
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AntDesignIcon name="close" size={20} color="#fff" />
          </TouchableOpacity> */}
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#AD557A',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginHorizontal: -WIDTH * 0.035,
    zIndex: 1500,
  },
  text: {
    fontSize: WIDTH * 0.035,
    //fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  image: {
    // width: 70,
    // height: 70,
    width: WIDTH * 0.15,
    height: WIDTH * 0.15,
  },
});
