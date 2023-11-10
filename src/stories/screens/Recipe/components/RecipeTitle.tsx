import React, {Component} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Text} from "@balletworkout/components";
import clockIcon from "@balletworkout/assets/icons/clock.png";

interface Props {
    title: string;
    preparationTime: string;
}
interface State {}

export default class RecipeTitle extends Component<Props, State> {


    render() {
        const { title, preparationTime } = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.tagContent}>
                    <Image style={styles.starIcon} resizeMode={'contain'} source={clockIcon}/>
                    <Text style={[styles.tagText]} font={'SemiBold'}>
                        {preparationTime}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    tagContent: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 10,
        marginRight: 5,
        backgroundColor: '#f7f7f7',
        width: 100,
    },
    tagText: {
        fontSize: 12,
        color: '#032426',
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 2,
    },
    starIcon: {
        width: 15,
        height: 13,
        marginRight: 5,
        marginTop: -2,
        alignSelf: 'center'
    },
});
