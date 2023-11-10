import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {};
interface State {};

export class LoginContainer extends Component<Props, State> {
    render() {
        return (
            <View style={styles.container}></View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    }
});
