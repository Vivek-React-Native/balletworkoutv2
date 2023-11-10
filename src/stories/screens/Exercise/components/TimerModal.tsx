import React, { Component } from 'react';
import { View, Text, Modal, Alert, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import eventConstants from './../eventConstants';
import { PRIMARY_COLOR } from '../../../../utilities/Theme';
import i18n from '../../../../common/i18n';

interface Props {
    eventsEmitter: any;
};
interface State {
    isVisible: boolean;
    counter: number;
};
export default class TimerModal extends Component<Props, State> {

    state = {
        counter: 5,
        isVisible: true
    }

    counterInstance:any = null;

    counter() {
        this.counterInstance = setInterval(() => this.decreaseCounter(), 1000);
    }

    decreaseCounter() {
        if(this.state.counter > 0) {
            let counterVal = this.state.counter - 1;
            this.setState({counter: counterVal});
        } else {
            clearInterval(this.counterInstance);
            this.setState({counter: 5, isVisible: false});
            this.props.eventsEmitter.emit(eventConstants.WAIT_TIMER_MODAL_CLOSED);
        }
    }

    componentDidMount() {
        this.counter()
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.isVisible}
                    onRequestClose={() => {}}>
                    <View style={styles.modalBody}>
                        <Text style={styles.modalText}>{i18n.t('exercise.get_ready_in')}!</Text>
                        <Text style={styles.modalCounterText}>{this.state.counter}</Text>
                    </View>
                </Modal>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginTop: 22,
        flex: -1,
        backgroundColor: '#ffffff',
    },
    modalBody: {
        flex: 1,
        marginTop: 22,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalText: {
        color: PRIMARY_COLOR,
        fontSize: 30,
        fontFamily: 'Montserrat-SemiBold',
    },
    modalCounterText: {
        color: PRIMARY_COLOR,
        fontFamily: 'Montserrat-Bold',
        fontSize: 100,
    }
});
