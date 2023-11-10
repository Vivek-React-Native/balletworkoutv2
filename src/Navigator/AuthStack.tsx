import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Register from '../container/RegisterContainer';
import Login from '../container/LoginContainer';
import Intro from './../container/IntroContainer';
import WelcomeContainer from "../container/WelcomeContainer";
import ChooseDaysContainer from "../container/ChooseDaysContainer";
/**
* Auth navigation
*/
const AuthStack = createStackNavigator({
    // login: Login,
    // register: Register,
    login: Login,
    intro: Intro,
    welcome: WelcomeContainer,
    choose: ChooseDaysContainer,
}, {
    initialRouteName: 'login',
    headerMode: 'none',
});

export default AuthStack;
