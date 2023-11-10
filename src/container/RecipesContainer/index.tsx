import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Recipes from './../../stories/screens/Recipes';
import fetchRecipes from './actions';
import i18n from '../../common/i18n';
import AppHeader from '../../common/components/AppHeader/AppHeader';
import NoConnection from '../../common/components/NoConnection';

interface Props {
    recipes: any;
    fetchRecipes: Function;
    navigation: any;
    screenProps: any;
}
interface State {
    recipes: any;
}

export class RecipesContainer extends Component<Props, State> {

    state = {
        recipes: this.props.recipes,
    };

    unSubscribeStore: Function;
    language: string;

    componentWillMount() {

        const { screenProps: { store } } = this.props;

        this.props.fetchRecipes();

        this.language = store.getState().auth.userData?.language || 'en-US';

        this.unSubscribeStore = store.subscribe(() => {
            let language = store.getState().auth.userData?.language || 'en-US';
            if (this.language !== language) {
                this.language = language;
                this.props.fetchRecipes();
            }
            let recipes = store.getState().recipes.recipes;
            this.setState({ recipes });
        });
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    render() {
        const { screenProps: { store } } = this.props;
        const { recipes } = this.state;
        return (
            <View style={styles.container}>
                {
                    this.props.screenProps.isConnectedToNetwork ?
                        null :
                        <NoConnection />
                }
                {/*<AppHeader hasBackButton={false} />*/}
                <Recipes store={store} navigation={this.props.navigation} recipes={recipes} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    }
});

const mapDispatchToProps = (dispatch: Function) => {
    return {
        fetchRecipes: () => { dispatch(fetchRecipes()) }
    }
}

const mapStateToProps = state => {
    const { recipes } = state;
    return recipes;
};
export default connect(mapStateToProps, mapDispatchToProps)(RecipesContainer);
