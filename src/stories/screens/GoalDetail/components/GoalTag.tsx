import React, {useState} from "react";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";

import flagIcon from "@balletworkout/assets/icons/flag.png";
import calendarIcon from "@balletworkout/assets/icons/calendar.png";
import clockIcon from "@balletworkout/assets/icons/clock.png";
import {Text} from "@balletworkout/components";

interface Props {
    navigation: any
}

const GoalTag = ({navigation}: Props) => {

    return (
        <View style={styles.tagContainer}>
            <TouchableOpacity style={styles.tagContent}>
                <Image style={styles.starIcon} resizeMode={'contain'} source={flagIcon}/>
                <Text style={[styles.tagText]} font={'Regular'}>
                    20 Exercises
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tagContent}>
                <Image style={styles.starIcon} resizeMode={'contain'} source={calendarIcon}/>
                <Text style={[styles.tagText]} font={'Regular'}>
                    Daily
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tagContent}>
                <Image style={styles.starIcon} resizeMode={'contain'} source={clockIcon}/>
                <Text style={[styles.tagText]} font={'Regular'}>
                    30 Mins
                </Text>
            </TouchableOpacity>
        </View>
    );
}
export default GoalTag;

const styles = StyleSheet.create({
    tagContainer: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: "center",
        width: '100%'
    },
    tagContent: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginRight: 5,
        backgroundColor: 'rgba(0,0,0,0.08)'
    },
    tagText: {
        fontSize: 15,
        color: '#032426',
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 2,
    },
    starIcon: {
        width: 17,
        height: 17,
        marginRight: 5,
        marginTop: -2,
        alignSelf: 'center'
    },
});
