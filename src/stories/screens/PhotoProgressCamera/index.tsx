import React, { Component } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Toast } from 'native-base';
import CameraView from './components/CameraView';
import OptionsBar from './components/OptionsBar';
import CameraCaptureSave from './components/CameraCaptureSave';
import CameraCaptureCancel from './components/CameraCaptureCancel';
import RNFetchBlob from 'rn-fetch-blob';
import { savePhotoProgress, updatePhotoProgress, completeProgressCameraTut } from './../../../container/PhotoProgressContainer/actions';
import { findArray } from '../../../utilities/Functions';
import i18n from '../../../common/i18n';
import { RNCamera } from 'react-native-camera';
import CameraViewChangeButton from './components/CameraViewChangeButton';
import CameraTimerButton from './components/CameraTimerButton';
import { WIDTH } from '../../../utilities/Theme';
import CoachMarkSlider from '../PhotoProgressCamera/components/CoachMarkSlider';

interface Props {
    navigation: any;
    store: any;
}
interface State {
    goalId: number;
    when: string; // before|after
    photoUri: string;
    goalName: string;
    showSelectButton: boolean;
    imageBase64: string;
    imageUri: string;
    photoProgresses: any,
    goals: any;
    type: any;
    timerTime: number;
    displayTimer: boolean;
    timer: number;
    isCoachMarkVisible: boolean;
}

export default class PhotoProgressCamera extends Component<Props, State> {

    camera: any = null;

    timerInstance: any;

    state = {
        goalId: 0,
        when: 'before',
        photoUri: '',
        goalName: '',
        showSelectButton: false,
        imageBase64: "",
        imageUri: "",
        photoProgresses: null,
        goals: [],
        type: RNCamera.Constants.Type.back,
        timerTime: 0,
        displayTimer: false,
        timer: 0,
        isCoachMarkVisible: false,
    };

    componentWillMount() {
        const { store } = this.props;
        let state = store.getState();
        let photoProgresses = state.photoProgress.photos;
        let goals = findArray(state.goals.goalsStarted, { is_finished: 0 });

        if (goals.length === 0) {
            Alert.alert(
                i18n.t('progress.no_goals_alert_title'),
                i18n.t('progress.no_goals_alert_description'),
                [
                    { text: i18n.t('progress.no_goals_go_back_btn_text'), onPress: () => this.props.navigation.goBack() },
                ]
            );
        }

        this.setState({ photoProgresses });
        this.setState({ goals });
    }

    componentDidMount() {
        let state = this.props.store.getState();
        let goals = findArray(state.goals.goalsStarted, { is_finished: 0 });
        let isCoachMarkVisible = state.photoProgress.showProgressCameraTut;
        if (goals.length > 0)
            this.setState({ isCoachMarkVisible });
    }

    setCamera(ref: any) {
        this.camera = ref;
    }

    setWhen(when: string) {
        this.setState({ when });
    }

    setGoal(goalId: number, goalName: string) {
        this.setState({ goalId, goalName });
    }

    async setAndSaveImageUri(imageUri: string) {
        const { store, navigation } = this.props;

        await this.setState({ imageUri });

        let photoProgress: any = {
            goal_id: this.state.goalId,
            caption: this.state.goalName,
            before_picture: "",
            after_picture: "",
        };

        if (this.state.when === 'before') {
            photoProgress['before_picture'] = this.state.imageUri;
        } else {
            photoProgress['after_picture'] = this.state.imageUri;
        }

        let foundPhoto = findArray(this.state.photoProgresses, { goal_id: this.state.goalId });

        if (foundPhoto.length > 0) {
            store.dispatch(updatePhotoProgress(photoProgress, this.state.when, foundPhoto[0]));
        } else {
            store.dispatch(savePhotoProgress(photoProgress));
        }

        navigation.goBack();

    }

    setTimer(timerTime: number) {
        this.setState({ timerTime, timer: timerTime });
    }

    decreasePhotoCounter() {
        let timer;
        if (this.state.timer > 0) {
            timer = this.state.timer - 1;
            this.setState({ timer });
        } else {
            clearInterval(this.timerInstance);
            this.setState({ timer: this.state.timer - 1, displayTimer: false });
            this.clickPhoto();
        }
    }

