import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import NumericInput from 'react-native-numeric-input';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../../../utilities/Theme';

interface Props {
    setQuantity: Function;
    value: number;
}

const QuantityInput = (props: Props) => {

    const { setQuantity, value } = props;
    
    return (
        <View style={styles.container}>
            <NumericInput
                value={value}
                step={1}
                type={'up-down'}
                rounded={true}
                minValue={1}
                maxValue={99}
                onChange={(value: number) => setQuantity(value)}
                borderColor={SECONDARY_COLOR}
                initValue={value} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        marginTop: 5,
        marginBottom: 5,
    }
});

export default QuantityInput;