import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Blog from '../../stories/screens/Blog';
import NoConnection from '../../common/components/NoConnection';

interface Props {
    navigation: any;
    screenProps: any;
};
interface State { };

export default class BLogContainer extends Component<Props, State> {

    render() {
        return (
            <View style={styles.container}>
                {
                    this.props.screenProps.isConnectedToNetwork ?
                        null :
                        <NoConnection />
                }

                <Blog navigation={this.props.navigation} store={this.props.screenProps.store} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
