import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {isIpad} from './../../../../utilities/Screen';
import {PADDING_LEFT_RIGHT, PRIMARY_COLOR} from './../../../../utilities/Theme';

interface Props {
    title: string;
};

interface State {
};

export default class GoalCarousel extends Component<Props, State> {

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.props.title}</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        alignSelf: 'stretch',
        paddingLeft: PADDING_LEFT_RIGHT,
        paddingRight: PADDING_LEFT_RIGHT,
    },
    text: {
        marginTop: 15,
        marginBottom: 15,
        fontSize: isIpad ? 30 : 18,
        fontFamily: 'Montserrat-SemiBold',
        color: PRIMARY_COLOR,
    },
});
