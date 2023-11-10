import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Settings from './../../stories/screens/Settings';
import AppHeader from '../../common/components/AppHeader/AppHeader';
import NoConnection from '../../common/components/NoConnection';

interface Props {
    screenProps: any;
    navigation: any;
}
interface State { }

export default class SettingsContainer extends Component<Props, State> {

    render() {
        const { store } = this.props.screenProps;
        return (
            <View style={styles.container}>
                {
                    this.props.screenProps.isConnectedToNetwork ?
                        null :
                        <NoConnection />
                }
                <AppHeader navigation={this.props.navigation} />
                <Settings store={store} navigation={this.props.navigation} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
