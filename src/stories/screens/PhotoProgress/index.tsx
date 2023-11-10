import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback, Text, Animated, Platform } from 'react-native';
import PhotoView from 'react-native-photo-view-ex';

import CameraBtn from './components/CameraBtn';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Icon from 'react-native-vector-icons/Ionicons';
import { HEIGHT, SECONDARY_COLOR, WIDTH, PRIMARY_COLOR } from '../../../utilities/Theme';
import BottomPanelContent from './components/BottomPanelContent';
import Loader from '../../../common/components/Loader';
import { captureRef } from "react-native-view-shot";
import Share from 'react-native-share';
import ShareBtn from './components/ShareBtn';
import { isIPhoneX, isIPhone } from '../../../utilities/Screen';
import logoImage from './../../../assets/images/logo.png';
import i18n from '../../../common/i18n';
import PinchZoomView from '../../../common/components/PinchZoomView';
import CoachMarkSlider from './components/CoachMarkSlider';
import { completePhotoProgressTut } from '../../../container/PhotoProgressContainer/actions';

interface Props {
    navigation: any;
    store: any;
    draggableRange: any;
    start: Function;
}
interface State {
    photos: any;
    selectedImage: string;
    selectedBeforeImage: string;
    selectedAfterImage: string;
    isLoading: boolean;
    imageWidth: number;
    imageHeight: number;
    finalImageWidth: number;
    anyPictureMissing: boolean;
    loadedBefore: boolean;
    loadedAfter: boolean;
    isPanelOpen: boolean;
    isCoachMarkVisible: boolean;
}

const slideUpPanelBottom: number = !isIPhoneX ? 70 : 265;

export default class PhotoProgress extends Component<Props, State> {

    unSubscribeStore: Function;

    photoView: any;

    walkthroughEnd: boolean = true;

    _panel: any;
    _draggedValue = new Animated.Value(0);
    static defaultProps = {
        draggableRange: {
            top: HEIGHT *.57,
            bottom: slideUpPanelBottom
        }
    }

    isFocused: boolean = false;

    state = {
        photos: [],
        selectedImage: "",
        selectedBeforeImage: "",
        selectedAfterImage: "",
        anyPictureMissing: false,
        finalImageWidth: 0,
        isLoading: false,
        imageWidth: 0,
        imageHeight: 0,
        loadedBefore: false,
        loadedAfter: false,
        isPanelOpen: false,
        isCoachMarkVisible: false,
    };

    onPanelToggle(state: boolean) {
        this.setState({ isPanelOpen: state });
    }

    componentDidMount() {

        const { store } = this.props;

        let state = store.getState();
        let isCoachMarkVisible = state.photoProgress.showPhotoProgressTut;
        this.setState({ isCoachMarkVisible });

        this.isFocused = true;
        let photos = state.photoProgress.photos;
        // console.log('store.getState().photoProgress:', state.photoProgress);

        this.setState({ photos });

        this.unSubscribeStore = store.subscribe(() => {
            let photos = store.getState().photoProgress.photos;

            this.setState({ photos });
        });
    }

    _cameraButtonClickHandler(photoType?: string) {
        const { navigation } = this.props;
        if (photoType) {
            navigation.navigate('progressCamera', { photoType });
        } else {
            navigation.navigate('progressCamera', { photoType: 'before' });
        }
    }

    _shareButtonClickHandler() {
        if (this.state.selectedImage !== "") {
            const shareOptions = {
                title: 'Share file',
                url: this.state.selectedImage,
            };
            return Share.open(shareOptions);
        }
    }

    async selectImage(beforeImage: string, afterImage: string) {
        this.setState({ selectedImage: "", isPanelOpen: false });
        // console.log('before', beforeImage, 'after')
        if (beforeImage === "" || afterImage === "") {
            this.setState({ anyPictureMissing: true });
        }

        if (beforeImage !== '' && afterImage !== '') {
            // console.log('if Block')
            this.setState({ selectedBeforeImage: 'file://' + beforeImage, selectedAfterImage: 'file://' + afterImage });
            await Image.getSize('file://' + beforeImage, (imageWidth, imageHeight) => this.setState({ imageWidth, imageHeight }));

            // let imagetWidth = PixelRatio.getPixelSizeForLayoutSize(this.state.imageWidth);

        } else if (beforeImage !== '') {
            // console.log('else if Block 1')
            this.setState({ selectedBeforeImage: 'file://' + beforeImage, loadedAfter: true });
        } else if (afterImage !== '') {
            // console.log('else if Block 2')
            this.setState({ selectedAfterImage: 'file://' + afterImage, loadedBefore: true });
        }
        let { bottom } = this.props.draggableRange;

        //this._panel.transitionTo(bottom);

    }

