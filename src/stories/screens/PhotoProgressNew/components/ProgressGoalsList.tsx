import React, {useState} from "react";
import {FlatList, Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {Text} from "@balletworkout/components";
import beautyPosture from "@balletworkout/assets/images/beautiful_posture.png";
import explaceHolderImage from "@balletworkout/assets/images/Ballerina_PlaceholderExercises.jpg";
import {baseServerUri} from "../../../../common/appConstants";

const ListItem = ({item, onPressHandler}) => {
    const { name, goal_image } = item;
    // console.log('goal =============================', item);
    return (
        <TouchableOpacity
            style={styles.imageRowContainer}
            onPress={() => onPressHandler(item)}
        >
            <View style={styles.imageContainer}>
                <Image
                    style={styles.mainImage}
                    resizeMode={'cover'}
                    source={(goal_image) ? { uri: goal_image} : explaceHolderImage}
                />
            </View>

            <View style={styles.textContainer}>
                <Text style={[styles.buttonText]} font={'SemiBold'}>
                    {name}
                </Text>
                <Text style={styles.textDescription} font={'Regular'}>
                    Achieved on 12/08/2021
                </Text>
            </View>
        </TouchableOpacity>
    );
};
const ProgressGoalsList = ({goals, onPressList}) => {
    return (
        <FlatList
            data={goals}
            renderItem={({item}) => (
                <ListItem item={item} onPressHandler={onPressList}/>
            )}
            contentContainerStyle={styles.container}
        />
    );
};
export default ProgressGoalsList;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        marginBottom: 155,
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#F2E6E6',
        width: 60,
        height: 60,
        borderRadius: 30
    },
    imageRowContainer: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10,
        backgroundColor: '#F2E6E6',
        padding: 5,
        borderRadius: 35
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "space-around",
        alignItems: 'flex-start',
        paddingLeft: 10
    },
    mainImage: {
        position: "absolute",
        width: 58,
        height: 58,
        backgroundColor: 'transparent',
        borderRadius: 29
    },
    buttonText: {
        marginTop: 5,
        textAlign: 'center',
        fontSize: 14,
        color: '#032426',
        marginVertical: 2
    },
    textDescription: {
        fontSize: 12,
        color: '#032426',
        marginVertical: 2
    },
    tagContainer: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
    },
    tagContent: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
        backgroundColor: '#F2E6E6',
        marginRight: 5
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
