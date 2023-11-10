import React, {Component} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Button, Toast} from 'native-base';
import {connect} from 'react-redux';
import {
  WIDTH,
  HEIGHT,
  SECONDARY_COLOR,
  PRIMARY_COLOR,
} from './../../../utilities/Theme';
import {
  addPurchaseData,
  addPurchaseDataFailure,
  addPurchaseDataSuccess,
} from './actions';
import i18n from '../../i18n';
import RNIap, {
  purchaseUpdatedListener,
  purchaseErrorListener,
  ProductPurchase,
  PurchaseError,
  SubscriptionPurchase,
} from 'react-native-iap';
import {isIphoneSe} from '../../../utilities/Screen';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../Loader';
import http from '../../tools/axiosClient';
import {exportedStore} from '../../../store';
import {verifyingPurchaseSuccess} from '../../auth/actions';
import {hexToRGBA} from '../../../utilities/Functions';
import {t} from 'i18next';
import {FootModal} from '../FootModal';
import {Text} from '@balletworkout/components';
import { AFLogEvent } from '../../../utilities/AppsFlyer';
// import { AppEventsLogger } from 'react-native-fbsdk';

interface Props {
  visibility: boolean;
  onCancel: Function;
  onSuccess?: Function;
  addPurchaseData?: Function;
  store: any;
}

interface State {
  selectedPackage: string;
  isLoading: boolean;
  isPurchaseValid: boolean;
  subscriptionDataFetched: any;
  availablePurchases: any;
}

