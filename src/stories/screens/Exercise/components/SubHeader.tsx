import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PADDING_LEFT_RIGHT } from './../../../../utilities/Theme';
import { isIPhone } from './../../../../utilities/Screen';
import { toHHMMSS } from './../../../../utilities/Functions';
import eventConstants from './../eventConstants';

interface Props {
    eventsEmitter: any;
}
interface State {
    /**
    * Timer states
    */
    isTimerStarted: boolean;
    timer: number;
    isTimerPaused: boolean;
    isTimerInitialized: boolean;
    duration: number;
}

export default class SubHeader extends Component <Props, State> {


    mainTimerInstance:any = null;

    state = {
        isTimerPaused: true,
        isTimerStarted: false,
        timer: 0,
        isTimerInitialized: false,
        duration: 0,
    };

    constructor(props: any) {
        super(props);
        this._videoStartlistner();
        this._videoPauseListener();
        this._videoResumeListener();
        this._videoNextListner();
        this._videoBufferingListener();
    }

    _videoStartlistner() {
        this.props.eventsEmitter.on(eventConstants.VIDEO_STARTED, (data: any) => {
            this.setState({duration: data.duration + this.state.timer});
            this._initializeTimer();
        });
    }

    _videoPauseListener() {
        this.props.eventsEmitter.on(eventConstants.VIDEO_PAUSED, () => {
            this.setState({isTimerPaused: true});
        });
    }

    _videoResumeListener() {
        this.props.eventsEmitter.on(eventConstants.VIDEO_RESUMED, () => {
            this.setState({isTimerPaused: false});
        });
    }

    _videoNextListner() {
        this.props.eventsEmitter.on(eventConstants.VIDEO_NEXT, () => {
            this.setState({isTimerPaused: true});
        });
    }

    _videoBufferingListener() {
        this.props.eventsEmitter.on(eventConstants.VIDEO_BUFFERING, () => {
            this.setState({isTimerPaused: true});
        });
    }

    _initializeTimer() {
        this.setState({isTimerStarted: true, isTimerPaused: false, isTimerInitialized: true});
        if(this.mainTimerInstance === null) {
            this.mainTimerInstance = setInterval(() => this._increaseTimer(), 1000);
        }
    }

    _increaseTimer() {
        if(this.state.timer < this.state.duration) {
            if(!this.state.isTimerPaused) {
                let timerVal = this.state.timer + 1;
                this.setState({timer: timerVal});
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={[styles.timer]}>{ toHHMMSS(this.state.timer) }</Text>
            </View>
        );
    }

    componentWillUnmount() {
        clearInterval(this.mainTimerInstance);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        backgroundColor: '#D2959F',
        height: isIPhone? 80: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timer: {
        fontSize: 35,
        color: '#464c6e',
        fontFamily: 'Montserrat-Bold',
    }
});
