import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList, Dimensions, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import {Text} from "@balletworkout/components";

interface Props {
    children: React.ReactNode,
    visible: boolean,
    title: string
    successCallBack?: Function,
    cancelCallBack?: Function
};

export const FootModalNoAnimating = ({children, visible, title, successCallBack, cancelCallBack}: Props) => {

    return (
        <View>
            <Modal
                isVisible={visible}
                style={styles.bottomModal}
                onSwipeComplete={cancelCallBack}
                propagateSwipe={true}
                animationIn="slideInUp"
                onRequestClose={() => {
                }}
            >
                <View style={{height: Dimensions.get('window').height}}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        margin: 0,
                    }}>
                        <View style={[styles.contentFilterBottom, {backgroundColor: '#ffffff'}]}>
                            {/*<TouchableOpacity style={styles.contentSwipeDown} onPress={() => cancelCallBack()}>*/}
                            {/*    <View style={styles.lineSwipeDown}/>*/}
                            {/*</TouchableOpacity>*/}
                            <View style={[styles.contentHeader]}>
                                <Text style={{fontSize: 25}}>
                                    {title}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => cancelCallBack()}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <AntDesignIcon name="close" size={20}/>
                                </TouchableOpacity>
                            </View>
                            <View>
                                {children}
                            </View>
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
        minWidth: 80
    },
    contentHeader: {
        height: 45,
        marginTop: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    contentFilterBottom: {
        width: '100%',
        flexDirection: 'column',
        borderTopLeftRadius: 38,
        borderTopRightRadius: 38,
        paddingHorizontal: 20,
        alignSelf: 'flex-end',
        paddingBottom: 25

    },
    contentSwipeDown: {
        paddingTop: 10,
        alignItems: 'center',
    },
    lineSwipeDown: {
        width: 30,
        height: 2.5,
        backgroundColor: '#ccc'
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
