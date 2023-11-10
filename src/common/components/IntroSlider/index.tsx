import React, { Component } from 'react';
import { View, StatusBar, Image, StyleSheet, Platform, Text } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import { HEIGHT, WIDTH, PADDING_LEFT_RIGHT, PRIMARY_COLOR, SECONDARY_COLOR } from '../../../utilities/Theme';
import image1 from './../../../assets/images/intro-slider-images/image1.png';
import image3 from './../../../assets/images/intro-slider-images/image3.png';
import image4 from './../../../assets/images/intro-slider-images/image4.png';

interface Props {
    onDoneCallback: Function;
    onSkipCallback: Function;
    onNavigateCallback: Function;
};
interface State { };

export default class IntroSlider extends Component<Props, State> {

    static navigationOptions = {
        headerShown: false,
    };

    slides: any = [
        {
            key: 'image1',
            image: image1,
            title: "Get Fit & Flexible",
            content: "Choose to train and stretch different body parts or do full body workouts.",
        },
        {
            key: 'image3',
            image: image3,
            title: "Set Goals",
            content: "Do the split in a few weeks. Get reminded to exercise daily.",
        },
        {
            key: 'image4',
            image: image4,
            title: "Ballet Specials",
            content: "Start the day with a better posture, stretch in bed, learn the basics of ballet, get motivated by your ballet teacher.",
        }
    ];

    _onDone() {
        if (this.props.onDoneCallback) {
            this.props.onDoneCallback()
        }
    }

    _onSkip() {
        if (this.props.onSkipCallback) {
            this.props.onSkipCallback();
        }
    }
    _onNavigationCallback(screen: string) {
        if (this.props.onNavigateCallback) {
            this.props.onNavigateCallback(screen);
        }
    }

    renderItem(item: any) {
        return (
            <View style={styles.itemContainer}>
                <StatusBar
                    hidden
                    barStyle="light-content" />

                <Image source={item.item.image} style={styles.imageBackground} />

                <LinearGradient colors={['rgba(70,76,110,.75)', 'rgba(210,149,159,0.5)']} style={styles.gradient} />
                <View style={styles.slideContent}>
                    <Text style={styles.title}>{item.item.title}</Text>
                    <Text style={styles.contentText}>{item.item.content}</Text>
                </View>
            </View>
        );
    }

    render() {
        const { slides } = this;
        return (
            <View style={styles.container}>
                <AppIntroSlider
                    data={slides}
                    showSkipButton={true}
                    onDone={this._onDone.bind(this)}
                    onSkip={this._onSkip.bind(this)}
                    renderItem={this.renderItem.bind(this)}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    itemContainer: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'transparent',
        width: WIDTH,
        justifyContent: 'center',
        paddingLeft: PADDING_LEFT_RIGHT,
        paddingRight: PADDING_LEFT_RIGHT,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 1,
        width: WIDTH,
        height: HEIGHT,
    },
    imageBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 1,
        width: WIDTH >= 768 ? (WIDTH - (PADDING_LEFT_RIGHT * 2)) : '100%',
        height: Platform.OS === 'ios' ? HEIGHT : HEIGHT - 15,
        resizeMode: 'cover',
        marginLeft: PADDING_LEFT_RIGHT,
    },
    slideContent: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontFamily: 'Montserrat-SemiBold',
        textAlign: "center",
        color: '#fff',
        fontSize: 18,
        marginBottom: 15,
    },
    contentText: {
        fontFamily: 'Montserrat-Medium',
        textAlign: "center",
        color: '#fff',
        fontSize: 16
    },
});
