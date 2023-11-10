import React, {Component} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import i18n from '../../../../common/i18n';
import {Text} from "@balletworkout/components";

interface Props {
    ingredients: any;
}
interface State {}

export default class RecipeTitle extends Component<Props, State> {

    render() {
        const { ingredients } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{i18n.t('recipe.ingredients')}</Text>
                <FlatList
                    data={ingredients}
                    renderItem={({item, index}) => (
                        <View>
                            <Text
                                style={styles.ingredientText}
                                font={'Regular'}
                            >{item.unit_and_qty} {item.name}</Text>
                        </View>
                    )}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        paddingHorizontal: 20,
        marginTop: 10
    },
    title: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        marginTop: 10,
    },
    ingredient: {
        marginLeft: 0,
    },
    ingredientText: {
        fontSize: 12,
    },
});
