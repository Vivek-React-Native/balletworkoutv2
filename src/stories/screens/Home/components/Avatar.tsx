import React, {Component} from 'react';
import {View, Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {baseServerUri} from '../../../../common/appConstants';

interface Props {
    store: any;
    navigation: any;
};

interface State {
    imageResponse: any;
    profilePicture: string;
};
export default class Avatar extends Component<Props, State> {

    unSubscribeStore: Function = null;

    constructor(props: any) {
        super(props);

        const {store} = this.props;
        let userData = store.getState().auth.userData;

        this.state = {
            imageResponse: null,
            profilePicture: baseServerUri + userData.profile_picture_dir + userData.profile_picture
        };

        this.unSubscribeStore = store.subscribe(() => {
            let userData = store.getState().auth.userData;
            this.setState({profilePicture: baseServerUri + userData.profile_picture_dir + userData.profile_picture})
        });
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.avatarWrapper}>
                    <TouchableOpacity style={styles.transparent}
                                      onPress={() => this.props.navigation.navigate('settings')}>
                        <Image style={styles.profilePicture} source={{uri: this.state.profilePicture}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
    },
    avatarWrapper: {
        marginTop: 10,
        width: 37,
        height: 37,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#D2959F',
        overflow: 'hidden',
    },
    profilePicture: {
        resizeMode: 'cover',
        width: 31,
        height: 31,
    },
    transparent: {
        backgroundColor: 'transparent',
    }
});
