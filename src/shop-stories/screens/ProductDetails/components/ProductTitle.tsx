import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SECONDARY_COLOR } from '../../../../utilities/Theme';

interface Props {
    title: string;
}

const ProductTitle = (props: Props) => {

    const { title } = props;
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>{ title }</Text>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
    },
    titleText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: SECONDARY_COLOR,
    },
});

export default ProductTitle;
