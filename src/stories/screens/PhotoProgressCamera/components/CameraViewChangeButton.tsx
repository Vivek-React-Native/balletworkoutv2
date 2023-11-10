import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { SECONDARY_COLOR, PRIMARY_COLOR } from '../../../../utilities/Theme';
import { RNCamera } from 'react-native-camera';

interface Props {
    changeCameraView: Function;
    initialView: string;
    
};
interface State {
    view: string;
};

export default class CameraViewChangeButton extends Component<Props, State> {

    state = {
        view: this.props.initialView || 'rear',
    }

    changeCameraView() {
        if(this.state.view === 'rear') {
            this.props.changeCameraView(RNCamera.Constants.Type.front);
            this.setState({view: 'front'});
        } else if(this.state.view === 'front') {
            this.props.changeCameraView(RNCamera.Constants.Type.back);
            this.setState({view: 'rear'});
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Button style={styles.cameraBtn} onPress={() => this.changeCameraView()}>
                    <Icon style={styles.icon} name="ios-reverse-camera" color={SECONDARY_COLOR} />
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
