import React, { Component } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { List, ListItem, Card, CardItem, Right, Left, Body } from 'native-base';
import RecipeList from './components/RecipeList';
import { PADDING_LEFT_RIGHT, HEIGHT, PRIMARY_COLOR, WIDTH } from './../../../utilities/Theme';
import { baseServerUri } from './../../../common/appConstants';
import Loader from '../../../common/components/Loader';
import i18n from '../../../common/i18n';
import { AppEventsLogger } from 'react-native-fbsdk';
import SpanHeader from "../../../common/components/SpanHeader";
import RecipesTabs from "./components/RecipesTabs";

interface Props {
    recipes: any;
    navigation: any;
    store: any;
}
interface State {
    isLoading: boolean;
    filter: string;
    LoadImage:Boolean;
}

export default class Recipes extends Component<Props, State> {

    unSubscribeStore: Function;

    state = {
        isLoading: false,
        filter: '',
        LoadImage:true
    };

    componentDidMount() {

        const { store } = this.props;

        AppEventsLogger.logEvent('View content', {"Content ID": "Recipes", "Content Type": "Recipes"});

        this.unSubscribeStore = store.subscribe(() => {
            let isLoading = store.getState().recipes.isLoading;
            this.setState({ isLoading });
        });
    }

    renderRecipeItem(recipe: any, key: number) {
        return (
            <Card key={key} style={styles.recipeCard}>
                <CardItem style={styles.recipeCardItem}>
                    <Left style={styles.recipeCardLeft}>
                        <Image style={styles.recipeCardImage} source={{ uri: baseServerUri + recipe.recipe_image_thumb }} />
                    </Left>
                    <Body style={styles.recipeCardBody}>
                        <Text>{recipe.title}</Text>
                    </Body>
                </CardItem>
            </Card>
        );
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    render() {
        const { recipes } = this.props;
        return (
            <View style={styles.container}>
                <SpanHeader
                    title={i18n.t('recipe.foodSuggestion')}
                    subtitle={i18n.t('recipe.ChooseMeal')}
                    navigation={this.props.navigation}
                    hideBack
                    hideMenu
                />
                {!this.state.isLoading || <Loader />}
                    <View style={styles.recipeContainer}>
                        {/*<RecipesTabs*/}
                        {/*    selected={this.state.filter}*/}
                        {/*    onHealtyCallBack={() => this.setState({filter:  'healthy'})}*/}
                        {/*    onDeleciousCallBack={() => this.setState({filter:  'delicious'})}*/}
                        {/*    onPopularCallBack={() => this.setState({filter:  'most'})}*/}
                        {/*/>*/}
                        <RecipeList navigation={this.props.navigation} recipes={recipes} />
                    </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    recipeScroll: {
        // minHeight: HEIGHT,
    },
    recipeContainer: {
        flex: 1,
        paddingHorizontal: PADDING_LEFT_RIGHT,
    },
    recipeCard: {
        marginTop: 15,
    },
    recipeCardItem: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0
    },
    recipeCardLeft: {
        flex: 0,
        width: 100,
        height: 100,
        marginRight: 15,
    },
    recipeCardBody: {
        paddingTop: 15,
        paddingBottom: 15,
    },
    recipeCardImage: {
        width: 100,
        height: 100,
    },
    recipeListTitle: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 18,
        color: PRIMARY_COLOR,
        textAlign: 'center',
        alignSelf: 'center',
    },
    recipeListTitleWrapper: {
        flex: 0,
        padding: 15
    }
});
