import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Container, Header, Text, Body, Title, Right, Left } from 'native-base';
import { connect } from 'react-redux';
import Home from './../../stories/screens/Home';
import fetchCategories from './actions';
// import { store } from './../../store';
import HomeHeader from '../../stories/screens/Home/components/HomeHeader';
import i18n from '../../common/i18n';
import NoConnection from '../../common/components/NoConnection';
import TrialPopup from '../../common/components/TrialPopup';
import crashlytics from '@react-native-firebase/crashlytics';
import WeeklyGoal from "../../stories/screens/Home/components/WeeklyGoal";


interface Props {
    home: any;
    navigation: any;
    fetchCategories: Function;
    screenProps: any;
};
interface State {
    categories: any;
    trialPopupVisibility: boolean;
};
class HomeContainer extends Component<Props, State> {

    unSubscribeStore: Function;

    language: string;

    state = {
        categories: this.props.home,
        trialPopupVisibility: false,
    };

    componentDidMount() {
        const { store } = this.props.screenProps;
        let showTrialPopup = this.props.navigation?.getParam('showTrialPopup');
        if (typeof showTrialPopup !== 'undefined' && showTrialPopup !== null) {
            setTimeout(() => this.setTrialPopupVisibility(true), 3000);
        }

        this.props.fetchCategories();
        this.language = i18n.language

        this.unSubscribeStore = store.subscribe(() => {

            if (this.language !== i18n.language) {
                this.language = i18n.language;
                this.props.fetchCategories();
            }

            let categories = store.getState().home;

            this.setState({ categories });
        });
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    setTrialPopupVisibility(value: boolean) {
        this.setState({ trialPopupVisibility: value });
    }

    render() {
        const { store } = this.props.screenProps;
        return (
            <Container style={styles.container}>
                {
                    this.props.screenProps.isConnectedToNetwork ?
                        null :
                        <NoConnection />
                }
                <Home store={store} categories={this.state.categories} navigation={this.props.navigation} />
                {/*<TrialPopup visibility={this.state.trialPopupVisibility} setVisibility={this.setTrialPopupVisibility.bind(this)} />*/}
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: '#ffffff',
        paddingHorizontal: 10
    },
});

const mapStateToProps = state => {
    const { home } = state;

    return {
        home
    };
};

export default connect(mapStateToProps, { fetchCategories })(HomeContainer);
