import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Content, Container, Spinner } from 'native-base';
import { PADDING_LEFT_RIGHT, WIDTH, SECONDARY_COLOR } from './../../../../utilities/Theme';
import loader from './../../../../assets/images/loader.gif';
import Video from 'react-native-video';
import { Viewport } from '@skele/components';
import eventsConstants from './../eventConstants';
import Loader from '../../../../common/components/Loader';

const ViewportAwareView = Viewport.Aware(View)

interface Props {
    source: any;
    isModalVisible: false;
    eventsEmitter: any;
};
interface State {
    isPaused: boolean;
    isMuted: boolean;
    showPoster: boolean;
    inViewPort: boolean;
    duration: any;
    isStarted: boolean;
    isNextVideoStarted: boolean;
    isBufferring: boolean;
};

export default class ExerciseVideo extends Component<Props, State> {

    _player: any = null;
    mainTimerInstance: any = null;

    state = {
        isPaused: true,
        isMuted: false,
        showPoster: true,
        inViewPort: false,
        duration: 0,
        isStarted: false,
        isNextVideoStarted: false,
        isBufferring: false,
    };

    constructor(props: any) {
        super(props);
        this.props.eventsEmitter.on(eventsConstants.VIDEO_PAUSED, () => this._onVideoPaused());
        this.props.eventsEmitter.on(eventsConstants.VIDEO_RESUMED, () => this._onVideoResumed());
        this.props.eventsEmitter.on(eventsConstants.WAIT_TIMER_MODAL_CLOSED, () => this._onModalClosed());
        this.props.eventsEmitter.on(eventsConstants.VIDEO_MUTED, () => this._onVideoMuted());
        this.props.eventsEmitter.on(eventsConstants.VIDEO_UNMUTED, () => this._onVideoUnMuted());
        this.props.eventsEmitter.on(eventsConstants.VIDEO_NEXT, () => this._onVideoNext());
        this.props.eventsEmitter.on(eventsConstants.VIDEO_SESSION_COMPLETED, (data: any) => this._onVideoPaused());
    }

    _onModalClosed() {
        this.setState({ isPaused: false });
    }

    _onVideoPaused() {
        this.setState({ isPaused: true });
    }

    _onVideoResumed() {
        this.setState({ isPaused: false });
    }

    _onVideoMuted() {
        this.setState({ isMuted: true });
    }

    _onVideoUnMuted() {
        this.setState({ isMuted: false });
    }

    _onVideoNext() {
        this.setState({ isNextVideoStarted: true });
    }

    _onReadyForDisplay() {
        this.setState({ showPoster: false });
    }

    _onVideoStartedPlaying(progress: any) {
        this.setState({ showPoster: false });
        if (progress.currentTime === 0 && !this.state.isStarted) { // current time is 0 and video not started
            this.setState({ isStarted: true })
            this.props.eventsEmitter.emit(eventsConstants.VIDEO_STARTED, {
                duration: parseInt(this.state.duration)
            });
            this.setState({ showPoster: false });
        } else if (progress.currentTime === 0 && this.state.isNextVideoStarted) {
            this.setState({ isNextVideoStarted: false });
            this.props.eventsEmitter.emit(eventsConstants.VIDEO_STARTED, {
                duration: parseInt(this.state.duration)
            });
            this.setState({ showPoster: false });
        } else if (progress.currentTime > 0 && this.state.isStarted && this.state.isBufferring) {
            this.setState({ isBufferring: false, showPoster: false });
            this.props.eventsEmitter.emit(eventsConstants.VIDEO_RESUMED, true);
        }
    }

    _onVideoBuffering() {
        this.props.eventsEmitter.emit(eventsConstants.VIDEO_BUFFERING);
        this.setState({ isBufferring: true, showPoster: true });
    }

    _onVideoEnd() {
        this.props.eventsEmitter.emit(eventsConstants.VIDEO_NEXT, true);
    }

    _setDuration(item: any) {
        this.setState({ duration: item.duration })
    }

    render() {
        return (
            <View style={[styles.container]}>
                {/* {!this.state.showPoster || <Loader />} */}
                <Video style={styles.video}
                    ref={ref => this._player = ref}
                    resizeMode='cover'
                    paused={this.state.isPaused}
                    muted={this.state.isMuted}
                    source={this.props.source}
                    onBuffer={() => this._onVideoBuffering()}
                    onLoad={(item) => this._setDuration(item)}
                    playInBackground={false}
                    ignoreSilentSwitch={"ignore"}
                    onEnd={() => this._onVideoEnd()}
                    hideShutterView={true}
                    bufferConfig={{
                        minBufferMs: 5000,
                        maxBufferMs: 20000,
                        bufferForPlaybackMs: 2500,
                        bufferForPlaybackAfterRebufferMs: 5000
                    }}
                    // onSeek={()=> console.log('onSeek function of video in ExerciseVideo.tsx')}
                    //onReadyForDisplay={() => this._onReadyForDisplay()}
                    onProgress={(progress: any) => this._onVideoStartedPlaying(progress)}
                />

                {
                    !this.state.showPoster ||
                    <View style={styles.poster}>
                        <Spinner color={SECONDARY_COLOR} />
                    </View>
                }
            </View>
        );
    }

    componentWillUnmount() {
        if (this._player) {
            this._player.seek(0);
        }
        this.setState({ isPaused: true });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingLeft: PADDING_LEFT_RIGHT,
        // paddingRight: PADDING_LEFT_RIGHT,
        alignSelf: 'stretch',
        justifyContent: 'flex-end',
    },
    video: {
        height: (WIDTH) * .75,
        width: WIDTH,
    },    
    poster: {
        position: "absolute",
        top: 0,
        left: 0,
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',        
        backgroundColor: 'rgba(255,255,255, 0.5)',
        height: "100%",
        width: "100%"
    }
});
