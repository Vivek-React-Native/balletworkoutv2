import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import {WIDTH} from '@balletworkout/utilities/Theme';
import {isIPhoneX} from '@balletworkout/utilities/Screen';
import menuImage from "@balletworkout/assets/images/menu-left.png";
import {Text} from "@balletworkout/components";
import Icon from "react-native-vector-icons/AntDesign";
import { HEIGHT } from '../../utilities/Theme';

interface Props {
	navigation: any;
	title: string,
	subtitle?: string,
	hideBack?: boolean;
	hideMenu?: boolean;
}

const SpanHeader = ({title, subtitle = '', navigation, hideBack = false, hideMenu = false}: Props) => {
	return (
		<View style={[styles.container, {marginTop: hideBack ? isIPhoneX ? 40 : 10 : isIPhoneX ? HEIGHT * 0.06 : 30}]}>
			<StatusBar
				hidden
				barStyle="light-content"
			/>
			{!hideBack && <View style={{height: 25}}>
				<TouchableOpacity style={{marginLeft: 20,width: 40,height: 30}} onPress={() => navigation.goBack()}>
					<Icon name="left" style={{fontSize: 20}}/>
				</TouchableOpacity>
			</View>}
			<View style={[styles.content]}>
				<View style={{flex: 1, marginTop: 5}}>
					<Text style={styles.textBold}>{title}</Text>
					{!!subtitle && <Text style={styles.textSubTitle} font={'Regular'}>{subtitle}</Text>}
				</View>
				{!hideMenu &&
					<TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('settings')}>
						<Image style={styles.image} resizeMode={'contain'} source={menuImage}/>
					</TouchableOpacity>
				}
			</View>
		</View>
	);
}

export default SpanHeader;

const styles = StyleSheet.create({
	container: {
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		paddingBottom: 10
	},
	content: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginTop: 10
	},
	menuButton: {
		backgroundColor: '#F7F7F7',
		width: 45,
		height: 45,
		marginRight: 20,
		borderRadius: 23,
		justifyContent: 'center',
		alignItems: 'center'
	},
	gradientImage: {
		position: "absolute",
		top: -WIDTH * 0.35,
		left: -WIDTH * 0.15,
		zIndex: 1000,
		width: WIDTH * 0.7,
		height: WIDTH * 0.7,
		aspectRatio: 1
	},
	image: {
		width: 20,
		height: 20,
		aspectRatio: 1
	},
	textBold: {
		textAlign: 'left',
		paddingHorizontal: '5%',
		fontSize: WIDTH * 0.08,
		color: '#032426',
		lineHeight: 45
	},
	textSubTitle: {
		textAlign: 'left',
		paddingHorizontal: '5%',
		fontSize: WIDTH * 0.045,
		color: '#032426',
		lineHeight: 30
	},
});
