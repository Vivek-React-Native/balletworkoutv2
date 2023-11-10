import React, { Component } from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import SpanHeader from "../../../common/components/SpanHeader";
import ProgressTabs from "./components/ProgressTabs";
import {HEIGHT, PADDING_LEFT_RIGHT} from "../../../utilities/Theme";
import GoalsList from "../Goals/components/GoalsList";
import {findArray} from "../../../utilities/Functions";
import i18n from "../../../common/i18n";
import ProgressGoalsList from "./components/ProgressGoalsList";
import ProgressTrainingOverview from "./components/ProgressTrainingOverview";

interface Props {
    navigation: any;
    store: any;
    draggableRange: any;
    start: Function;
}
interface State {
    photoProgresses: any;
    goals: any;
    isLoading: boolean;
    filter: string;
}

export default class PhotoProgressNew extends Component<Props, State> {
    unSubscribeStore: Function;

    state = {
        photoProgresses: [],
        goals: [],
        isLoading: true,
        filter: 'goal'
    };
    componentDidMount() {

        const { store } = this.props;

        let state = store.getState();
        let photoProgresses = state.photoProgress.photos;
        let goals = findArray(state.goals.goalsStarted, { is_finished: 0 });

        if (goals.length === 0) {
            // Alert.alert(
            //     i18n.t('progress.no_goals_alert_title'),
            //     i18n.t('progress.no_goals_alert_description'),
            //     [
            //         { text: i18n.t('progress.no_goals_go_back_btn_text'), onPress: () => this.props.navigation.goBack() },
            //     ]
            // );
        }

        this.setState({ photoProgresses });
        this.setState({ goals });
        this.unSubscribeStore = store.subscribe(() => {
            this.setState({ photoProgresses });
        });

        this.setState({
            filter: 'overview'
        })
    }
    onPressHandler() {
    }

    render() {
        const {filter} = this.state;
        return (
            <View style={styles.container}>
                <SpanHeader
                    title={i18n.t('progress.Progress')}
                    navigation={this.props.navigation}
                    hideBack
                    hideMenu
                />
                <View style={styles.content}>
                    <ProgressTabs
                        selected={filter}
                        onBalletCallBack={() => this.setState({filter: 'overview'})}
                        onFoodCallBack={() => this.setState({filter: 'goal'})}
                    />
                    <ScrollView style={styles.contentScrollView} showsVerticalScrollIndicator={false}>
                        {filter === 'overview' &&
                            <ProgressTrainingOverview goals={this.state.goals}/>
                        }
                        {filter === 'goal' &&
                            <ProgressGoalsList goals={this.state.goals} onPressList={this.onPressHandler}/>
                        }
                    </ScrollView>
                </View>
            </View>
        );
    }
    componentDidUpdate() {
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: HEIGHT,
    },
    content: {
        minHeight: HEIGHT,
        paddingLeft: PADDING_LEFT_RIGHT,
        paddingRight: PADDING_LEFT_RIGHT,
        flex: 1,

    },
    contentScrollView: {
        flex: 1,
        // minHeight: HEIGHT,
        marginBottom: 10
    },
});