export class InAppPurchaseModalNew extends Component<Props, State> {
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
    this.purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: ProductPurchase | SubscriptionPurchase) => {
        this.setState({isLoading: false});

        // console.log('Purchase Data', purchase);

        let packagePurchased = this.state.subscriptionDataFetched.filter(
          (item: any) => item.productId === purchase.productId,
        );

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
          const {data} = await http().post(
            'in-app-purchase/add-purchase',
            postData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Accept-Language': selectedLanguage,
              },
            },
          );
          // console.log(data);
          exportedStore.dispatch(addPurchaseDataSuccess(data.data));
          exportedStore.dispatch(
            verifyingPurchaseSuccess(data.data.expiryTime),
          );

          // Log Add payment info Fb event
          // AppEventsLogger.logEvent('Add payment info', {"Success": true});
          if (Platform.OS === 'ios') {
            RNIap.finishTransactionIOS(purchase.transactionId);
          } else if (Platform.OS === 'android') {
            // If not consumable
            RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
          }

          if (this.props.onCancel) this.props.onCancel();
        } catch (e) {
          if (typeof e.response !== 'undefined') {
            exportedStore.dispatch(addPurchaseDataFailure(e.response));
            // console.log(e.response);
          }
          if (this.props.onCancel) this.props.onCancel();
        }
      },
    );
  }

  // purchaseErrorListener() {
  //   this.purchaseErrorSubscription = purchaseErrorListener(
  //     (error: PurchaseError) => {
  //       console.log('Purchse error')
  //       if(this.state.isLoading){
  //         Alert.alert('Purchase Error', error.message);
  //         this.setState({isLoading: false});
  //         return
  //       }
  //     },
  //   );
  // }

  async getAvailablePurchases() {
    var availablePurchases = await RNIap.getAvailablePurchases();

    if (availablePurchases.length > 0) {
      this.setState({availablePurchases});
    }
  }

  async componentDidMount() {
    this._isMounted = true;
    this.selectPackage(this.packages['3months'].package);

    this.unSubscribeStore = exportedStore.subscribe(() => {
      let state = exportedStore.getState();

      let isLoading = state.inAppPurchase.isLoading || state.auth.isLoading;

      if (this._isMounted) {
        this.setState({isLoading});
      }
    });

    // RNIap.initConnection().then(() => {

    try {
      const isConnected = await RNIap.initConnection();

      // proceed only if connected to store
      if (isConnected) {
        if (this._isMounted) {
          this.setState({isLoading: true});
        }
        const subscriptionDataFetched = await RNIap.getSubscriptions([
          this.packages['1month'].package,
          this.packages['3months'].package,
          this.packages['12months'].package,
        ]);

        if (this._isMounted) {
          this.setState({subscriptionDataFetched});
          this.setState({isLoading: false});
        }
        // console.log('block 2', subscriptionDataFetched);

        // fulsh any failled purchases
        RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      }
    } catch (err) {
      // console.log(err.message);
      if (this._isMounted) {
        this.setState({isLoading: false});
      }
      if (Platform.OS === 'ios') {
        Alert.alert(
          'Error',
          err.userInfo['NSUnderlyingError'].userInfo[
            'NSLocalizedFailureReason'
          ],
        );
      }
    }

    this.purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        if(this.state.isLoading){
          Alert.alert('Purchase Error', error.message);
          this.setState({isLoading: false});
          return
        }
      },
    );

    this.purchaseUpdateListener();
    // this.purchaseErrorListener();
  }

  packages: any = {
    '1month': {
      package: Platform.select({
        ios: 'be.balletworkout.app.amonth',
        android: 'be.balletworkout.app.amonth',
      }),
      price: Platform.select({ios: '€9.99', android: '€9.99'}),
      perMonthPrice: Platform.select({
        ios: '€9.99/' + i18n.t('common.month'),
        android: '€9.99/' + i18n.t('common.month'),
      }),
    },
    '3months': {
      package: Platform.select({
        ios: 'be.balletworkout.app.a3month',
        android: 'be.balletworkout.app.a3month',
      }),
      price: Platform.select({ios: '€22.99', android: '€22.99'}),
      perMonthPrice: Platform.select({
        ios: '€7.66/' + i18n.t('common.month'),
        android: '€7.66/' + i18n.t('common.month'),
      }),
    },
    '12months': {
      package: Platform.select({
        ios: 'be.balletworkout.app.ayear',
        android: 'be.balletworkout.app.ayear',
      }),
      price: Platform.select({ios: '€59.99', android: '€59.99'}),
      perMonthPrice: Platform.select({
        ios: '€4.99/' + i18n.t('common.month'),
        android: '€4.99/' + i18n.t('common.month'),
      }),
    },
  };

  _onCancelButtton() {
    this.props.onCancel(true);
  }

  async buyPackage() {
    // console.log('Buy package called');
    // console.log('Package.....',this.state.selectedPackage)
    try {
      const isConnected = await RNIap.initConnection();

      if (!isConnected) {
        if (Platform.OS === 'ios')
          Alert.alert('Itunes Connection Error', 'Cannot connect to itunes');
        return;
      }
      // fulsh any failled purchases

      if (Platform.OS === 'android') {
        RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      }

      this.setState({isLoading: true});
      if (this.state.selectedPackage === '') {
        Toast.show({
          text: i18n.t('common.select_package_warning'),
          position: 'top',
        });
        this.setState({isLoading: false});
        return;
      }

      if (this.state.availablePurchases.length > 0) {
        let token = exportedStore.getState().auth.tokenData.token;

        try {
          let purchaseStatusResponse = await http().post(
            `user/verify-purchase`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          let {
            data: {expiry},
          } = purchaseStatusResponse;

          const [ result ] = await AFLogEvent('New_Purchase', purchaseStatusResponse);
          console.log('AppsFlyer New Purchase result......', result);

          // console.log('expiry', expiry, purchaseStatusResponse.data);

          let isPurchaseValid = expiry - Date.now() > 0;

          // console.log('purcahse valid?', isPurchaseValid);
          await this.setState({isPurchaseValid});
        } catch (e) {
          Alert.alert('Error', `Server Error: ${e.message}`);
        }

        // console.log('purcahse valid in state?', this.state.isPurchaseValid);
        if (this.state.isPurchaseValid) {
          this.setState({isLoading: false});
          Alert.alert(i18n.t('common.active_subs_message'));
          return;
        }
      }

      let packageName: string = this.state.selectedPackage;
      await RNIap.requestSubscription(packageName);
      this.setState({isLoading: false});
    } catch (e) {
      this.setState({isLoading: false});
      if (Platform.OS === 'ios') {
        Alert.alert(
          'Error',
          e.userInfo['NSUnderlyingError'].userInfo['NSLocalizedFailureReason'],
        );
        // this.props.onCancel()
        return;
      }
    }
  }

  selectPackage(packageName: string) {
    this.setState({selectedPackage: packageName});
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
      <FootModal
        visible={this.props.visibility}
        title={i18n.t('common.premium')}
        loading={this.state.isLoading}
        cancelCallBack={() => this._onCancelButtton()}>
        <View style={{width: '100%'}}>
          <Text style={styles.textDescription} font={'Regular'}>
            {i18n.t('common.in_app_purchase_modal_text')}
          </Text>
          {/*{!this.state.isLoading || <Loader top />}*/}
          <View style={styles.packagesContainerx}>
            <TouchableOpacity
              style={styles.imageRowContainer}
              onPress={() =>
                this.selectPackage(this.packages['1month'].package)
              }>
              <View
                style={[
                  styles.checkbox,
                  this.state.selectedPackage === this.packages['1month'].package
                    ? styles.checkboxChecked
                    : {},
                ]}
              />
              <View style={styles.textContainer}>
                <View style={styles.textContent}>
                  <Text font={'SemiBold'} style={styles.mainText}>
                    1 {i18n.t('common.month')}
                  </Text>
                  <Text font={'Regular'} style={styles.subText}>
                    Payment of {this.packages['1month'].price}
                  </Text>
                </View>
                <View style={[styles.textContent, {alignItems: 'flex-end'}]}>
                  <Text
                    font={'SemiBold'}
                    style={[styles.mainText, {color: '#81CC6F'}]}>
                    {this.packages['1month'].perMonthPrice}
                  </Text>
                  {/*<Text font={'Regular'} style={styles.subText}>*/}
                  {/*    Per week*/}
                  {/*</Text>*/}
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageRowContainer}
              onPress={() =>
                this.selectPackage(this.packages['3months'].package)
              }>
              <View
                style={[
                  styles.checkbox,
                  this.state.selectedPackage ===
                  this.packages['3months'].package
                    ? styles.checkboxChecked
                    : {},
                ]}
              />
              <View style={styles.textContainer}>
                <View style={styles.textContent}>
                  <Text font={'SemiBold'} style={styles.mainText}>
                    3 {i18n.t('common.months')}
                  </Text>
                  <Text font={'Regular'} style={styles.subText}>
                    Payment of {this.packages['3months'].price}
                  </Text>
                </View>
                <View style={[styles.textContent, {alignItems: 'flex-end'}]}>
                  <Text
                    font={'SemiBold'}
                    style={[styles.mainText, {color: '#81CC6F'}]}>
                    {this.packages['3months'].perMonthPrice}
                  </Text>
                  {/*<Text font={'Regular'} style={styles.subText}>*/}
                  {/*    Per week*/}
                  {/*</Text>*/}
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageRowContainer}
              onPress={() =>
                this.selectPackage(this.packages['12months'].package)
              }>
              <View
                style={[
                  styles.checkbox,
                  this.state.selectedPackage ===
                  this.packages['12months'].package
                    ? styles.checkboxChecked
                    : {},
                ]}
              />
              <View style={styles.textContainer}>
                <View style={styles.textContent}>
                  <Text font={'SemiBold'} style={styles.mainText}>
                    12 {i18n.t('common.month')}
                  </Text>
                  <Text font={'Regular'} style={styles.subText}>
                    Payment of {this.packages['12months'].price}
                  </Text>
                </View>
                <View style={[styles.textContent, {alignItems: 'flex-end'}]}>
                  <Text
                    font={'SemiBold'}
                    style={[styles.mainText, {color: '#81CC6F'}]}>
                    {this.packages['12months'].perMonthPrice}
                  </Text>
                  {/*<Text font={'Regular'} style={styles.subText}>*/}
                  {/*    Per week*/}
                  {/*</Text>*/}
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => this.buyPackage()}>
              <Text style={{color: '#ffffff', fontSize: 18}}>
                {i18n.t('common.package_start_now')}
              </Text>
            </TouchableOpacity>
          </View>
          {/*<View style={styles.packagesContainer}>*/}
          {/*    <View*/}
          {/*        style={[styles.packages, {marginLeft: 0}, styles.packageOne, this.state.selectedPackage === this.packages['1month'].package ? styles.packageOneSelected : {}]}>*/}
          {/*        <TouchableWithoutFeedback*/}
          {/*            onPress={() => this.selectPackage(this.packages['1month'].package)}>*/}
          {/*            <View>*/}
          {/*                <Text style={[styles.packageTitle, styles.text]}>Let's Try</Text>*/}
          {/*                <Text*/}
          {/*                    style={[styles.price, styles.text]}>{this.packages['1month'].price}</Text>*/}
          {/*                <Text style={[styles.price, styles.text]}>1 {i18n.t('common.month')}</Text>*/}
          {/*                <Text*/}
          {/*                    style={[styles.subPrice, styles.text]}>{this.packages['1month'].perMonthPrice}</Text>*/}
          {/*            </View>*/}
          {/*        </TouchableWithoutFeedback>*/}
          {/*    </View>*/}

          {/*    <View*/}
          {/*        style={[styles.packages, styles.packageTwo, this.state.selectedPackage === this.packages['3months'].package ? styles.packageTwoSelected : {}]}>*/}
          {/*        <TouchableWithoutFeedback*/}
          {/*            onPress={() => this.selectPackage(this.packages['3months'].package)}>*/}
          {/*            <View>*/}
          {/*                <Text style={[styles.packageTitle, styles.text]}>Seasonal</Text>*/}
          {/*                <Text*/}
          {/*                    style={[styles.price, styles.text]}>{this.packages['3months'].price}</Text>*/}
          {/*                <Text style={[styles.price, styles.text]}>3 {i18n.t('common.months')}</Text>*/}
          {/*                <Text*/}
          {/*                    style={[styles.subPrice, styles.text]}>{this.packages['3months'].perMonthPrice}</Text>*/}
          {/*            </View>*/}
          {/*        </TouchableWithoutFeedback>*/}
          {/*    </View>*/}

          {/*    <View*/}
          {/*        style={[styles.packages, styles.packageThree, this.state.selectedPackage === this.packages['12months'].package ? styles.packageThreeSelected : {}]}>*/}
          {/*        <TouchableWithoutFeedback*/}
          {/*            onPress={() => this.selectPackage(this.packages['12months'].package)}>*/}
          {/*            <View>*/}
          {/*                <Text style={[styles.packageTitle, styles.textPackageThree]}>Year</Text>*/}
          {/*                <Text*/}
          {/*                    style={[styles.price, styles.textPackageThree]}>{this.packages['12months'].price}</Text>*/}
          {/*                <Text*/}
          {/*                    style={[styles.price, styles.textPackageThree]}>12 {i18n.t('common.months')}</Text>*/}
          {/*                <Text*/}
          {/*                    style={[styles.subPrice, styles.textPackageThree]}>{this.packages['12months'].perMonthPrice}</Text>*/}
          {/*            </View>*/}
          {/*        </TouchableWithoutFeedback>*/}
          {/*    </View>*/}
          {/*</View>*/}

          {/*<View style={styles.buttonWrapper}>*/}
          {/*    <Button*/}
          {/*        transparent*/}
          {/*        onPress={() => this.buyPackage()}*/}
          {/*        style={styles.startButton}>*/}
          {/*        <Text*/}
          {/*            style={styles.startButtonText}>{i18n.t('common.package_start_now').toUpperCase()}</Text>*/}
          {/*    </Button>*/}

          {/*    <Button block transparent onPress={() => this._onCancelButtton()}>*/}
          {/*        <Text style={styles.cancelButtonText}>{i18n.t('common.cancel_button_text')}</Text>*/}
          {/*    </Button>*/}

          {/*</View>*/}
        </View>
      </FootModal>
    );
  }
}

const styles = StyleSheet.create({
  packagesContainerx: {
    paddingHorizontal: 0,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#E2E2E2',
    backgroundColor: '#E2E2E2',
  },
  checkboxChecked: {
    backgroundColor: '#81CC6F',
  },
  imageRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#F7F7F7',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
  },
  textContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  textDescription: {
    textAlign: 'left',
    fontSize: 14,
    color: '#032426',
    alignSelf: 'flex-start',
    paddingVertical: 10,
  },
  mainText: {
    fontSize: 16,
    color: '#032426',
  },
  subText: {
    fontSize: 14,
    color: '#032426',
  },
  footer: {
    marginTop: 20,
  },
  footerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#81CC6F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

const mapStateToProps = (state: any) => {
  const {inAppPurchase} = state;
  return inAppPurchase;
};

const mapDispatchToProps = (dispatch: Function) => {
  return {
    addPurchaseData: (purchase: any) => dispatch(addPurchaseData(purchase)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InAppPurchaseModalNew);
