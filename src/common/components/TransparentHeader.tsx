import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";

interface Props {
	navigation: any;
	title?: string,
	subtitle?: string,
	hideBack?: boolean;
	hideMenu?: boolean;
}

const TransparentHeader = ({navigation}: Props) => {
	return (
		<View style={[styles.container]}>
			<View style={{height: 25, marginTop: Platform.OS === 'android' ? 50 : 25}}>
				<TouchableOpacity style={{marginLeft: 10}} onPress={() => navigation.goBack()}>
					<Icon name="left" style={{fontSize: 20}}/>
				</TouchableOpacity>
			</View>
		</View>
	);
}

export default TransparentHeader;

const styles = StyleSheet.create({
	container: {
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		height: 155,
		backgroundColor: 'transparent'
	}
});
