import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spinner } from 'native-base';
import { WIDTH, HEIGHT, SECONDARY_COLOR } from '../../utilities/Theme';

interface Props {
    color?: string;
    top?: boolean
}

const Loader = ({color, top = false}: Props) => {
    return (
        <View style={[styles.container, {justifyContent: top ? 'flex-start': 'center'}]}>
            <Spinner color={color ? color: SECONDARY_COLOR} style={top ? {marginTop: 50} : {}}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: -0,
        zIndex: 99999999,
        alignItems: 'center',
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: 'rgba(255,255,255, 0.7)',
    }
});

export default Loader;