    takeAShot() {
        if (this.state.loadedAfter && this.state.loadedBefore) {

            captureRef(this.photoView, {
                format: 'png',
                result: 'data-uri',
                quality: 1
            }).then((data: any) => {
                this.setState({ selectedImage: data });
            });
        }
    }

    shareImage() {
        if (this.state.selectedImage !== "") {
            const shareOptions = {
                title: 'Share file',
                url: this.state.selectedImage,
            };
            return Share.open(shareOptions);
        }
    }

    render() {
        // console.log(this.state.selectedBeforeImage, this.state.selectedAfterImage);
        return (
            <View style={styles.container}>
                {!this.state.isLoading || <Loader />}
                <View style={styles.innerContainer}>
                    {
                        this.state.selectedImage === "" ||
                        <View style={styles.shareBtnWrapper}>
                            <ShareBtn clickHandler={this._shareButtonClickHandler.bind(this)} />
                        </View>
                    }
                    <View style={styles.cameraBtnWrapper}>
                        <CameraBtn clickHandler={this._cameraButtonClickHandler.bind(this)} />
                    </View>
                    <View ref={(ref => this.photoView = ref)} collapsable={false} style={styles.imagePreview}>

                        {
                            this.state.selectedImage === "" && this.state.selectedBeforeImage === "" && this.state.selectedAfterImage === "" ?
                                <View style={styles.introTextWrapper}><Text style={styles.introText}>{i18n.t('progress.photo_progress_into_text')}</Text></View> : null
                        }

                        {
                            this.state.selectedImage === "" && this.state.selectedBeforeImage !== "" ?
                                <Image
                                    onLoadStart={async () => await this.setState({ loadedBefore: false })}
                                    onLoadEnd={async () => { await this.setState({ loadedBefore: true }); this.takeAShot() }}
                                    onLoad={() => this.takeAShot()}
                                    fadeDuration={0}
                                    style={styles.imagePreviewImage}
                                    source={{ uri: this.state.selectedBeforeImage }} />
                                : null
                        }

                        {
                            this.state.selectedImage === "" && this.state.selectedAfterImage !== "" ?
                                <Image
                                    onLoadStart={async () => await this.setState({ loadedAfter: false })}
                                    onLoadEnd={async () => { await this.setState({ loadedAfter: true }); this.takeAShot() }}
                                    onLoad={() => this.takeAShot()}
                                    fadeDuration={0}
                                    style={styles.imagePreviewImage}
                                    source={{ uri: this.state.selectedAfterImage }} />
                                : null
                        }

                        {
                            this.state.selectedImage === "" ||
                            <TouchableWithoutFeedback>
                                {
                                    Platform.OS === 'android' ?
                                        <PhotoView
                                            source={{ uri: this.state.selectedImage === '' ? '' : this.state.selectedImage }}
                                            minimumZoomScale={0.5}
                                            maximumZoomScale={3}
                                            scale={1}
                                            resizeMode="center"
                                            //onLoad={() => console.log("Image loaded!")}
                                            style={{ width: WIDTH, height: '100%', }}
                                        /> :
                                        <PinchZoomView maxScale={3}>
                                            <Image source={{ uri: this.state.selectedImage }} style={{ width: WIDTH, height: '100%', resizeMode: 'center' }} />
                                        </PinchZoomView>
                                }
                            </TouchableWithoutFeedback>
                        }

                        {
                            this.state.selectedImage === "" && (this.state.selectedAfterImage !== "" || this.state.selectedBeforeImage !== "") ?
                                <View style={{ zIndex: 9999, position: "absolute", alignSelf: 'center', top: '65%', width: WIDTH, height: 20 }}>
                                    <Image source={logoImage} style={{ width: "100%", height: "100%", resizeMode: 'contain' }} />
                                    <View style={styles.beforeAfterCaptionWrapper}>
                                        <View style={styles.beforeAfterCaption}><Text style={styles.beforeAfterCaptionText}>Before</Text></View>
                                        <View style={styles.beforeAfterCaption}><Text style={styles.beforeAfterCaptionText}>After</Text></View>
                                    </View>
                                </View> : null
                        }

                    </View>
                </View>

                <SlidingUpPanel
                    snappingPoints={[this.props.draggableRange.top, this.props.draggableRange.bottom]}
                    friction={.2}
                    showBackdrop={true}
                    backdropOpacity={0.5}
                    ref={c => this._panel = c}
                    height={HEIGHT * .57}
                    draggableRange={this.props.draggableRange}
                    animatedValue={this._draggedValue}>
                    <View style={styles.panel}>
                        <View style={styles.panelHeader}>
                            {this._renderFavoriteIcon()}
                            <Text style={styles.bottomUpPanelHeaderText}>{i18n.t('progress.my_photos')}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff', marginLeft: 0 }}>
                            <BottomPanelContent
                                clickHandler={this._cameraButtonClickHandler.bind(this)}
                                selectImage={this.selectImage.bind(this)}
                                photos={this.state.photos}
                            />
                        </View>
                    </View>
                </SlidingUpPanel>

                <CoachMarkSlider visibility={this.state.isCoachMarkVisible} onCancel={() => this.onCoachMarkCancel()} />
            </View>
        );
    }
    componentDidUpdate() {
        const { isFocused } = this.props.navigation;
        // console.log('component updated', isFocused());
        if (isFocused() && !this.isFocused) {
            this.isFocused = true;
            this.setState({ selectedImage: '', selectedBeforeImage: '', selectedAfterImage: '' });
        } else if (!isFocused()) {
            this.isFocused = false;
            let { bottom } = this.props.draggableRange;
            //this._panel.transitionTo(bottom);
        }
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    onCoachMarkCancel() {
        this.setState({ isCoachMarkVisible: false });
        this.props.store.dispatch(completePhotoProgressTut());
    }

    onDragEvent(value: any) {

        let { top, bottom } = this.props.draggableRange;
        // console.log('dragging..');
        if (value <= bottom + 100) {
            this._draggedValue.setValue(bottom);
        } else if (value >= top - 80) {
            this._draggedValue.setValue(top);
        } else {
            this._draggedValue.setValue(value);
        }
    }

    _renderFavoriteIcon() {
        const { top, bottom } = this.props.draggableRange

        const draggedValue = this._draggedValue.interpolate({
            inputRange: [bottom + 50, top - 50],
            outputRange: ['0deg', '180deg'],
            extrapolate: 'clamp'
        })

        const transform = [{ rotate: draggedValue }]

        return (
            <Animated.View style={[styles.favoriteIcon, { transform }]}>
                <Icon name={"ios-arrow-up"} style={{ color: "white" }} size={30} />
            </Animated.View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
    },
    imagePreview: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: WIDTH,
        flexDirection: 'row',
        height: "100%",
        backgroundColor: '#fff',
    },
    cameraBtnWrapper: {
        flex: 0,
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 999
    },
    shareBtnWrapper: {
        flex: 0,
        position: 'absolute',
        top: 15,
        left: 15,
        zIndex: 999
    },
    imagePreviewImage: {
        flex: 1,
        width: WIDTH * 0.5,
        height: "100%",
        resizeMode: 'contain'
    },

    panel: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
        bottom: 0,
    },
    panelHeader: {
        height: isIPhone ? 80 : 72,
        backgroundColor: SECONDARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    favoriteIcon: {
        zIndex: 1
    },
    beforeAfterCaptionWrapper: {
        flex: 1,
        alignSelf: 'stretch',
        width: "100%",
        flexDirection: 'row',
        marginTop: '7%',
    },
    beforeAfterCaption: {
        flex: 1,
        alignItems: 'center'
    },
    beforeAfterCaptionText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: WIDTH * .045,
        color: PRIMARY_COLOR
    },
    introTextWrapper: {
        flex: 1,
        alignSelf: 'stretch',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    introText: {
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
    },
    bottomUpPanelHeaderText: {
        fontFamily: 'Montserrat-SemiBold',
        color: '#fff',
        marginLeft: 10,
        fontSize: 18,
    }
});
