import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader from '../../common/components/AppHeader/AppHeader';
import LanguageSetting from '../../stories/screens/LanguageSetting';
import NoConnection from '../../common/components/NoConnection';

interface Props {
    navigation: any;
    screenProps: any;
}
interface State { }

export default class LanguageSettingsContainer extends Component<Props, State> {

    render() {
        return (
            <View style={styles.container}>
                {
                    this.props.screenProps.isConnectedToNetwork ?
                        null :
                        <NoConnection />
                }
                <AppHeader navigation={this.props.navigation} />
                <LanguageSetting />
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
