import React, { Component } from 'react';
import { View, StyleSheet, Modal, Text } from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { HEIGHT, WIDTH, PADDING_LEFT_RIGHT } from '../../../../utilities/Theme';
import { isIpad, isIphoneSe, isIPhoneX } from '../../../../utilities/Screen';
import Image1 from './../../../../assets/images/coach_marks/camera_screen_1.png';
import Image2 from './../../../../assets/images/coach_marks/camera_screen_2.png';
import Image3 from './../../../../assets/images/coach_marks/camera_screen_3.png';
import { Button } from 'native-base';
import AutoScaleLocalImage from '../../../../common/components/AutoScaleLocalImage';

interface Props {
    visibility: boolean;
    onCancel: Function;
    store?: any;
}
interface State {
    entries: any;
    activeSlide: number;
}

export default class CoachMarkSlider extends Component<Props, State> {
    
    state = {
        entries: [
            Image1,
            Image2,
            Image3,
        ],
        activeSlide: 0,
    };

    _renderItems({ item, index }) {
        return (
            <View key={index} style={styles.item}>
                <AutoScaleLocalImage height={null} width={WIDTH - (PADDING_LEFT_RIGHT * 2)} style={styles.carouselImage} uri={item} />
            </View>
        );
    }

    get pagination () {
        const { entries, activeSlide } = this.state;
        return (
            <Pagination
              dotsLength={entries.length}
              activeDotIndex={activeSlide}
              containerStyle={styles.paginationContainer}
              dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.92)'
              }}
              inactiveDotStyle={{
                  // Define styles for inactive dots here
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
        );
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
                visible={this.props.visibility}>

                <View style={styles.modalContainer}>

                    <View style={styles.modalContent}>

                        <View style={styles.slidesContainer}>
                            {/* <ImageSlider images={[
                                Image1,
                                Image2,
                                Image3,
                            ]} /> */}

                            <Carousel
                                data={this.state.entries}
                                renderItem={this._renderItems.bind(this)}
                                sliderWidth={WIDTH}
                                itemWidth={WIDTH - (PADDING_LEFT_RIGHT * 2)}
                                onSnapToItem={(index) => this.setState({ activeSlide: index })} />
                            {this.pagination}
                        </View>

                        <View style={styles.closeButtonWrapper}>
                            <Button onPress={() => this.props.onCancel()} transparent style={styles.closeBtn}>
                                <Text style={styles.closeBtnTxt}>Skip Tutorial</Text>
                            </Button>
                        </View>

                    </View>
                </View>
            </Modal>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContainer: {
        flex: 0,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        width: isIphoneSe ? WIDTH : isIpad ? WIDTH - (PADDING_LEFT_RIGHT * 2) : WIDTH,
        height: HEIGHT
    },
    modalContent: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.9)',
        borderRadius: 10,
    },
    item: {
        flex: 1,
        alignSelf: 'stretch',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    carouselImage: {
        resizeMode: 'contain',
    },
    slidesContainer: {
        flex: 1,
    },
    closeButtonWrapper: {
        flex: 0,
        position: 'absolute',
        bottom: isIPhoneX? 45: 30,
        // right: 25,
        alignSelf: 'center',
    },
    closeBtn: {
        borderWidth: 2,
        borderColor: '#fff',
        paddingLeft: 45,
        paddingRight: 45
    },
    closeBtnTxt: {
        color: '#fff',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18
    },
    paginationContainer: {
        backgroundColor: 'transparent',
    }
});
