import React, { Component } from 'react';
import { View, StyleSheet, Text, Picker, TextInput } from 'react-native';
import { Button, Left, Body, Right } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { SECONDARY_COLOR, PRIMARY_COLOR } from '../../../../utilities/Theme';
import i18n from '../../../../common/i18n';
import SwitchSelector from 'react-native-switch-selector';
import ModalSelector from 'react-native-modal-selector';
import { BalletShoeIcon } from './../../../../assets/icons/Svgs';


interface Props {
    setWhen: Function;
    setGoal: Function;
    takePicture: Function;
    store: any;
    showSelectButton: boolean;
    goals: any;
    photoType: string;
};
interface State {
    when: string;
};

export default class OptionsBar extends Component<Props, State> {

    state = {
        when: this.props.photoType,
    };

    goalSelector: any;

    componentWillMount() {
        const { store } = this.props;
    }

    componentDidMount() {
        this.setWhen(this.props.photoType);
    }

    setWhen(value: any) {
        const { setWhen } = this.props;
        this.setState({ when: value });
        setWhen(value);
    }

    setGoal(goal: any) {
        const { setGoal } = this.props;
        setGoal(goal.goal_id, goal.name);
    }

    render() {

        const { takePicture, goals } = this.props;
        // console.log('goals:', goals);
        return (
            <View style={styles.container}>
                <Left style={styles.sideChildComponent}>
                    {/*<ModalSelector*/}
                    {/*    data={this.props.goals}*/}
                    {/*    ref={(selector: any) => { this.goalSelector = selector; }}*/}
                    {/*    onChange={(goal: any) => this.setGoal(goal)}*/}
                    {/*    labelExtractor={(goal: any) => 'Test'}*/}
                    {/*    // optionContainerStyle={{ backgroundColor: "#fff" }}*/}
                    {/*    // cancelContainerStyle={{ backgroundColor: "#fff", borderRadius: 10 }}*/}
                    {/*    // optionTextStyle={{ color: PRIMARY_COLOR, fontFamily: 'Montserrat-Regular' }}*/}
                    {/*    // selectedItemTextStyle={{ color: SECONDARY_COLOR, fontFamily: 'Montserrat-Regular' }}*/}
                    {/*    // cancelTextStyle={{ color: PRIMARY_COLOR, fontFamily: 'Montserrat-Regular' }}*/}
                    {/*    customSelector={*/}
                    {/*        <View style={styles.modalSelectorContent}>*/}
                    {/*            <Button transparent block onPress={() => this.goalSelector.open()}>*/}
                    {/*                <BalletShoeIcon width="27" height="27" color={SECONDARY_COLOR} />*/}
                    {/*                /!* <Icon style={styles.switchIcon} name="ios-body" color={SECONDARY_COLOR} /> *!/*/}
                    {/*            </Button>*/}
                    {/*            <Text style={styles.goalsButtonText}>{i18n.t('common.goal_title')}</Text>*/}
                    {/*        </View>*/}
                    {/*    } />*/}
                    <View style={styles.modalSelectorContent}>
                        <Button transparent block onPress={() => this.setGoal(goals[0])}>
                            <BalletShoeIcon width="27" height="27" color={SECONDARY_COLOR} />
                            {/* <Icon style={styles.switchIcon} name="ios-body" color={SECONDARY_COLOR} /> */}
                        </Button>
                        <Text style={styles.goalsButtonText}>{i18n.t('common.goal_title')}</Text>
                    </View>
                </Left>
                <Body style={styles.centerChildComponent}>
                    {/* <View style={styles.container}> */}
                    <Button style={{ alignSelf: 'center' }} transparent onPress={() => takePicture()}>
                        <Icon style={styles.icon} name="ios-camera" color={SECONDARY_COLOR} />
                    </Button>
                    <Text style={styles.goalsButtonText}>{i18n.t('common.camera_button').toUpperCase()}</Text>
                    {/* </View> */}
                </Body>
                <Right style={styles.sideChildComponent}>
                    {/* <View style={styles.switchSelectorWrapper}> */}
                    <SwitchSelector
                        initial={this.props.photoType === 'before' ? 0 : 1}
                        onPress={(value: string) => this.setWhen(value)}
                        textColor={PRIMARY_COLOR}
                        selectedColor={SECONDARY_COLOR}
                        buttonColor={PRIMARY_COLOR}
                        borderColor={PRIMARY_COLOR}
                        options={[
                            { label: i18n.t('progress.before_text'), value: 'before' },
                            { label: i18n.t('progress.after_text'), value: 'after', },
                        ]} />
                    {/* </View> */}
                    {/* <Text style={styles.goalsButtonText}>{i18n.t('common.after_before_btn')}</Text> */}
                </Right>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 3,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
        left: 0,
        alignSelf: 'stretch',
    },
    icon: {
        fontSize: 40
    },
    switchIcon: {
        fontSize: 40,
    },
    centerChildComponent: {
        flex: 1,
        alignItems: 'center',
    },
    sideChildComponent: {
        flex: .8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalsButtonText: {
        color: SECONDARY_COLOR,
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        textAlign: 'center'
    },
    modalSelectorContent: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch'
    },
    switchSelectorWrapper: {
        flex: 1,
        alignSelf: 'stretch'
    }
});

