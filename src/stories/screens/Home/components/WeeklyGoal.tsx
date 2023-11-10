import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {WIDTH, HEIGHT} from '@balletworkout/utilities/Theme';
import i18n from '@balletworkout/common/i18n';
import {Text} from "@balletworkout/components";
import bgImage from "@balletworkout/assets/images/weekly-goal-bg.png";
import addGoalImg from "@balletworkout/assets/images/add-goal.png";
import beautyPosture from "@balletworkout/assets/images/beautiful_posture.png";
import balletShoe from "@balletworkout/assets/images/shoes.png";
import fullBody from "@balletworkout/assets/images/full-body-fit.png";
import helpCircle from "@balletworkout/assets/images/help-circle.png";
import {FootModal} from "../../../../common/components/FootModal";

interface Props {
    navigation: any;
}

const WeeklyGoal = ({navigation}: Props) => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View>
            <View style={styles.titleContainer}>
                <Text style={styles.textBold}>{i18n.t('home.weekly_goal')} 1/3</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image style={styles.helpCircle} resizeMode={'contain'} source={helpCircle}/>
                </TouchableOpacity>
            </View>
            <View style={styles.weeklyGoalCausal}>
                <TouchableOpacity
                    style={styles.goalButton}
                    onPress={() => navigation.navigate('goalView')}
                >
                    <View style={styles.imageContainer}>
                        <Image style={styles.bgImage} resizeMode={'contain'} source={bgImage}/>
                        <Image style={styles.mainImage} resizeMode={'contain'} source={beautyPosture}/>
                    </View>
                    <Text style={styles.buttonText} font={'Regular'}>{i18n.t('home.beautiful_posture')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.goalButton}
                    onPress={() => navigation.navigate('goalView')}
                >
                    <View style={styles.imageContainer}>
                        <Image style={styles.bgImage} resizeMode={'contain'} source={bgImage}/>
                        <Image style={styles.mainImage} resizeMode={'contain'} source={fullBody}/>
                    </View>
                    <Text style={styles.buttonText} font={'Regular'}>{i18n.t('home.full_body_fit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.goalButton}
                    onPress={() => navigation.navigate('goals')}
                >
                    <View style={styles.imageContainer}>
                        <Image style={styles.bgImage} resizeMode={'contain'} source={addGoalImg}/>
                        {/*<Image style={styles.mainImage} resizeMode={'contain'} source={balletShoe}/>*/}
                    </View>
                    <Text style={styles.buttonText} font={'Regular'}>{i18n.t('home.add_goal')}</Text>
                </TouchableOpacity>
            </View>
            <FootModal
                visible={modalVisible}
                title={i18n.t('home.weeklyGoals')}
                cancelCallBack={() => setModalVisible(false)}
            >
                <Text style={styles.textDescription}
                      font={'Regular'}>{i18n.t('home.weekly_goal_content.main')} 1/3</Text>
                <View style={styles.weeklyGoalRows}>
                    <TouchableOpacity style={styles.imageRowContainer}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.bgImage} resizeMode={'contain'} source={bgImage}/>
                            <Image style={styles.mainImage} resizeMode={'contain'} source={beautyPosture}/>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.buttonText, {textAlign: 'left', fontSize: 14}]}>
                                {i18n.t('home.beautiful_posture')}
                            </Text>
                            <Text style={styles.textDescription} font={'Regular'}>
                                {i18n.t('home.weekly_goal_content.beauty_posture')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imageRowContainer}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.bgImage} resizeMode={'contain'} source={bgImage}/>
                            <Image style={styles.mainImage} resizeMode={'contain'} source={balletShoe}/>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.buttonText, {textAlign: 'left', fontSize: 14}]}>
                                {i18n.t('home.grand_ecard')}
                            </Text>
                            <Text style={styles.textDescription} font={'Regular'}>
                                {i18n.t('home.weekly_goal_content.grand_ecard')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imageRowContainer}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.bgImage} resizeMode={'contain'} source={bgImage}/>
                            <Image style={styles.mainImage} resizeMode={'contain'} source={fullBody}/>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.buttonText, {textAlign: 'left', fontSize: 14}]}>
                                {i18n.t('home.full_body_fit')}
                            </Text>
                            <Text style={styles.textDescription} font={'Regular'}>
                                {i18n.t('home.weekly_goal_content.full_body')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </FootModal>
        </View>
    );
}

export default WeeklyGoal;

const styles = StyleSheet.create({
    textBold: {
        textAlign: 'left',
        paddingLeft: '5%',
        paddingRight: 10,
        fontSize: 20,
        color: '#032426',
        alignSelf: 'center'
    },
    textDescription: {
        textAlign: 'left',
        fontSize: 14,
        color: '#032426',
        alignSelf: 'center'
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center"
    },
    weeklyGoalCausal: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    goalButton: {
        width: WIDTH / 3 - 5
    },
    weeklyGoalRows: {
        marginTop: 10,
        flexDirection: "column",
        justifyContent: "flex-start"
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    imageRowContainer: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-start",
        paddingLeft: 10
    },
    bgImage: {
        width: WIDTH * 0.20,
        height: WIDTH * 0.20,
        aspectRatio: 1
    },
    helpCircle: {
        width: 20,
        height: 20,
        marginBottom: 5
    },
    mainImage: {
        position: "absolute",
        width: WIDTH * 0.12,
        height: WIDTH * 0.12,
        aspectRatio: 1,
    },
    buttonText: {
        marginTop: 5,
        textAlign: 'center',
        fontSize: 12,
        color: '#032426'
    },
});
