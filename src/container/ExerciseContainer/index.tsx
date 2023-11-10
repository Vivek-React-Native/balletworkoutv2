import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Exercise from './../../stories/screens/Exercise';
import { connect } from 'react-redux';
import { updateGoalProgress } from './../GoalsContainer/actions';
import AppHeader from '../../common/components/AppHeader/AppHeader';
import NoConnection from '../../common/components/NoConnection';


interface Props {
    navigation: any;
    updateGoalProgress: Function;
    goals: any;
    screenProps: any;
};
interface State { };

export class ExerciseContainer extends Component<Props, State> {

    constructor(props: any) {
        super(props);
    }

    render() {
        const { navigation, screenProps: { store } } = this.props;
        return (
            <View style={styles.container}>
                {
                    this.props.screenProps.isConnectedToNetwork ?
                        null :
                        <NoConnection />
                }
                {/*<AppHeader navigation={navigation} />*/}
                <Exercise store={store} updateGoalDispatch={this.props.updateGoalProgress} navigation={this.props.navigation} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
    }
});

const mapDispatchToProps = (dispatch: Function) => {
    return {
        updateGoalProgress: (goal: any) => { dispatch(updateGoalProgress(goal)) }
    }
}

const mapStateToProps = state => {
    const { goals } = state;
    return { goals };
};
export default connect(mapStateToProps, mapDispatchToProps)(ExerciseContainer);
