import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Icon, Toast, Button } from 'native-base';
import appleAuth, {
    AppleAuthRequestOperation,
    AppleAuthRequestScope,
    AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import { HEIGHT } from '../../../../utilities/Theme';

const VIEW_CALLBACK_ENUMS = {
    LOGIN_WITH_APPLE: 'login/login-with-apple',
}

interface Props {
    callbackHandler: Function;
    title: string;
    paddingLeft?: number | string;
    paddingRight?: number | string;
};

interface State { };

export default class AppleLoginButton extends Component<Props, State> {

    viewCallbackHandler(type: string, data: any) {
		this.props.callbackHandler(type, data);
	}

    async onAppleButtonPress() {

        // console.log(appleAuth.isSupported);

        if (!appleAuth.isSupported) {
            Alert.alert('Sign In With Apple is supported only on ios >= 13');
            return;
        }

        try {
            // performs login request
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: AppleAuthRequestOperation.LOGIN,
                requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
            });

            // get current authentication state for user
            // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
            const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

            // use credentialState response to ensure the user is authenticated
            if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
                // user is authenticated
                // console.log(appleAuthRequestResponse);
                let loginData = {
                    identityToken: appleAuthRequestResponse.identityToken,
                };
                this.viewCallbackHandler(VIEW_CALLBACK_ENUMS.LOGIN_WITH_APPLE, loginData);

            } else if(credentialState === AppleAuthCredentialState.REVOKED) {
                Alert.alert('Login expired/access revoked, please login again');
            } else if(credentialState === AppleAuthCredentialState.TRANSFERRED) {
                Alert.alert('Login user transfered');
            }  else if(credentialState === AppleAuthCredentialState.NOT_FOUND) {
                Alert.alert('Login user not found');
            } else {
                Alert.alert('Something went wrong, please try again.');
            }

        } catch (e) {
            Alert.alert("Some error occurred, please try again");
        }
    }

    render() {
        const { paddingLeft, paddingRight } = this.props;
        return (
            <View style={[styles.container]}>
                <Button
                    style={[styles.appleSignUpButton, { paddingLeft, paddingRight }]}
                    iconLeft
                    onPress={() => this.onAppleButtonPress()}>
                    <Icon name='logo-apple' style={styles.icon} />
                    <Text style={[styles.textBold, styles.buttonText]}> {this.props.title} </Text>
                </Button>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: -1,//isIphoneSe ? .9 : 1,
        justifyContent: 'center',
        marginTop: HEIGHT <= 667 ? 15 :20,
    },
    appleSignUpButton: {
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingLeft: 15,
        paddingRight: 15,
    },
    textBold: {
        fontFamily: 'Montserrat-Bold',
    },
    buttonText: {
        fontSize: 15,
        fontFamily: 'Montserrat-SemiBold',
        textAlign: 'center'
    },
    icon: {
        color: '#000',
        marginLeft: 0,
    },
});

export { VIEW_CALLBACK_ENUMS as APPLE_LOGIN_BUTTON_CALLBACK_ENUMS };
