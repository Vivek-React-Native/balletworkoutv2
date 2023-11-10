import React, { Component } from 'react';
import { View } from 'react-native';
import { Container } from 'native-base';
import SubHeader from './components/SubHeader';
import Title from './components/Title';
import ExerciseVideo from './components/ExerciseVideo';
import ControlsBar from './components/ControlsBar';
import { Viewport } from '@skele/components';
import TimerModal from './components/TimerModal';
import CompletionModal from './components/CompletionModel';
import EventsEmmiter from 'events';
import eventConstants from './eventConstants';
import { baseServerUri } from '../../../common/appConstants';
import KeepAwake from 'react-native-keep-awake';
import { AppEventsLogger } from 'react-native-fbsdk';

interface Props {
    navigation: any;
    updateGoalDispatch: Function;
    store: any;
};
interface State {
    isModalVisible: boolean;
    videos: any;
    currentVideo: number;
    subCategoryType: string;
    exerciseType: string;
};

let videoUrls: any = [];

export default class Exercise extends Component<Props, State> {

    state = {
        isModalVisible: true,
        videos: [],
        currentVideo: 0,
        subCategoryType: '',
        exerciseType: ''
    };

    isloggedFirstActivity: boolean = false;

    navigationCallback: any;

    eventsEmitter = new EventsEmmiter();

    constructor(props: any) {
        super(props);

        /** setting videos from navigation */
        let videos = this.props.navigation.getParam('data');
        let subCategory = this.props.navigation.getParam('subCategory');

        if (videos.length > 0) {
            videos.map((video: any, index: number) => {
                videoUrls.push({ title: video.title, uri: baseServerUri + video.video_dir + video.video_file })
            });
        }
        /** ! setting videos from navigation */

        this.eventsEmitter.on(eventConstants.VIDEO_NEXT, () => {
            if (this.state.currentVideo < (videoUrls.length - 1)) {
                let newVideo = this.state.currentVideo + 1;
                this.setState({ currentVideo: newVideo }, () => {
                    // Log FB events
                    AppEventsLogger.logEvent('View content', {
                        "Content ID": subCategory.name + ": " + this.state.videos[this.state.currentVideo].title,
                        "Content Type": "Video"
                    });
                });
            } else if (this.state.currentVideo == (videoUrls.length - 1)
                && (this.state.exerciseType !== 'SINGLE_EXERCISE' && this.state.exerciseType === 'MULTIPLE_EXERCISES')) {

                this.eventsEmitter.emit(eventConstants.VIDEO_SESSION_COMPLETED, {
                    subCategoryType: this.state.subCategoryType,
                    exerciseType: this.state.exerciseType,
                    subCategory: subCategory,
                });

                this._onSessionEnd(subCategory, this.state.subCategoryType);

            } else if (this.state.currentVideo == (videoUrls.length - 1) && this.state.exerciseType === 'SINGLE_EXERCISE') {
                //this.props.navigation.goBack();
                this.props.navigation.goBack();
                //this.props.navigation.navigate('exercises', {id: subCategory.id, subCategoryType: this.state.subCategoryType, subCategory: subCategory})
            }
        });
    }

    componentWillMount() {
        this.setState({ videos: videoUrls });
        let subCategory = this.props.navigation.getParam('categoryType');
        this.setState({ subCategoryType: subCategory });

        let type = this.props.navigation.getParam('type');
        this.setState({ exerciseType: type });
        this.navigationCallback = this.props.navigation.getParam('callback');

        if (typeof this.navigationCallback === 'function') {
            this.navigationCallback();
        }

        KeepAwake.activate();
    }

    _onSessionEnd(subCategory: any, subCategoryType: string) {
        if (subCategoryType === 'GOAL') {
            this.props.updateGoalDispatch(subCategory);
        }
    }

    componentWillUnmount() {
        KeepAwake.deactivate();
        videoUrls = [];
        this.setState({ currentVideo: 0 });
        this.setState({ videos: [] });

        if (typeof this.navigationCallback === 'function') {
            this.navigationCallback();
        }
    }

    render() {
        const { navigation } = this.props;

        if(!this.isloggedFirstActivity) {
            let subCategory = this.props.navigation.getParam('subCategory');
            AppEventsLogger.logEvent('View content', {
                "Content ID": subCategory.name + ": " + this.state.videos[this.state.currentVideo].title,
                "Content Type": "Video"
            });
            this.isloggedFirstActivity = true;
        }

        return (
            <Container>
                {/* <SubHeader eventsEmitter={this.eventsEmitter} /> */}
                <Title title={this.state.videos[this.state.currentVideo].title} />
                <ExerciseVideo eventsEmitter={this.eventsEmitter} source={{ uri: this.state.videos[this.state.currentVideo].uri }} />
                <ControlsBar exerciseType={navigation.getParam('type')} eventsEmitter={this.eventsEmitter} />
                {/*<TimerModal eventsEmitter={this.eventsEmitter} />*/}
                <CompletionModal navigation={this.props.navigation} eventsEmitter={this.eventsEmitter} />
            </Container>
        );
    }
}
