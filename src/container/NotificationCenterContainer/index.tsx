import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader from '../../common/components/AppHeader/AppHeader';
import NotificationCenter from '../../stories/screens/NotificationCenter';

interface Props {
    navigation: any;
    screenProps: any;
}
interface State { }

export default class NotificationCenterContainer extends Component<Props, State> {

    render() {
        return (
            <View style={styles.container}>
                <AppHeader navigation={this.props.navigation} />
                <NotificationCenter/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
});
