import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ProfileForm from './components/ProfileForm';
import { PADDING_LEFT_RIGHT } from './../../../utilities/Theme';
import ProfilePicture, { PROFILE_PICTURE_CALLBACK_ENUM } from './components/ProfilePicture';
import Loader from '../../../common/components/Loader';
import { Toast } from 'native-base';

const VIEW_CALLBACK_ENUM = {
    ...PROFILE_PICTURE_CALLBACK_ENUM,
}

interface Props {
    navigation: any;
    store: any;
    callbackHandler: Function;
}
interface State {
    isLoading: boolean;
}
export default class Profile extends Component<Props, State> {

    unSubscribeStore: Function;
    state = {
        isLoading: false,
    };

    componentDidMount(){
        const { store } = this.props;
        this.unSubscribeStore = store.subscribe(() => {
            let state = store.getState();
            
            if(typeof state?.profile?.saveErrors === 'string'){
                // console.log('state.......',state?.profile?.saveErrors)
                Toast.show({
                    text: state?.profile?.saveErrors,
                    position:'top'
                })
            }
            
        });
        
    }

    componentWillMount() {
        const { store } = this.props;

        this.unSubscribeStore = store.subscribe(() => {
            let state = store.getState();
            let isLoading = state.auth.isLoading || state.profile.isSaving || state.profile.isFetching || state.profile.isUploadingPicture;
            
            this.setState({ isLoading });
            
        });
    }

    viewCallbackHandler(type: string, data: any) {
        switch (type) {
            case VIEW_CALLBACK_ENUM.UPLOAD_PROFILE_PICTURE:
                this.props.callbackHandler(type, data);
        }
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    render() {
        const { store } = this.props;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {!this.state.isLoading || <Loader />}
                <ProfilePicture callbackHandler={this.viewCallbackHandler.bind(this)} store={store} />
                <ProfileForm />
            </View>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export { VIEW_CALLBACK_ENUM };
