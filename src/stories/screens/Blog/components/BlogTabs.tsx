import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import i18n from '@balletworkout/common/i18n';
import {Text} from "@balletworkout/components";
interface Props {
    selected?: string,
    onBalletCallBack?: Function;
    onFoodCallBack?: Function;
}
const BlogTabs = ({selected = '', onBalletCallBack = () => {}, onFoodCallBack = () => {}}: Props) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, selected === 'ballet' ? styles.selectedButton: {}]}
                onPress={() => onBalletCallBack()}
            >
                <Text font={'Regular'}  style={[selected === 'ballet' ? styles.selectedText: {}]}>Ballet</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, selected === 'food' ? styles.selectedButton: {}]}
                onPress={() => onFoodCallBack()}
            >
                <Text font={'Regular'}  style={[selected === 'food' ? styles.selectedText: {}]}>Food</Text>
            </TouchableOpacity>
        </View>
    );
}

export default BlogTabs;

const styles = StyleSheet.create({
    container: {
        height: 45,
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 10
    },
    button: {
        backgroundColor: '#f7f7f7',
        paddingHorizontal: 20,
        height: 45,
        width: 100,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    selectedButton: {
        backgroundColor: '#032426',
    },
    selectedText: {
        color: '#fff',
    }
});
