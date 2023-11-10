import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HTML from 'react-native-render-html';
import { PRIMARY_COLOR } from '../../../../utilities/Theme';
import i18n from '../../../../common/i18n';
import {Text} from "@balletworkout/components";

interface Props {
    recipe: string;
}
interface State { }

export default class RecipeTitle extends Component<Props, State> {


    render() {
        const { recipe } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{i18n.t('recipe.recipe_title')}</Text>
                <HTML html={recipe} tagsStyles={tagStyles} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    recipeText: {
        color: PRIMARY_COLOR,
    },
    title: {
        fontSize: 16,
        marginTop: 10,
    },
});

const tagStyles = {
    p: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
    }
};
