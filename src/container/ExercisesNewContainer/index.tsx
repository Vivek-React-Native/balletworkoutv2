import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import Exercises, { CALLBACK_ENUMS } from './../../stories/screens/Exercises';
import { isIPhone } from './../../utilities/Screen';
import { PADDING_LEFT_RIGHT } from './../../utilities/Theme';
import fetchExercises from './actions';
import saveAndStartGoal, { turnOffGoalNotification } from './../GoalsContainer/actions';
import NoConnection from '../../common/components/NoConnection';
interface Props {
    exercises: any;
    fetchExercises: Function;
    saveAndStartGoal: Function;
    navigation: any;
    goals: any;
    screenProps: any;
    turnOffGoalNotification: any;
    category: any
};
interface State {
    exercises: any;
    subCategory: any;
    params:any
};

export class ExercisesNewContainer extends Component<Props, State> {

    static navigationOptions = {
        header: null,
    };

    unSubscribeStore: Function;

    state = {
        exercises: [],
        subCategory: this.props.navigation.getParam('subCategory'),
        params: []
    };

    componentWillMount() {
        const { screenProps: { store } } = this.props;

        let id = this.props.navigation.getParam('id');
        let subCategory = this.props.navigation.getParam('subCategory');
        const subCategoryType = this.props.navigation.getParam('subCategoryType');
        const category = this.props.navigation.getParam('category');
        this._param(category)
        this.props.fetchExercises(id, subCategoryType);

        this.unSubscribeStore = store.subscribe(() => {
            let exercises = store.getState().exercises.exercises;
            this.setState({ exercises, category });
        });
    }

    _param(value: any){
        this.setState({ params: value })
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
        const { screenProps: { store } } = this.props;
        const { subCategory } = this.state;
        return (
            <View style={styles.container}>
                {
                    this.props.screenProps.isConnectedToNetwork ?
                        null :
                        <NoConnection />
                }
                <Exercises
                    connection={this.props.screenProps.isConnectedToNetwork}
                    callbackHandler={this.callbackHandler}
                    subCategoryType={this.props.navigation?.getParam('subCategoryType')}
                    subCategory={subCategory}
                    exercises={this.state.exercises}
                    navigation={this.props.navigation}
                    notifService={this.props.screenProps.notifService}
                    store={store} 
                    category={this.state.params}
                />
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
export default connect(mapStateToProps, mapDispatchToProps)(ExercisesNewContainer);
