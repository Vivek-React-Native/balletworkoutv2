import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { SECONDARY_COLOR, PRIMARY_COLOR } from '../../../../utilities/Theme';
import { RNCamera } from 'react-native-camera';

interface Props {
    setTimer: Function;
    initialTimer: number;
};
interface State {
    timer: number;
    index: number;
};

export default class CameraTimerButton extends Component<Props, State> {

    state = {
        timer: this.props.initialTimer || 0,
        index: 0,
    }

    timerSettings: any = [0, 5, 10, 15, 30];

    changeTimer() {
        let count = this.timerSettings.length;

        if(this.state.index < count && this.state.index !== count-1) {
            let index = this.state.index;
            let timer = this.timerSettings[index+1];
            this.setState({timer: timer, index: index+1 });
            this.props.setTimer(timer);
        } else {
            let index = 0;
            let timer = this.timerSettings[index];
            this.setState({timer: timer, index: index });
            this.props.setTimer(timer);
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <Button transparent style={styles.cameraBtn} onPress={() => this.changeTimer()}>
                    <Icon style={styles.icon} name="md-stopwatch" color={SECONDARY_COLOR}/><Text style={{color: SECONDARY_COLOR}}> {this.state.timer}</Text>
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
        // width: 45,
        // height: 45,
        // borderRadius: 22.5,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
