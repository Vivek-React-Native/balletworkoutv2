import React, {useState} from "react";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";

import flagIcon from "@balletworkout/assets/icons/flag.png";
import calendarIcon from "@balletworkout/assets/icons/calendar.png";
import clockIcon from "@balletworkout/assets/icons/clock.png";
import {Text} from "@balletworkout/components";
import i18n from "../../../../common/i18n";
import { WIDTH,HEIGHT } from "../../../../utilities/Theme";

interface Props {
    navigation: any;
    length?: number
}

const GoalTag = ({navigation, length = 0}: Props) => {

    return (
        <View style={styles.tagContainer}>
            <TouchableOpacity style={[styles.tagContent,{flex: 1.5}]}>
                <Image style={styles.starIcon} resizeMode={'stretch'} source={flagIcon}/>
                <Text style={[styles.tagText]} font={'Regular'}>
                    {length + ' '}{i18n.t('exercises.Exercises')}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tagContent,{marginHorizontal: WIDTH * 0.01 }]}>
                <Image style={styles.starIcon} resizeMode={'stretch'} source={calendarIcon}/>
                <Text style={[styles.tagText]} font={'Regular'}>
                {i18n.t('exercises.Daily')}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tagContent]}>
                <Image style={styles.starIcon} resizeMode={'stretch'} source={clockIcon}/>
                <Text style={[styles.tagText]} font={'Regular'}>
                    {'30 '}{i18n.t('exercises.Mins')}
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
        justifyContent:'space-between'
    },
    tagContent: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent:'center',
        paddingVertical: HEIGHT * 0.01,
        paddingHorizontal: WIDTH * 0.05,
        backgroundColor: 'rgba(0,0,0,0.08)',
        borderRadius: 10,
        flex: 1,
    },
    tagText: {
        fontSize: WIDTH * 0.03,
        color: '#032426',
        paddingLeft: WIDTH * 0.02,
    },
    starIcon: {
        width: WIDTH * 0.05,
        height: WIDTH * 0.05,
    },
});
