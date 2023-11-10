import React, { Component } from 'react';
import { View, Text, Modal, Alert, StyleSheet, Image } from 'react-native';
import { Button } from 'native-base';
import eventsConstants from '../eventConstants';
import accomplished from './../../../../assets/images/accomplished.png';
import { PRIMARY_COLOR } from '../../../../utilities/Theme';
import i18n from '../../../../common/i18n';
import { AppEventsLogger } from 'react-native-fbsdk';

interface Props {
    eventsEmitter: any;
    navigation: any;
};
interface State {
    isVisible: boolean;
};
export default class CompletionModal extends Component<Props, State> {

    state = {
        isVisible: false,
    }

    afterTimeNavigation: any = null;

    constructor(props: any) {
        super(props);    
        this.props.eventsEmitter.on(eventsConstants.VIDEO_SESSION_COMPLETED, (data:any) => this._onExerciseSessionCompleted(data));
        this.afterTimeNavigate;
    }

    _onExerciseSessionCompleted({subCategoryType, exerciseType, subCategory}) {
        this.afterTimeNavigation = setTimeout(() => this.afterTimeNavigate(subCategoryType, subCategory), 6000);
        if(exerciseType === 'MULTIPLE_EXERCISES') {
            AppEventsLogger.logEvent('Complete tutorial', {"success": true, "Content ID": subCategory.name});
            this.setState({isVisible: true});
        }
    }

    afterTimeNavigate(subCategoryType: string, subCategory: any) {        
        this.setState({isVisible: false});
        clearTimeout(this.afterTimeNavigation);
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.isVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View style={styles.modalBody}>
                        <Text style={styles.modalText}>{i18n.t('exercise.congratulations')}!</Text>
                        <Image source={accomplished} style={styles.accomplishedImage} />
                        <Text style={styles.modalCounterText}>{i18n.t('exercise.session_complete')}</Text>
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
        marginBottom: 20,
        color: PRIMARY_COLOR,
        fontSize: 30,
        fontFamily: 'Montserrat-SemiBold',
    },
    modalCounterText: {
        marginTop: 20,
        color: PRIMARY_COLOR,
        fontFamily: 'Montserrat-Bold',
        fontSize: 25,
    },
    accomplishedImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    }
});
