import React, { Component } from 'react';
import { Modal, View, StyleSheet, Text, TouchableWithoutFeedback, Platform, Alert } from 'react-native';
import { Button, Toast } from 'native-base';
import { connect } from 'react-redux';
import { WIDTH, HEIGHT, SECONDARY_COLOR, PRIMARY_COLOR } from './../../../utilities/Theme';
import { addPurchaseData, addPurchaseDataFailure, addPurchaseDataSuccess } from './actions';
import i18n from '../../i18n';
import RNIap, {
    purchaseUpdatedListener,
    purchaseErrorListener,
    ProductPurchase,
    PurchaseError,
    SubscriptionPurchase
} from 'react-native-iap';
import { isIphoneSe } from '../../../utilities/Screen';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../Loader';
import http from '../../tools/axiosClient';
import { exportedStore } from '../../../store';
import { verifyingPurchaseSuccess } from '../../auth/actions';
import { hexToRGBA } from '../../../utilities/Functions';
import { t } from 'i18next';
// import { AppEventsLogger } from 'react-native-fbsdk';

interface Props {
    visibility: boolean;
    onCancel: Function;
    onSuccess?: Function;
    addPurchaseData?: Function;
    store: any;
};
interface State {
    selectedPackage: string;
    isLoading: boolean;
    isPurchaseValid: boolean;
    subscriptionDataFetched: any;
    availablePurchases: any;
};

export class InAppPurchaseModal extends Component<Props, State> {

    unSubscribeStore: Function;
    _isMounted: boolean = false;
    purchaseUpdateSubscription: any = null;
    purchaseErrorSubscription: any = null;

    state = {
        selectedPackage: '',
        isLoading: false,
        isPurchaseValid: false,
        subscriptionDataFetched: [],
        availablePurchases: [],
    };

    public static defaultProps: Partial<Props> = {
        visibility: false,
    };

    purchaseUpdateListener() {
        this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: ProductPurchase | SubscriptionPurchase) => {

            this.setState({ isLoading: false });

            // console.log('Purchase Data', purchase);

            let packagePurchased = this.state.subscriptionDataFetched.filter((item: any) => item.productId === purchase.productId);

            // Log purchase fb event
            // AppEventsLogger.logEvent('Purchase', { "Content ID": packagePurchased[0].productId, "Content Type": "Subscription", "Currency": packagePurchased[0].currency, "ValueToSum": packagePurchased[0].price });

            let postData = {
                platform: Platform.OS,
                purchaseData: purchase,
                productId: purchase.productId,
            };

            //this.props.addPurchaseData(data);

            let token = exportedStore.getState().auth.tokenData.token;
            let selectedLanguage = i18n.language;

            try {
                const { data } = await http().post('in-app-purchase/add-purchase', postData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Accept-Language': selectedLanguage
                    }
                })
                // console.log(data);
                exportedStore.dispatch(addPurchaseDataSuccess(data.data));
                exportedStore.dispatch(verifyingPurchaseSuccess(data.data.expiryTime));

                // Log Add payment info Fb event
                // AppEventsLogger.logEvent('Add payment info', {"Success": true});
                if (Platform.OS === 'ios') {
                    RNIap.finishTransactionIOS(purchase.transactionId);
                } else if (Platform.OS === 'android') {
                    // If not consumable
                    RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
                }

