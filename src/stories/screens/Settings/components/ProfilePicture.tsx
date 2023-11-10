import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { baseServerUri } from '../../../../common/appConstants';
import defaultImage from './../../../../assets/images/default-profile.jpg';

interface Props {
    store: any;
}
interface State {
    profilePicture: string;
}

export default class ProfilePicture extends Component<Props, State> {

    unSubscribeStore: Function = null;

    constructor(props) {
        super(props);

        const { store } = this.props;
        let userData = store.getState().auth.userData;

        this.state = {
            profilePicture: baseServerUri + userData.profile_picture_dir + userData.profile_picture
        };

        this.unSubscribeStore = store.subscribe(() => {

            let userData = store.getState().auth.userData;
            // console.log(userData);
            this.setState({ profilePicture: userData.profile_picture !== '' && userData.profile_picture !== null ? baseServerUri + userData.profile_picture_dir + userData.profile_picture : '' });
        });
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    render() {
        const { store } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.imageBackground} />
                <View style={[styles.imageWrapper, styles.shadow]}>
                    {this.state.profilePicture !== '' ? <Image
                        style={styles.profilePicture}
                        source={{ uri: this.state.profilePicture }} /> :
                        <Image
                            style={styles.profilePicture}
                            source={defaultImage} />}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        backgroundColor: 'transparent',
        height: 160
    },
    imageBackground: {
        flex: 0,
        backgroundColor: '#464c6e',
        height: 90,
        marginTop: -1,
        //marginBottom: 70
    },
    imageWrapper: {
        position: 'absolute',
        top: 20,
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 9,
        borderColor: '#D2959F',
        overflow: 'hidden'
    },
    profilePicture: {
        resizeMode: 'contain',
        width: 135,
        height: 135,
        alignSelf: 'center'
    },
    shadow: {
        elevation: 10,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 5 },
        shadowRadius: 10,
        shadowOpacity: 0.2,
    },
});
