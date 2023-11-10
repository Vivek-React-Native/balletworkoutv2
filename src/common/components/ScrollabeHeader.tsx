import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Animated,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  scaleWithPixel,
  heightHeader as _heightHeader,
} from '@balletworkout/utilities/Functions';
import exImage from '@balletworkout/assets/images/goal-detail-example.png';
import TransparentHeader from './TransparentHeader';
import {Text} from '@balletworkout/components';
import {HEIGHT, WIDTH} from '@balletworkout/utilities/Theme';
import Icon from 'react-native-vector-icons/AntDesign';
import Loader from './Loader';

interface Props {
  navigation: any;
  children: any;
  image: any;
  title: string;
  middleTitle: string;
  hideBack?: boolean;
  hideMiddle?: boolean;
  loading?: boolean;
  onMiddleHandler?: Function;
  backButtonStyle: any;
}
export default function ScrollabeHeader({
  navigation,
  children,
  image,
  title = '',
  middleTitle = '',
  hideBack = false,
  hideMiddle = true,
  loading = false,
  onMiddleHandler = () => {},
  backButtonStyle
}: Props) {
  const deltaY = new Animated.Value(0);
  const heightImageBanner = scaleWithPixel(WIDTH / 1.1, 1);
  // const [ImageURL, setImageURL] = useState()

  const [heightHeader, setHeightHeader] = useState(_heightHeader());
  const [ImageLoading, setImageLoading] = useState(false)
  const [ImageUri, setImageUri] = useState(image)

  useEffect(() => {
    if(image.uri == ''){
      setImageUri(exImage)
    }
  }, [])
  
  return (
    <View style={{flex: 1}}>
      <Animated.View
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                scaleWithPixel(WIDTH / 3.8),
                scaleWithPixel(WIDTH / 3.8),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}>
        {!hideBack && (
          <TouchableOpacity
            onPress={() => navigation()}
            style={[{
              position: 'absolute',
              width: 50,
              height: 50,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              zIndex: 1000,
              left: 20,
              top: Platform.OS=='ios' ? HEIGHT * 0.06: HEIGHT * 0.03,
            }, backButtonStyle]}>
            <Icon name="left" style={{fontSize: 20}} />
          </TouchableOpacity>
        )}
        {!hideMiddle && (
          <TouchableOpacity
            onPress={() => onMiddleHandler()}
            style={{
              position: 'absolute',
              height: 50,
              justifyContent: 'center',
              alignItems: 'flex-end',
              marginBottom: 200,
              zIndex: 1001,
              borderRadius: 10,
              paddingHorizontal: 20,
              backgroundColor: 'rgba(255, 208, 216, 0.7)',
            }}>
            <Text>{middleTitle}</Text>
          </TouchableOpacity>
        )}
          <Image
            source={ImageUri}
            resizeMode={'cover'}
            style={{flex: 1, width: WIDTH}}
            onLoadStart={()=> setImageLoading(true)}
            onLoadEnd={()=> setImageLoading(false)}
          />
          {
            ImageLoading && (
              <View style={{flex: 1,position: 'absolute',backgroundColor: '#fff',top: 0,left: 0,right: 0,bottom: 0,alignItems:'center',justifyContent:'center'}}>
                <ActivityIndicator size={'large'} color={'#f00'} />
              </View>
            )
          }
        <Animated.View
          style={{
            position: 'absolute',
            paddingHorizontal: 20,
            width: '100%',
            bottom: 0,
            height: 50,
            backgroundColor: '#fff',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
        />
      </Animated.View>
      <SafeAreaView
        style={{flex: 1, marginTop: Platform.OS === 'android' ? 180 : 200}}
        forceInset={{top: 'always'}}>
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
          scrollEventThrottle={1}
          contentContainerStyle={{paddingBottom: 30}}>
          <View style={{height: WIDTH - heightHeader - 40}} />
          <Text
            style={{
              fontSize: WIDTH * 0.07,
              color: '#032426',
              textAlign: 'center',
              alignSelf: 'center',
              width: WIDTH * 0.9
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
    position: 'absolute',
    width: '100%',
    height: HEIGHT / 2,
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex: 1000
  },
  rowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
    marginRight: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  contentButtonBottom: {
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  linePrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  iconRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
});