                if (this.props.onCancel)
                    this.props.onCancel();
            } catch (e) {
                if (typeof e.response !== 'undefined') {
                    exportedStore.dispatch(addPurchaseDataFailure(e.response));
                    // console.log(e.response);
                }
                if (this.props.onCancel)
                    this.props.onCancel();
            }

        });
    };

    purchaseErrorListener() {
        this.purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
            // console.log('purchaseErrorListener', error);
            Alert.alert('Purchase Error', error.message);
        });
    };

    async getAvailablePurchases() {
        var availablePurchases = await RNIap.getAvailablePurchases();

        if (availablePurchases.length > 0) {
            this.setState({ availablePurchases });
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        this.selectPackage(this.packages['3months'].package);

        this.unSubscribeStore = exportedStore.subscribe(() => {
            let state = exportedStore.getState();

            let isLoading = state.inAppPurchase.isLoading || state.auth.isLoading;

            if (this._isMounted) {
                this.setState({ isLoading });
            }
        });

        // RNIap.initConnection().then(() => {

        try {
            const isConnected = await RNIap.initConnection();

            // proceed only if connected to store
            if (isConnected) {
                if (this._isMounted) {
                    this.setState({ isLoading: true });
                }
                const subscriptionDataFetched = await RNIap.getSubscriptions([
                    this.packages['1month'].package,
                    this.packages['3months'].package,
                    this.packages['12months'].package
                ])

                if (this._isMounted) {
                    this.setState({ subscriptionDataFetched });
                    this.setState({ isLoading: false });
                }

                // fulsh any failled purchases
                RNIap.flushFailedPurchasesCachedAsPendingAndroid();
            }

        } catch (err: any) {
            // console.log(err.message);
            if (this._isMounted) {
                this.setState({ isLoading: false });
            }
            if (Platform.OS === 'ios') {
                Alert.alert("Error", err.userInfo['NSUnderlyingError'].userInfo['NSLocalizedFailureReason']);
            }
        }

        this.purchaseUpdateListener();
        this.purchaseErrorListener();
    }

    packages: any = {
        '1month': {
            package: Platform.select({
                ios: "be.balletworkout.app.amonth",
                android: "be.balletworkout.app.amonth",
            }),
            price: Platform.select({ ios: "€9.99", android: "€9.99" }),
            perMonthPrice: Platform.select({ ios: "€9.99/" + i18n.t('common.month'), android: "€9.99/" + i18n.t('common.month') })
        },
        '3months': {
            package: Platform.select({
                ios: "be.balletworkout.app.a3month",
                android: "be.balletworkout.app.a3month",
            }),
            price: Platform.select({ ios: "€22.99", android: "€22.99" }),
            perMonthPrice: Platform.select({ ios: "€7.66/" + i18n.t('common.month'), android: "€7.66/" + i18n.t('common.month') })
        },
        '12months': {
            package: Platform.select({
                ios: "be.balletworkout.app.ayear",
                android: "be.balletworkout.app.ayear",
            }),
            price: Platform.select({ ios: "€59.99", android: "€59.99" }),
            perMonthPrice: Platform.select({ ios: "€4.99/" + i18n.t('common.month'), android: "€4.99/" + i18n.t('common.month') })
        },
    };

    _onCancelButtton() {
        this.setState({ selectedPackage: '' });
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    async buyPackage() {
        try {
            const isConnected = await RNIap.initConnection();

            if (!isConnected) {
                if (Platform.OS === 'ios')
                    Alert.alert("Itunes Connection Error", "Cannot connect to itunes");
                return;
            }
            // fulsh any failled purchases

            if (Platform.OS === "android") {
                RNIap.flushFailedPurchasesCachedAsPendingAndroid();
            }

            this.setState({ isLoading: true });
            if (this.state.selectedPackage === "") {
                Toast.show({
                    text: i18n.t('common.select_package_warning'),
                    position: 'top',
                });
                this.setState({ isLoading: false });
                return;
            }

            if (this.state.availablePurchases.length > 0) {

                let token = exportedStore.getState().auth.tokenData.token;

                try {
                    let purchaseStatusResponse = await http().post(`user/verify-purchase`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });

                    let { data: { expiry } } = purchaseStatusResponse;

                    let isPurchaseValid = expiry - Date.now() > 0
                    await this.setState({ isPurchaseValid });

                } catch (e) {
                    Alert.alert("Error", `Server Error: ${e.message}`);
                }

                if (this.state.isPurchaseValid) {
                    this.setState({ isLoading: false });
                    Alert.alert(i18n.t("common.active_subs_message"));
                    return;
                }

            }

            let packageName: string = this.state.selectedPackage;
            await RNIap.requestSubscription(packageName);
            this.setState({ isLoading: false });
        } catch (e) {
            this.setState({ isLoading: false });
            if (Platform.OS === 'ios') {
                Alert.alert("Error", e.userInfo['NSUnderlyingError'].userInfo['NSLocalizedFailureReason']);
                // this.props.onCancel()
                return;
            }
        }

    }

    selectPackage(packageName: string) {
        this.setState({ selectedPackage: packageName });
    }

    componentWillUnmount() {
        if (this.purchaseUpdateSubscription) {
            this.purchaseUpdateSubscription.remove();
            this.purchaseUpdateSubscription = null;
        }
        if (this.purchaseErrorSubscription) {
            this.purchaseErrorSubscription.remove();
            this.purchaseErrorSubscription = null;
        }
        this._isMounted = false;
        this.unSubscribeStore();
    }

    render() {

        return (
            <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
                visible={this.props.visibility}>

                <View style={styles.modalContainer}>
                    {!this.state.isLoading || <Loader />}
                    <View style={styles.modalContent}>

                        <LinearGradient colors={['rgba(70,76,110,1)', 'rgba(210,149,159,1)']} style={styles.linearGradientBackground}>

                            <View style={styles.modalTitleWrapper}>
                                <Text style={styles.modalTitle}>{i18n.t('common.in_app_purchase_modal_title')}</Text>
                            </View>

                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>{i18n.t('common.in_app_purchase_modal_text')}</Text>
                            </View>

                            <View style={styles.packagesContainer}>
                                <View style={[styles.packages, { marginLeft: 0 }, styles.packageOne, this.state.selectedPackage === this.packages['1month'].package ? styles.packageOneSelected : {}]}>
                                    <TouchableWithoutFeedback onPress={() => this.selectPackage(this.packages['1month'].package)}>
                                        <View>
                                            <Text style={[styles.packageTitle, styles.text]}>Let's Try</Text>
                                            <Text style={[styles.price, styles.text]}>{this.packages['1month'].price}</Text>
                                            <Text style={[styles.price, styles.text]}>1 {i18n.t('common.month')}</Text>
                                            <Text style={[styles.subPrice, styles.text]}>{this.packages['1month'].perMonthPrice}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>

                                <View style={[styles.packages, styles.packageTwo, this.state.selectedPackage === this.packages['3months'].package ? styles.packageTwoSelected : {}]}>
                                    <TouchableWithoutFeedback onPress={() => this.selectPackage(this.packages['3months'].package)}>
                                        <View>
                                            <Text style={[styles.packageTitle, styles.text]}>Seasonal</Text>
                                            <Text style={[styles.price, styles.text]}>{this.packages['3months'].price}</Text>
                                            <Text style={[styles.price, styles.text]}>3 {i18n.t('common.months')}</Text>
                                            <Text style={[styles.subPrice, styles.text]}>{this.packages['3months'].perMonthPrice}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>

                                <View style={[styles.packages, styles.packageThree, this.state.selectedPackage === this.packages['12months'].package ? styles.packageThreeSelected : {}]}>
                                    <TouchableWithoutFeedback onPress={() => this.selectPackage(this.packages['12months'].package)}>
                                        <View>
                                            <Text style={[styles.packageTitle, styles.textPackageThree]}>Year</Text>
                                            <Text style={[styles.price, styles.textPackageThree]}>{this.packages['12months'].price}</Text>
                                            <Text style={[styles.price, styles.textPackageThree]}>12 {i18n.t('common.months')}</Text>
                                            <Text style={[styles.subPrice, styles.textPackageThree]}>{this.packages['12months'].perMonthPrice}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>

                            <View style={styles.buttonWrapper}>

                                <Button
                                    transparent
                                    onPress={() => this.buyPackage()}
                                    style={styles.startButton}>
                                    <Text style={styles.startButtonText}>{i18n.t('common.package_start_now').toUpperCase()}</Text>
                                </Button>

                                <Button block transparent onPress={() => this._onCancelButtton()}>
                                    <Text style={styles.cancelButtonText}>{i18n.t('common.cancel_button_text')}</Text>
                                </Button>

                            </View>
                        </LinearGradient>
                    </View>

                </View>

            </Modal>
        );
    }

}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: hexToRGBA(PRIMARY_COLOR, .3),
    },
    linearGradientBackground: {
        padding: isIphoneSe ? 10 : 15,
        paddingTop: isIphoneSe ? 20 : 30,
        paddingBottom: isIphoneSe ? 20 : 30,
        borderRadius: 12,
    },
    modalContent: {
        backgroundColor: '#fff',
        width: isIphoneSe ? WIDTH * .95 : WIDTH * .9,
        borderWidth: 3,
        borderRadius: 15,
        borderColor: SECONDARY_COLOR,
    },
    modalTitleWrapper: {
        flex: -1,
    },
    modalTitle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: isIphoneSe ? 17 : 20,
        marginBottom: 10,
        textAlign: 'center',
        color: '#fff',
        marginTop: 18
    },
    infoContainer: {
    },
    infoText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: isIphoneSe ? 14 : 17,
        flexWrap: 'wrap',
        textAlign: 'center',
        color: '#fff',
        marginTop: 15
    },
    infoText2: {
        fontFamily: 'Montserrat-Medium',
        fontSize: isIphoneSe ? 14 : 14,
        flexWrap: 'wrap',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 15,
        marginTop: 10,
    },
    packagesContainer: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        alignSelf: 'center',
        marginTop: 35
    },
    packages: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'stretch',
        aspectRatio: 1 / 1.5,
        flexDirection: 'column',
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 10,
        marginLeft: 7,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 3,
        paddingRight: 3,
    },
    packageOne: {
        backgroundColor: PRIMARY_COLOR,
    },
    packageTwo: {
        marginTop: -7,
        backgroundColor: SECONDARY_COLOR,
    },
    packageThree: {
        backgroundColor: '#fff',
    },
    packageOneSelected: {
        borderWidth: 2,
        borderColor: '#fff',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 1,
        paddingRight: 1,
    },
    packageTwoSelected: {
        borderWidth: 2,
        borderColor: '#fff',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 1,
        paddingRight: 1,
    },
    packageThreeSelected: {
        borderWidth: 2,
        borderColor: PRIMARY_COLOR,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 1,
        paddingRight: 1,
    },
    packageTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: isIphoneSe ? 13 : 15,
    },
    price: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 13
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 5,
    },
    textPackageThree: {
        color: PRIMARY_COLOR,
        textAlign: 'center',
        marginBottom: 5,
    },
    subPrice: {
        fontSize: 11,
        fontFamily: 'Montserrat-Regular',
    },
    buttonWrapper: {
        flex: 0,
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 15,
    },
    cancelButtonText: {
        fontFamily: 'Montserrat-Medium',
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
    },
    startButton: {
        backgroundColor: "#fff",
        alignSelf: 'center',
        borderRadius: 12,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 30
    },
    startButtonText: {
        color: PRIMARY_COLOR,
        fontFamily: 'Montserrat-Bold',
        fontSize: 18
    },
    oneWeekTrialText: {
        color: '#fff',
        fontFamily: 'Montserrat-Medium',
        fontSize: isIphoneSe ? 28 : 26,
        marginTop: isIphoneSe ? 18 : 5,
    }
});

const mapStateToProps = (state: any) => {
    const { inAppPurchase } = state;
    return inAppPurchase;
}

const mapDispatchToProps = (dispatch: Function) => {
    return {
        addPurchaseData: (purchase: any) => dispatch(addPurchaseData(purchase)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InAppPurchaseModal);
