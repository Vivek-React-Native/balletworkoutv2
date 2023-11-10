import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { SECONDARY_COLOR, PRIMARY_COLOR } from '../../../../utilities/Theme';

interface Props {
    savePhoto: Function
};
interface State { };

export default class CameraCaptureSave extends Component<Props, State> {

    render() {
        const { savePhoto } = this.props;
        return (
            <View style={styles.container}>
                <Button style={styles.cameraBtn} onPress={() => savePhoto()}>
                    <Icon style={styles.icon} name="ios-checkmark" color={SECONDARY_COLOR} />
                </Button>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
    },
    icon: {
        fontSize: 35
    },
    cameraBtn: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
