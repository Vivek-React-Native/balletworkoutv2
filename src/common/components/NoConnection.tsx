import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { PRIMARY_COLOR, HEIGHT, WIDTH } from '../../utilities/Theme';

const NoConnection = () => (
    <View style={styles.noConnectionWrapper}>
        <Text style={styles.noConnectionText}>No Connection</Text>
    </View>
);

const styles = StyleSheet.create({
    noConnectionWrapper: {
		flex: 1,
		padding: 15,
		alignItems: 'center',
		backgroundColor: 'rgba(70,76,110, .5)',
		alignSelf: 'stretch',
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 999999999,
		height: "100%",
		width: WIDTH,
		justifyContent: 'center',
        
	},
	noConnectionText: {
		color: '#fff',
		fontFamily: 'Montserrat-Bold',
	}
});

export default NoConnection;