import React, { Component } from 'react';
import { Modal, View, StyleSheet, Text } from 'react-native';
import { WIDTH, HEIGHT, PRIMARY_COLOR } from '../../../utilities/Theme';
import i18n from '../../i18n';
import AutoScaleLocalImage from '../AutoScaleLocalImage';
import ShoeImage from './../../../assets/images/ballet_shoe.png';
import { hexToRGBA } from './../../../utilities/Functions';
import { Button } from 'native-base';

interface Props {
    visibility: boolean;
    setVisibility: Function;
};
interface State { };

export default class TrialPopup extends Component<Props, State> {

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
                visible={this.props.visibility}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modelBody}>
                        <Text style={styles.headingText}>{i18n.t('common.free_trial_popup_heading')}</Text>
                        <AutoScaleLocalImage uri={ShoeImage} height={null} width={WIDTH * 0.4} style={styles.image} />
                        <Button large iconLeft style={styles.modalButton} onPress={() => this.props.setVisibility(false)}>
                            <Text style={styles.modalButtonText}>{i18n.t('common.free_trial_popup_btn_text')}</Text>
                        </Button>
                    </View>
                </View>

            </Modal>
        );
    }

}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: hexToRGBA(PRIMARY_COLOR, .7),
        width: WIDTH,
        height: HEIGHT,
        top: 0,
    },
    modelBody: {
        width: WIDTH * .9,
        borderRadius: 20,
        backgroundColor: '#fff',
        paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 20,
        paddingRight: 20,
    },
    headingText: {
        fontFamily: 'Montserrat-Regular',
        color: PRIMARY_COLOR,
        fontSize: 24,
        textAlign: 'center',
    },
    image: {
        alignSelf: 'center',
        marginTop: 60,
        marginBottom: 60,
    },
    modalButton: {
        backgroundColor: PRIMARY_COLOR,
        padding: 20,
        alignSelf: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 20,
    },
});
