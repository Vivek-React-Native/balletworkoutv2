import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';

interface Props {
    setCameraRef: Function;
    type: any,
}
interface State { }

export default class CameraView extends Component<Props, State> {

    camera: any;

    render() {
        const { setCameraRef } = this.props;
        return (
            <View style={styles.contianer}>
                    <RNCamera
                        ref={ref => setCameraRef(ref)}
                        style={styles.preview}
                        type={this.props.type}
                        flashMode={RNCamera.Constants.FlashMode.auto}
                        permissionDialogTitle={'Permission to use camera'}
                        permissionDialogMessage={'We need your permission to use your phone\'s camera'}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contianer: {
        flex: 1,
        backgroundColor: 'black',
        flexDirection: 'column',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
});
