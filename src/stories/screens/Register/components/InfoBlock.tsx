import React, { Component } from 'react';
import { Text, View, StyleSheet, Platform, Dimensions, Linking } from 'react-native';
import { isIPhoneX, isAndroid, isIphoneSe } from './../../../../utilities/Screen';
import i18n from '../../../../common/i18n';
import { policyUrl, termsUrl } from '../../../../common/appConstants';
import { HEIGHT } from '../../../../utilities/Theme';

const { width, height } = Dimensions.get('window');

interface Props {

};
interface State {

};
export default class InfoBlock extends Component<Props, State> {

	handleLink(url: string) {
		Linking.openURL(url).catch((error: any) => console.warn(error));
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={[
					styles.infoBlock,
				]}>
					{i18n.t('auth.agreement_text_prefix')}
					<Text onPress={() => this.handleLink(policyUrl + `?lang=${i18n.language.substring(0, 2)}`)} style={[styles.infoBlock, styles.linkText]}> {i18n.t('auth.policy')}</Text> {i18n.t('auth.agreement_text_mid')}
					<Text onPress={() => this.handleLink(termsUrl + `?lang=${i18n.language.substring(0, 2)}`)} style={[styles.infoBlock, styles.linkText]}> {i18n.t('auth.terms_of_service')} </Text>
				</Text>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: -1, //isIphoneSe? .7: 1.2,
		justifyContent: 'center',
		alignSelf: 'stretch',
		marginTop: HEIGHT <= 667 ? 15 :20,
	},
	infoBlock: {
		textAlign: "center",
		fontSize: 12,
		fontWeight: "bold",
		color: "#535353",
	},
	linkText: {
		color: "#fff",//"#2699FB",
	},
});
