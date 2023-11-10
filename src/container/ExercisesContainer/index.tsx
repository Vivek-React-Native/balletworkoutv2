import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Header, Body, Title, Right, Left, Button } from 'native-base';
import { connect } from 'react-redux';
import Exercises, { CALLBACK_ENUMS } from './../../stories/screens/Exercises';
import { isIPhone } from './../../utilities/Screen';
import { PADDING_LEFT_RIGHT } from './../../utilities/Theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import fetchExercises from './actions';
import saveAndStartGoal, { turnOffGoalNotification } from './../GoalsContainer/actions';
import AppHeader from '../../common/components/AppHeader/AppHeader';
import NoConnection from '../../common/components/NoConnection';

interface Props {
    exercises: any;
    fetchExercises: Function;
    saveAndStartGoal: Function;
    navigation: any;
    goals: any;
    screenProps: any;
    turnOffGoalNotification: any;
};
interface State {
    exercises: any;
};

export class ExercisesContainer extends Component<Props, State> {

    static navigationOptions = {
        header: null,
    };

    unSubscribeStore: Function;

    state = {
        exercises: [],
    };

    componentWillMount() {
        const { screenProps: { store } } = this.props;

        let id = this.props.navigation.getParam('id');
        const subCategoryType = this.props.navigation.getParam('subCategoryType');
        this.props.fetchExercises(id, subCategoryType);

        this.unSubscribeStore = store.subscribe(() => {
            let exercises = store.getState().exercises.exercises;
            this.setState({ exercises });
        });
    }

    callbackHandler = (type: string, data: any) => {
        switch (type) {
            case CALLBACK_ENUMS.SAVE_AND_START_GOAL_FORM_ENUM:
                // action from goals reducer
                this.props.saveAndStartGoal(data);
                break;
            case CALLBACK_ENUMS.GOAL_NOTIFICATION_CANCELED:
                this.props.turnOffGoalNotification(data);
                break;
        }
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    render() {
        const { goals, navigation, screenProps: { store } } = this.props;
        return (
            <View style={styles.container}>
                {
                    this.props.screenProps.isConnectedToNetwork ?
                        null :
                        <NoConnection />
                }

                <AppHeader navigation={navigation} />
                <Exercises
                    callbackHandler={this.callbackHandler}
                    subCategoryType={this.props.navigation.getParam('subCategoryType')}
                    exercises={this.state.exercises}
                    navigation={this.props.navigation}
                    notifService={this.props.screenProps.notifService}
                    store={store} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: isIPhone ? 85 : 65,
        paddingLeft: PADDING_LEFT_RIGHT,
        paddingRight: PADDING_LEFT_RIGHT,
        backgroundColor: '#464c6e'
    },
    icon: {
        fontSize: 25,
        color: '#ffffff',
    }
});

const mapDispatchToProps = (dispatch: Function) => {
    return {
        fetchExercises: (id: number, subCategoryType: string) => { dispatch(fetchExercises(id, subCategoryType)) },
        saveAndStartGoal: (goal: any) => { dispatch(saveAndStartGoal(goal)) },
        turnOffGoalNotification: (id: any) => { dispatch(turnOffGoalNotification(id)) },
    }
}

const mapStateToProps = state => {
    const { exercises, goals } = state;
    return { exercises, goals };
};
export default connect(mapStateToProps, mapDispatchToProps)(ExercisesContainer);
