import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableWithoutFeedback, ScrollView, PixelRatio } from 'react-native';
import { WIDTH, SECONDARY_COLOR, HEIGHT } from '../../../../utilities/Theme';
import BottomPanelImage from './BottomPanelImage';
import { isIPhoneX } from '../../../../utilities/Screen';

interface Props {
    photos: any;
    selectImage: Function;
    clickHandler: Function;
};
interface State { };

export default class BottomPanelContent extends Component<Props, State> {

    onPressHandler(item: any) {
        this.props.selectImage(item.before_picture, item.after_picture);
    }

    render() {
        return (
            <View style={styles.container} >
                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                    {
                        this.props.photos.map((item: any, index: number) => <BottomPanelImage clickHandler={this.props.clickHandler.bind(this)} onPressHandler={this.onPressHandler.bind(this)} key={item.goal_id} item={item} last={index === this.props.photos.length -1}/>)
                    }
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        height: (HEIGHT/1.3) - (!isIPhoneX ? 215 : 268),
        width: "100%",
        alignSelf: 'stretch',
        flexDirection: 'column',
        // paddingLeft: 15,
        // paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        backgroundColor: "#fff",
        alignItems: 'center'
    },
    imageWrapper: {
        flex: 1,
        width: WIDTH * 0.5,
        height: "100%",
        flexDirection: 'row',
    },
    image: {
        flex: 1,
        width: WIDTH * 0.5,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    imageItemContainer: {
        flex: 0,
        flexDirection: 'column',
        marginRight: 30,
        borderWidth: 1,
        borderColor: SECONDARY_COLOR
    },
    captionText: {
        fontFamily: 'Montserrat-SemiBold',
        alignSelf: 'center'
    },
    caption: {
        flex: 0,
    }
});