    /**
     * take picture
     */
    takePicture = async function () {

        if (this.camera !== null) {

            if (this.state.goalId === 0) {
                Toast.show({
                    text: i18n.t('progress.select_goal_notice_toast')
                });
                return;
            }

            if (this.state.timerTime > 0) {
                this.setState({ displayTimer: true });
                this.timerInstance = setInterval(() => this.decreasePhotoCounter(), 1000);
            } else {
                this.setState({ displayTimer: false });

                this.clickPhoto();

            }
        }
    }

    async clickPhoto() {
        const options = {
            quality: 1,
            base64: true,
            pauseAfterCapture: true,
            doNotSave: true,
            orientation: 'portrait',
            fixOrientation: true,
            forceUpOrientation: true,
        };

        const data = await this.camera.takePictureAsync(options);
        // console.log('takephoto', data);
        await this.setState({ imageBase64: data.base64 });
        this.setState({ showSelectButton: true });
    }

    savePhoto() {
        let date = new Date();
        let path = `${RNFetchBlob.fs.dirs.DocumentDir}/ballet_workout_${date.getMonth() + 1}_${date.getDate()}_${date.getFullYear()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.png`;
        RNFetchBlob.fs.writeFile(path, this.state.imageBase64, 'base64').then(() => {
            this.camera.resumePreview();
            this.setAndSaveImageUri(path);
        });
    }

    cancelPhoto() {
        this.camera.resumePreview();
        this.setState({ imageBase64: '' });
        this.setState({ showSelectButton: false });
    }

    changeCameraView(type: any) {
        this.setState({ type });
    }

    render() {
        const { store, navigation } = this.props;
        let photoType = navigation.getParam('photoType');
        return (
            <View style={styles.container}>
                <CameraView type={this.state.type} setCameraRef={this.setCamera.bind(this)} />
                {
                    !this.state.showSelectButton ||
                    <View style={styles.cameraCaptureSave}>
                        <CameraCaptureSave savePhoto={this.savePhoto.bind(this)} />
                    </View>
                }
                {
                    !this.state.showSelectButton ||
                    <View style={styles.cameraCaptureCancel}>
                        <CameraCaptureCancel cancelPhoto={this.cancelPhoto.bind(this)} />
                    </View>
                }

                <View style={styles.cameraChangeTimerBtn}>
                    <CameraTimerButton setTimer={this.setTimer.bind(this)} initialTimer={0} />
                </View>

                <View style={styles.cameraChangeViewBtn}>
                    <CameraViewChangeButton changeCameraView={this.changeCameraView.bind(this)} initialView="rear" />
                </View>

                {
                    !this.state.displayTimer ||
                    <View style={styles.cameraTimerWrapper}>
                        <Text style={styles.cameraTimerText} >{this.state.timer}</Text>
                    </View>
                }

                <OptionsBar
                    store={store}
                    goals={this.state.goals}
                    takePicture={this.takePicture.bind(this)}
                    setWhen={this.setWhen.bind(this)}
                    setGoal={this.setGoal.bind(this)}
                    photoType={photoType}
                    showSelectButton={this.state.showSelectButton} />

                <CoachMarkSlider visibility={this.state.isCoachMarkVisible} onCancel={() => this.onCoachMarkCancel()} />
            </View>
        );
    }

    onCoachMarkCancel() {
        this.setState({ isCoachMarkVisible: false });
        this.props.store.dispatch(completeProgressCameraTut());
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraCaptureSave: {
        flex: 0,
        position: 'absolute',
        top: 15,
        right: 15,
    },
    cameraCaptureCancel: {
        flex: 0,
        position: 'absolute',
        top: 15,
        left: 15,
    },
    cameraChangeViewBtn: {
        flex: 0,
        position: 'absolute',
        bottom: 95,
        right: 15,
    },
    cameraChangeTimerBtn: {
        flex: 0,
        position: 'absolute',
        bottom: 95,
        left: 15,
    },
    cameraTimerWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    },
    cameraTimerText: {
        color: "#fff",
        fontFamily: 'Montserrat-SemiBold',
        fontSize: WIDTH * .35
    }
});
