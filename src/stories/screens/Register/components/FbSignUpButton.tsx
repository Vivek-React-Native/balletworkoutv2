import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon, Toast, Button } from 'native-base';
import FBSDK, { LoginManager, AccessToken } from 'react-native-fbsdk';
import i18n from '../../../../common/i18n';
import { isIphoneSe } from '../../../../utilities/Screen';
import { HEIGHT, SECONDARY_COLOR } from '../../../../utilities/Theme';

const VIEW_CALLBACK_ENUMS = {
    REGISTER_WITH_FACEBOOK: 'registration/register-with-facebook',
}

interface Props {
    viewCallbackHandler: Function;
    country: string;
    timezone: string;
    language: string;
    title: string;
    paddingLeft?: number | string;
    paddingRight?: number | string;
    backgroundColor?: string;
    textColor?: string;
    iconColor?: string;
};

interface State { };

export default class FbSignUpButton extends Component<Props, State> {

    _fbauth() {
        LoginManager.logInWithPermissions(['email', 'public_profile']).then((result: any) => {
            if (result.isCancelled) {
                // console.log('Login was cancelled');
            } else if (result.declinedPermissions.length > 0) {
                // console.log('permisions denied ' + result.declinedPermissions.toString());
            } else {
                AccessToken.getCurrentAccessToken()
                    .then((data: any) => {

                        let registrationData = {
                            accessToken: data.accessToken,
                            fb_id: data.userID,
                            country: this.props.country,
                            timezone: this.props.timezone,
                            language: this.props.language,
                        };

                        this.props.viewCallbackHandler(VIEW_CALLBACK_ENUMS.REGISTER_WITH_FACEBOOK, registrationData);
                        // console.log('AccessToken: ', JSON.stringify(registrationData));
                    }
                    )
            }
        }, (error: any) => {
            // console.log('An error occurred' + error);
            Toast.show({
                text: i18n.t('auth.facebook_error')
            });
        });
    }

    render() {
        const { paddingLeft, paddingRight, backgroundColor, textColor, iconColor } = this.props;
        return (
            <View style={[styles.container]}>
                <Button
                    style={[styles.fbSignUpButton, { paddingLeft, paddingRight, backgroundColor}]}
                    iconLeft
                    onPress={() => this._fbauth()}
                >
                    <Icon name='logo-facebook' style={{color: iconColor ? iconColor: '#000'}} />
                    <Text style={[styles.textWhite, styles.textBold, styles.buttonText, {color: textColor ? textColor: '#000'}]}>   {this.props.title} </Text>
                </Button>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: -1,//isIphoneSe ? .9 : 1,
        justifyContent: 'center',
        // alignSelf: 'stretch',
        marginTop: HEIGHT <= 667 ? 15 :20
    },
    fbSignUpButton: {
        backgroundColor: "#4768AD",
        borderRadius: 5,
        paddingLeft: 15,
        paddingRight: 15,
    },
    textWhite: {
        color: "#ffffff",
    },
    textBold: {
        fontFamily: 'Montserrat-Bold',
    },
    buttonText: {
        fontSize: 15,
        fontFamily: 'Montserrat-SemiBold',
    },
});

export { VIEW_CALLBACK_ENUMS as FB_SIGNUP_CALLBACK_ENUMS };
