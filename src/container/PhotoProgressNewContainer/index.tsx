import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Body, Title, Right, Left } from 'native-base';
import Recipe from './../../stories/screens/Recipe';
import { PADDING_LEFT_RIGHT } from './../../utilities/Theme';
import { isIPhone } from './../../utilities/Screen';
import AppHeader from '../../common/components/AppHeader/AppHeader';
import PhotoProgress from '../../stories/screens/PhotoProgress';
import NoConnection from '../../common/components/NoConnection';
import PhotoProgressNew from "../../stories/screens/PhotoProgressNew";

interface Props {
    navigation: any;
    screenProps: any;
};
interface State { };

export default class PhotoProgressContainer extends Component<Props, State> {

    static navigationOptions = {
        header: null,
    };

    render() {
        const { navigation, screenProps: { store } } = this.props;

        return (
            <View style={styles.container}>
                {
                    this.props.screenProps.isConnectedToNetwork ?
                        null :
                        <NoConnection />
                }
                <View style={{ flex: 1, zIndex: 99 }}>
                    <PhotoProgressNew store={store} navigation={navigation} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: isIPhone ? 85 : 65,
        paddingLeft: PADDING_LEFT_RIGHT,
        paddingRight: PADDING_LEFT_RIGHT,
        backgroundColor: '#464c6e'
    },
});
