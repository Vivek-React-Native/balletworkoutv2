import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Button, Icon, Toast } from 'native-base';
import { isIphoneSe } from './../../../../utilities/Screen';
import i18n from '../../../../common/i18n';
import FBSDK, { LoginManager, AccessToken } from 'react-native-fbsdk';
import { HEIGHT } from '../../../../utilities/Theme';

// list of all possible enums in child
const VIEW_CALLBACK_ENUMS = {
	LOGIN_WITH_FACEBOOK: 'login/login-with-facebook',
};

interface Props {
	callbackHandler: Function; title: string;
	paddingLeft?: number | string;
	paddingRight?: number | string;
	backgroundColor?: string;
	textColor?: string;
	iconColor?: string;
}
interface State { }
export default class FbLoginButton extends Component<Props, State> {

	viewCallbackHandler(type: string, data: any) {
		this.props.callbackHandler(type, data);
	}

	_fbAuth() {
		LoginManager.logInWithPermissions(['email', 'public_profile']).then((result: any) => {
			if (result.isCancelled) {
				Toast.show({
					text: i18n.t('auth.facebook_login_canceled')
				});
				//console.log('Login was cancelled');
			} else if (result.declinedPermissions.length > 0) {

				Toast.show({
					text: i18n.t('auth.facebook_email_permission_denied')
				});
				//console.log('permisions denied ' + result.declinedPermissions.toString());
			} else {
				AccessToken.getCurrentAccessToken()
					.then((data: any) => {

						let loginData = {
							accessToken: data.accessToken,
						};

						this.viewCallbackHandler(VIEW_CALLBACK_ENUMS.LOGIN_WITH_FACEBOOK, loginData);
					})
			}
		}, (error: any) => {
			//console.log(error);
			Toast.show({
				text: i18n.t('auth.facebook_error'),
			});
		}).catch(console.warn);
	}

	render() {
		const { paddingLeft, paddingRight, backgroundColor, textColor, iconColor } = this.props;
		return (
			<View style={[styles.container]}>
				<Button
					style={[styles.fbLoginButton, { paddingLeft, paddingRight, backgroundColor }]}
					iconLeft
					onPress={() => this._fbAuth()}>
					<Icon name='logo-facebook' style={[styles.icon, { color: iconColor ? iconColor : '#000' }]} />
					<Text style={[styles.textWhite, styles.textFbButton, styles.buttonText, { color: textColor ? textColor : '#000' }]}>  {this.props.title}</Text>
				</Button>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: -1,//isIphoneSe ? .4 : 1,
		justifyContent: 'center',
		//alignSelf: 'stretch',
		marginTop: HEIGHT <= 667 ? 15 :20,
	},
	fbLoginButton: {
		backgroundColor: "#4768AD",
		borderRadius: 5,
		paddingLeft: 15,
		paddingRight: 15,
	},
	textWhite: {
		color: "#ffffff",
	},
	textFbButton: {
		fontFamily: 'Montserrat-SemiBold'
	},
	buttonText: {
		fontSize: 15,
	},
	icon: {
		marginLeft: 0,
	}
});
export { VIEW_CALLBACK_ENUMS as FB_LOGIN_BUTTON_CALLBACK_ENUMS };
