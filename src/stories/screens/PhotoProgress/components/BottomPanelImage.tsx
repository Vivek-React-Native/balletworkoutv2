import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { WIDTH, SECONDARY_COLOR } from '../../../../utilities/Theme';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    item: any;
    onPressHandler: any;
    last: boolean;
    clickHandler: Function;
};
interface State { };

export default class BottomPanelImage extends Component<Props, State> {

    render() {
        const { item, onPressHandler } = this.props;

        // console.log(typeof item.after_picture, item.after_picture);
        return (
            <TouchableWithoutFeedback key={item.goal_id} onPress={() => onPressHandler(item)}>
                <View style={styles.container}>

                    <View style={[styles.imageItemContainer, !this.props.last || { marginRight: 30 }]}>

                        <View style={styles.imageWrapper}>

                            <View style={styles.imageRightLeftWrapper}>
                                {
                                    typeof item.before_picture === 'undefined' || (typeof item.before_picture === 'string' && item.before_picture === '') ?
                                        <View style={styles.emptyView}>
                                            <Button
                                                style={{ alignSelf: 'center' }}
                                                transparent
                                                onPress={() => this.props.clickHandler('before')}>
                                                <Icon name='ios-camera' style={styles.icon} color={SECONDARY_COLOR} />
                                            </Button>
                                        </View> :
                                        <Image style={styles.image} source={{ uri: 'file://' + item.before_picture }} />
                                }
                                <Text style={styles.beforeAfterText}>Before</Text>
                            </View>
                            <View style={styles.imageRightLeftWrapper}>
                                {
                                    typeof item.after_picture === 'undefined' || (typeof item.after_picture === 'string' && item.after_picture === '') ?
                                        <View style={styles.emptyView}>
                                            <Button
                                                style={{ alignSelf: 'center' }}
                                                transparent
                                                onPress={() => this.props.clickHandler('after')}>
                                                <Icon name='ios-camera' style={styles.icon} color={SECONDARY_COLOR} />
                                            </Button>
                                        </View> :
                                        <Image style={styles.image} source={{ uri: 'file://' + item.after_picture }} />
                                }
                                <Text style={styles.beforeAfterText}>After</Text>
                            </View>

                        </View>
                        <View style={styles.caption}>
                            <Text style={styles.captionText}>{item.caption}</Text>
                        </View>

                    </View>

                </View>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        flexDirection: 'row',
    },
    imageWrapper: {
        flex: 1,
        width: WIDTH * 0.7,
        height: "100%",
        flexDirection: 'row',
        justifyContent: 'space-around',
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
        marginLeft: 30,
        borderWidth: 1,
        borderColor: SECONDARY_COLOR
    },
    imageRightLeftWrapper: {
        flex: 1,
        width: WIDTH * 0.5 * 0.5,
        alignItems: 'center',
        overflow: 'hidden'
    },
    captionText: {
        fontFamily: 'Montserrat-SemiBold',
        alignSelf: 'center',
        marginBottom: 10
    },
    caption: {
        flex: 0,
    },
    icon: {
        fontSize: 45
    },
    emptyView: {
        flex: 1,
        justifyContent: "center"
    },
    beforeAfterText: {
        fontFamily: 'Montserrat-Medium'
    }
});
