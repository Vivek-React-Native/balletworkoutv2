import React, {useState} from "react";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";

import starIcon from "@balletworkout/assets/images/star-icon.png";
import {Text} from "@balletworkout/components";
import AntDesignIcon from "react-native-vector-icons/AntDesign";

interface Props {
    navigation?: any
}

const GoalReview = ({navigation}: Props) => {
    const [reviewsList, setReviewsList] = useState([
        {
            name: 'Jeanne',
            rate: 4.8,
            description: 'Awesome app!!! I have a high metabolism and this app’s workouts work great for lean mass gain.'
        },
        {
            name: 'Derk',
            rate: 4.8,
            description: 'Awesome app!!! I have a high metabolism and this app’s workouts work great for lean mass gain.'
        },
        {
            name: 'Jeanne',
            rate: 4.8,
            description: 'Awesome app!!! I have a high metabolism and this app’s workouts work great for lean mass gain.'
        },
        {
            name: 'Derk',
            rate: 4.8,
            description: 'Awesome app!!! I have a high metabolism and this app’s workouts work great for lean mass gain.'
        },
        {
            name: 'Jeanne',
            rate: 4.8,
            description: 'Awesome app!!! I have a high metabolism and this app’s workouts work great for lean mass gain.'
        },
        {
            name: 'Derk',
            rate: 4.8,
            description: 'Awesome app!!! I have a high metabolism and this app’s workouts work great for lean mass gain.'
        },
    ]);
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.commentBtn}>
                <AntDesignIcon name={'edit'} size={20} color={'#032426'}/>
                <Text style={{color: '#032426', marginLeft: 5}}>Write Comment</Text>
            </TouchableOpacity>

        </View>
    );
}
export default GoalReview;
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
    },
    commentBtn: {
        marginTop: 10,
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#F2E6E6',
        borderColor: '#FFD9D9',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
    }
});
