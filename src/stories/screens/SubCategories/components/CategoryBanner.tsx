import React, {Component} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {PADDING_LEFT_RIGHT, WIDTH, PRIMARY_COLOR} from './../../../../utilities/Theme';
import AutoScaleImage from '../../../../common/components/AutoScaleImage';

interface Props {
    title: string;
    sourceUrl: string;
}

interface State {
}

export default class CategoryBanner extends Component<Props, State> {
    render() {
        return (
            <View style={styles.container}>
                <AutoScaleImage width={WIDTH - (PADDING_LEFT_RIGHT * 2)} height={null} style={styles.bannerImage}
                                uri={this.props.sourceUrl}/>
                <Text style={styles.bannerText}>{this.props.title}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: -1,
        width: WIDTH - (PADDING_LEFT_RIGHT * 2),
        //height: 235,
        // marginBottom: 20,
        marginTop: 20,
        alignSelf: 'center',
    },
    bannerImage: {
        // width: WIDTH - (PADDING_LEFT_RIGHT*2),
        resizeMode: 'contain',
        // height: 200,
    },
    bannerText: {
        alignSelf: 'center',
        //bottom: 45,
        color: PRIMARY_COLOR,
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 20,
        marginTop: 15,
        marginBottom: 15,
    },
});
