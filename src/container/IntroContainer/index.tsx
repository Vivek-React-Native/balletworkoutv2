import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import IntroSlider from '../../common/components/IntroSlider';
import DefaultPreference from 'react-native-default-preference';

interface Props {
    navigation: any;
    screenProps: any;
};

interface State { }

export default class IntroContainer extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        const { screenProps: { firstTimeLaunch } } = this.props;
        if (firstTimeLaunch !== null && (typeof firstTimeLaunch !== 'undefined' && firstTimeLaunch === '1')) {
            this.props.navigation.navigate('register');
        }
    }

    async onDoneCallback() {
        await DefaultPreference.set('app_first_launch_performed', "1");
        this.props.screenProps.setFirstTime();
        this.props.navigation.navigate('register');
    }

    async onSkipCallback () {
        await DefaultPreference.set('app_first_launch_performed', "1");
        this.props.navigation.navigate('register');
    }

    async onNavigationCallback(routeName: string, params: any) {
        await DefaultPreference.set('app_first_launch_performed', "1");
        this.props.screenProps.setFirstTime();
        this.props.navigation.navigate(routeName, params);
    }
    render() {
        return (
            <View style={styles.container}>
                <IntroSlider onDoneCallback={this.onDoneCallback.bind(this)} onSkipCallback={this.onSkipCallback.bind(this)} onNavigateCallback={this.onNavigationCallback.bind(this)} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'transparent',
    }
});
