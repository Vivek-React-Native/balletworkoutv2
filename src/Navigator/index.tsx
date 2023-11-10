import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { createSwitchNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

// import new redux helpers
import {
    createReduxContainer,
    createReactNavigationReduxMiddleware
} from 'react-navigation-redux-helpers';
import { BackHandler } from 'react-native';
import { exportedStore } from '../store';


// Configure listener
export const middleware = createReactNavigationReduxMiddleware(
    "root",
    (state: any) => state.navigation, // <-- make sure this is where your nav state lives (i.e. if your redux state is at `state.nav` use state => state.nav instead)
);
//const addListener = createReduxBoundAddListener("root");

/**
* App navigation
*/
export const RootSwitchNavigator = createSwitchNavigator({
    auth: AuthStack,
    app: AppStack
}, {
    initialRouteName: 'auth',
}
);

const AppNav = createReduxContainer(RootSwitchNavigator, "root");
const mapStateToProps = (state: any) => ({
    state: state.navigation,
});
const AppNavWithNavigationState = connect(mapStateToProps, null)(AppNav);


interface Props {
    navigation?: any;
    dispatch?: Function;
    screenProps: any;
}
interface State { }

class AppNavigator extends Component<Props, State> {

    shouldCloseApp(nav: any) {
        return nav.routes[1].index == 0;
    }
    componentDidMount() {
        BackHandler.addEventListener('backPress', () => {

            if (this.shouldCloseApp(exportedStore.getState().navigation))
                return false

            exportedStore.dispatch({
                type: 'Navigation/BACK'
            });

            return true;
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('backPress', () => { });
    }

    render() {
        return (
            <AppNavWithNavigationState {...this.props} />
        );
    }
}

export default AppNavigator;
