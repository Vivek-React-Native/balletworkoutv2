import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import eventConstants from './../eventConstants';

interface Props {
    eventsEmitter: any;
    exerciseType: string;
};
interface State {
    isPaused: boolean;
    isMuted: boolean;
    pauseIcon: string;
    muteIcon: string;
};

export default class ControlsBar extends Component<Props, State> {

    state = {
        isPaused: false,
        isMuted: false,
        pauseIcon: "pause",
        muteIcon: "volume-high",
    };

    _onPauseButton() {
        if(!this.state.isPaused) {
            this.setState({isPaused: !this.state.isPaused})
            this.props.eventsEmitter.emit(eventConstants.VIDEO_PAUSED, true);
            this.setState({pauseIcon: "play"});
        } else {
            this.setState({isPaused: !this.state.isPaused})
            this.props.eventsEmitter.emit(eventConstants.VIDEO_RESUMED, false);
            this.setState({pauseIcon: "pause"});
        }
    }

    _onMuteButton() {
        if(!this.state.isMuted) {
            this.setState({isMuted: !this.state.isMuted})
            this.props.eventsEmitter.emit(eventConstants.VIDEO_MUTED, true);
            this.setState({muteIcon: "volume-off"});
        } else {
            this.setState({isMuted: !this.state.isMuted})
            this.props.eventsEmitter.emit(eventConstants.VIDEO_UNMUTED, false);
            this.setState({muteIcon: "volume-high"});
        }
    }

    _onNextButton() {
        this.props.eventsEmitter.emit(eventConstants.VIDEO_NEXT, true);
    }

    render() {

        const { exerciseType } = this.props;

        return (
            <View style={styles.container}>
                <View>
                    <Button style={styles.buttonWrapper} onPress={() => this._onPauseButton()}>
                        <Icon style={styles.icons} name={this.state.pauseIcon} />
                    </Button>
                </View>
                <View>
                    <Button style={styles.buttonWrapper} onPress={() => this._onMuteButton()}>
                        <Icon style={styles.icons} name={this.state.muteIcon} />
                    </Button>
                </View>

                <View>
                    <Button style={styles.buttonWrapper} onPress={() => this._onNextButton()}>
                        <Icon style={styles.icons} name="arrow-right" />
                    </Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-around',
        marginBottom: 25,
        marginTop: 15,
    },
    buttonWrapper: {
        flex: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#464c6e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icons: {
        color: '#ffffff',
        fontSize: 25,
        fontWeight: '100',
    }
});
