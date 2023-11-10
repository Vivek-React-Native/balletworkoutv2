import React, {Component} from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    FlatList
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {PADDING_LEFT_RIGHT, WIDTH, HEIGHT, PRIMARY_COLOR, SECONDARY_COLOR} from './../../../../utilities/Theme';
import {isIPhone, isAndroid, isIPhoneX, isIphoneSe} from './../../../../utilities/Screen';
import placeholder from './../../../../assets/images/no_goal_placeholder.jpg';
import i18n from '../../../../common/i18n';
import AutoScaleImage from '../../../../common/components/AutoScaleImage';
import AutoScaleLocalImage from '../../../../common/components/AutoScaleLocalImage';
import {Text} from "@balletworkout/components";
//const {height, width} = Dimensions.get('window');
import helpCircle from "@balletworkout/assets/images/help-circle.png";
import addGoalImg from "@balletworkout/assets/images/add-goal.png";
import {FootModal} from "../../../../common/components/FootModal";

interface Props {
    data: any;
    categories: any;
    navigation: any;
    setIapModelVisibility: Function;
    purchaseExpired: boolean;
};

interface State {
    modalVisible: boolean
}

export default class GoalCarousel extends Component<Props, State> {

    placeholder: any = [];
    state = {
        modalVisible: false,
    };

    _renderItems({item, index}) {
        const {navigation, purchaseExpired, setIapModelVisibility} = this.props;
        return item.goal_id === 0 ? (
            <TouchableOpacity
                style={styles.goalButton}
                onPress={() => navigation.navigate('categories', {
                    category: this.placeholder
                })}
            >
                <View style={styles.imageContainer}>
                    <Image style={styles.addImage} resizeMode={'contain'} source={addGoalImg}/>
                </View>
                <Text style={styles.buttonText} font={'Regular'}>{i18n.t('home.add_goal')}</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity
                style={styles.goalButton}
                onPress={() => navigation.navigate('exercises', {
                    id: item.goal_id,
                    subCategoryType: "GOAL",
                    subCategory: {...item, id: item.goal_id}
                })}
            >
                <View style={styles.imageContainer}>
                    <Image style={styles.bgImage} resizeMode={'cover'} source={{uri: item.goal_image}}/>
                </View>
                <Text style={styles.buttonText} font={'Regular'}>{item.name}</Text>
            </TouchableOpacity>
        );
    }

    onClickModalList() {
        const {navigation, purchaseExpired, setIapModelVisibility} = this.props;
        this.setState({modalVisible: false});
        if (!purchaseExpired) {
            navigation.navigate('exercises', {
                id: item.goal_id,
                subCategoryType: "GOAL",
                subCategory: {...item, id: item.goal_id}
            })
        } else {
            setTimeout(() => {
                setIapModelVisibility(true);
            }, 500);
        }
    }

    renderListItems({item, index}) {
        return (
            <TouchableOpacity
                style={styles.imageRowContainer}
                onPress={this.onClickModalList.bind(this)}
            >
                <View style={styles.imageMainContainer}>
                    <Image style={styles.mainImage} resizeMode={'cover'} source={{uri: item.goal_image}}/>
                </View>
                <View style={styles.textContainer}>
                    <Text style={[{textAlign: 'left', fontSize: 14}]}>
                        {item.name}
                    </Text>
                    <Text style={styles.textDescription} font={'Regular'}>
                        {item.description}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const {categories} = this.props;
        categories.map((category: any) => {
            if (category.type === 'GOAL') {
                this.placeholder = category;
                // console.log('placeholder++++++++++++++++++++++++', this.placeholder);
            }
        });
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.textBold}>{i18n.t('home.weeklyGoals')}</Text>
                    <TouchableOpacity onPress={() => this.setState({modalVisible: true})}>
                        <Image style={styles.helpCircle} resizeMode={'contain'} source={helpCircle}/>
                    </TouchableOpacity>
                </View>
                <View style={{paddingLeft: 10, paddingRight: 20, marginTop: 10}}>
                    <FlatList
                        data={[...this.props.data, {
                            'goal_id': 0,
                            'name': i18n.t('home.add_goal'),
                        }]}
                        renderItem={({item, index}) => this._renderItems({item, index})}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        />
                </View>
                <FootModal
                    visible={this.state.modalVisible}
                    title={i18n.t('home.weeklyGoals')}
                    cancelCallBack={() => this.setState({modalVisible: false})}
                    >
                    <Text style={styles.textDescription}
                          font={'Regular'}>{i18n.t('home.weekly_goal_content.main')}</Text>
                    <View style={[styles.weeklyGoalRows, {maxHeight: HEIGHT * 0.5}]}>
                        <FlatList
                            data={this.props.data}
                            renderItem={({item, index}) => this.renderListItems({item, index})}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </FootModal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: WIDTH,
    },
    containerPlaceholder: {
        flex: -1,//isIPhone ? 1.4 : 1.7,
        width: WIDTH,
        aspectRatio: 1.63
    },
    item: {
        flex: 1,
        alignSelf: 'stretch',
        height: '100%',
        alignItems: 'center',
    },
    carouselImage: {
        //width: WIDTH - (PADDING_LEFT_RIGHT * 2),
        resizeMode: 'contain',
        //aspectRatio: 1.6,
        //height: '100%',
    },
    carouselTextWrapper: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#dfc2c2',
        flex: 0,
        alignSelf: 'stretch'
    },
    carouselText: {
        color: PRIMARY_COLOR,
        fontFamily: 'Montserrat-Medium',
        fontSize: isIphoneSe ? 13 : 15,
        alignSelf: "center",
        textAlign: 'center',
    },
    carouselTextPlaceholder: {
        color: PRIMARY_COLOR,
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 17,
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 10,
    },
    ////////////////////////////////////////////////////
    titleContainer: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center"
    },
    helpCircle: {
        width: 20,
        height: 20,
        marginBottom: 5
    },
    textBold: {
        textAlign: 'left',
        paddingLeft: 15,
        paddingRight: 10,
        fontSize: WIDTH * 0.06,
        color: '#032426',
        alignSelf: 'center'
    },
    goalButton: {
        width: WIDTH / 3 - 12,
        borderRadius: 500,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: WIDTH / 3 - 30,
        height: WIDTH / 3 - 30,
        borderRadius: (WIDTH / 3 - 30) / 2,
        borderWidth: 5,
        borderColor: '#F2E6E6'
    },
    bgImage: {
        width: WIDTH / 3 - 40,
        height: WIDTH / 3 - 40,
        borderRadius: (WIDTH / 3 - 40) / 2,
    },
    addImage: {
        width: 40,
        height: 40,
    },
    imageMainContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: 94,
        height: 94,
        borderRadius: 47,
        borderWidth: 5,
        borderColor: '#F2E6E6'
    },
    mainImage: {
        width: 84,
        height: 84,
        borderRadius: 42,
    },
    buttonText: {
        marginTop: 5,
        textAlign: 'center',
        fontSize: 12,
        color: '#032426',
        width: WIDTH / 3 - 28,
    },
    textDescription: {
        textAlign: 'left',
        fontSize: WIDTH * 0.04,
        color: '#032426',
        alignSelf: 'center'
    },
    weeklyGoalCausal: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    weeklyGoalRows: {
        marginTop: 10,
        flexDirection: "column",
        justifyContent: "flex-start"
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
});
