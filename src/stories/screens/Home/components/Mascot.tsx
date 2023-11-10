import React, {Component} from 'react';
import {View, Image, StyleSheet, Dimensions, TouchableWithoutFeedback} from 'react-native';
import mascot from './../../../../assets/images/logo-concept.png';

const {width, height} = Dimensions.get('window');

interface Props {
    navigation: any;
};

interface State {
};
export default class Mascot extends Component<Props, State> {

    render() {
        const {navigation} = this.props;
        return (
            <View style={[styles.container]}>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('shop')}>
                    <View style={styles.mascotWrapper}>
                        <Image
                            style={styles.mascot}
                            source={mascot}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        marginTop: 10,
    },
    mascotWrapper: {
        marginTop: 10,
        width: 37,
        height: 37,
    },
    mascot: {
        resizeMode: 'cover',
        width: 31,
        height: 31,
    }
});
