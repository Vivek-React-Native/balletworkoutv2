import React from "react";
import {StyleSheet, View} from "react-native";
import {Container} from 'native-base';
import GoalDetailScreen from "../../stories/screens/GoalDetail";

const GoalDetailContainer = (props: any) => {
    return (
        <View style={styles.container}>
            <GoalDetailScreen {...props}/>
        </View>
    );
}
export default GoalDetailContainer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});
