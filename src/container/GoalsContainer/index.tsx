import React from "react";
import {StyleSheet} from "react-native";
import {Container} from 'native-base';
import GoalsScreen from "../../stories/screens/Goals";

const GoalsContainer = (props: any) => {
    return (
        <Container style={styles.container}>
            <GoalsScreen {...props}/>
        </Container>
    );
}
export default GoalsContainer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: '#ffffff',
        paddingHorizontal: 10
    },
});
