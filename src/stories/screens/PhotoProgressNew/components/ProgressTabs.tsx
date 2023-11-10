import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import i18n from '../../../../common/i18n';
import {Text} from "@balletworkout/components";
interface Props {
    selected?: string,
    onBalletCallBack?: Function;
    onFoodCallBack?: Function;
}
const ProgressTabs = ({selected = '', onBalletCallBack = () => {}, onFoodCallBack = () => {}}: Props) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, selected === 'overview' ? styles.selectedButton: {}]}
                onPress={() => onBalletCallBack()}
            >
                <Text font={'Regular'}  style={[selected === 'overview' ? styles.selectedText: {}]}>{i18n.t('progress.TrainingOverview')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, selected === 'goal' ? styles.selectedButton: {}]}
                onPress={() => onFoodCallBack()}
            >
                <Text font={'Regular'}  style={[selected === 'goal' ? styles.selectedText: {}]}>{i18n.t("progress.Goals")}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default ProgressTabs;

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
        height: 40,
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
