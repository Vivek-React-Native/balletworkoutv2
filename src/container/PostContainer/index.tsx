import React, { Component } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import axios from "axios";
import AppHeader from "./../../common/components/AppHeader/AppHeader";
import Post from "./../../stories/screens/Post";
import NoConnection from "../../common/components/NoConnection";

interface Props {
    navigation: any;
}
interface State {
    post: any;
    isLoading: boolean;
}
export default class PostContainer extends Component<Props, State> {

    backHandler: any

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress",()=> this.props.navigation.navigate('blog'))
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                {
                    this.props.screenProps.isConnectedToNetwork ?
                        null :
                        <NoConnection />
                }
                {/*<AppHeader navigation={navigation} />*/}
                <Post navigation={navigation} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    }
});
