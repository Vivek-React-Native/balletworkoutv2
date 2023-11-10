import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { SECONDARY_COLOR, PRIMARY_COLOR } from '../../../../utilities/Theme';
import { Button } from 'native-base';

interface Props {
    clickHandler: Function
}
interface State { }

export default class ShareBtn extends Component<Props, State> {

    render() {
        return (
            <View style={styles.container}>
                <Button style={styles.cameraBtn} onPress={() => this.props.clickHandler()}>
                    <View>
                        <Icon style={styles.icon} name="sharealt" color={SECONDARY_COLOR}/>
                    </View>
                </Button>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
    },
    icon: {
        fontSize: 25
    },
    cameraBtn: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
