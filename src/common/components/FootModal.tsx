import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {Text} from '@balletworkout/components';
import {Spinner} from 'native-base';
import {HEIGHT, SECONDARY_COLOR, WIDTH} from '../../utilities/Theme';

interface Props {
  children: React.ReactNode;
  visible: boolean;
  loading?: boolean;
  title: string;
  successCallBack?: Function;
  cancelCallBack?: Function;
  titleStyle: object,
}

export const FootModal = ({
  children,
  visible,
  loading = false,
  title,
  successCallBack,
  cancelCallBack,
  titleStyle,
}: Props) => {
  return (
    <View>
      <Modal
        isVisible={visible}
        style={styles.bottomModal}
        onSwipeComplete={cancelCallBack}
        animationIn="slideInUp"
        amimationInTiming={100}
        swipeDirection={['down']}
        onRequestClose={()=> {}}>
          <View style={{flex: 1,paddingTop: HEIGHT * 0.1}}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              {loading && (
                <View
                  style={[
                    styles.contentFilterBottom,
                    {
                      justifyContent: 'center',
                      position: 'absolute',
                      top: -0,
                      zIndex: 99999999,
                      alignItems: 'center',
                      width: WIDTH,
                      height: HEIGHT,
                      backgroundColor: 'rgba(0,0,0, 0.5)',
                    },
                  ]}>
                  <Spinner color={SECONDARY_COLOR} />
                </View>
              )}
              <View
                style={[
                  styles.contentFilterBottom,
                  {backgroundColor: '#ffffff'},
                ]}>
                {/*<TouchableOpacity style={styles.contentSwipeDown} onPress={() => cancelCallBack()}>*/}
                {/*    <View style={styles.lineSwipeDown}/>*/}
                {/*</TouchableOpacity>*/}
                <View style={[styles.contentHeader]}>
                  <Text style={[{fontSize: 25}, titleStyle]}>{title}</Text>
                  <TouchableOpacity
                    onPress={() => cancelCallBack()}
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <AntDesignIcon name="close" size={20} />
                  </TouchableOpacity>
                </View>
                {children}
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
    height: 45,
    marginTop: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottomModal: {
    margin: 0,
  },
  contentFilterBottom: {
    width: '100%',
    flexDirection: 'column',
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    paddingBottom: 25,
  },
  contentSwipeDown: {
    paddingTop: 10,
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
});
