import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader from '../../common/components/AppHeader/AppHeader';
import PhotoProgressCamera from '../../stories/screens/PhotoProgressCamera';
import NoConnection from '../../common/components/NoConnection';

interface Props {
    navigation: any;
    screenProps: any;
}
interface State { }

export default class PhotoProgressCameraContainer extends Component<Props, State> {

    render() {

        const { navigation, screenProps: { store } } = this.props;

        return (
            <View style={styles.container}>
                {
                    this.props.screenProps.isConnectedToNetwork ?
                        null :
                        <NoConnection />
                }
                <AppHeader navigation={navigation} />
                <PhotoProgressCamera store={store} navigation={navigation} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
});
