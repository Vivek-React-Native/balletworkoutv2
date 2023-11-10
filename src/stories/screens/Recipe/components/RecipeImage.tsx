import React, {Component} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { WIDTH } from './../../../../utilities/Theme';
import { baseServerUri } from './../../../../common/appConstants';

interface Props {
    recipeImage: string;
    navigation: any;
}
interface State {}

export const PARALAX_HEIGHT = 400;

export default class RecipeImage extends Component<Props, State> {


    render() {
        const { recipeImage } = this.props;
        return (
            <View>
                <Image source={{ uri: baseServerUri + recipeImage, width: WIDTH, height: PARALAX_HEIGHT,}}/>
                <View style={styles.overlay}>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        width: WIDTH,
        backgroundColor: 'rgba(0,0,0,0)',
        height: PARALAX_HEIGHT,
    }
});
