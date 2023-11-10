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
  Linking,
} from 'react-native';
import {Button, Toast} from 'native-base';
import {FootModal} from '@balletworkout/components/FootModal';
import {Text} from '@balletworkout/components';
import bottomImage from '@balletworkout/assets/images/ActivePlan.png';
import {WIDTH, HEIGHT} from '@balletworkout/utilities/Theme';
import i18n from '../i18n';
import {termsUrl} from '@balletworkout/common/appConstants';
import {exportedStore} from '../../store';
import RNIap, {
  purchaseUpdatedListener,
  purchaseErrorListener,
  ProductPurchase,
  PurchaseError,
  SubscriptionPurchase,
} from 'react-native-iap';
import {
  addPurchaseData,
  addPurchaseDataFailure,
  addPurchaseDataSuccess,
} from '@balletworkout/components/InAppPurchaseModalNew/actions';
import { AFLogEvent } from '../../utilities/AppsFlyer';
import http from '../tools/axiosClient';
// import { AppEventsLogger } from 'react-native-fbsdk';

interface Props {
  visibility: boolean;
  onCancel: Function;
  onSuccess?: Function;
}

interface State {
  isLoading: boolean;
  selectedPackage: string;
  isPurchaseValid: boolean;
  subscriptionDataFetched: any;
  availablePurchases: any;
}

export class GiftModel extends Component<Props, State> {
  unSubscribeStore: Function;
  _isMounted: boolean = false;
  purchaseUpdateSubscription: any = null;
  purchaseErrorSubscription: any = null;
  state = {
    isLoading: false,
    selectedPackage: '1month',
    isPurchaseValid: false,
    subscriptionDataFetched: [],
    availablePurchases: [],
  };

  public static defaultProps: Partial<Props> = {
    visibility: false,
  };

  _onCancelButtton() {
    //this.setState({selectedPackage: ''});
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }
  handleLink = () => {
    Linking.openURL(termsUrl + `?lang=${i18n.language.substring(0, 2)}`).catch(
      (error: any) => console.warn(error),
    );
  };

  async componentDidMount(){
    this.unSubscribeStore = exportedStore.subscribe(() => {
      let state = exportedStore.getState();

      let isLoading = state.inAppPurchase.isLoading || state.auth.isLoading;

      if (this._isMounted) {
        this.setState({isLoading});
      }
    });
    try{
      const isConnected = await RNIap.initConnection();
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
      this.purchaseUpdateListener()
      // this.purchaseErrorListener();
      this.purchaseErrorSubscription = purchaseErrorListener(
        (error: PurchaseError) => {
          if(this.state.isLoading){
            Alert.alert('Purchase Error', error.message);
            this.setState({isLoading: false});
            return
          }
        },
      );
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

  packages: any = {
    '1month': {
      package: Platform.select({
        ios: 'be.balletworkout.app.amonthDiscount',
        android: 'be.balletworkout.app.amonthdiscount',
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

  async buyPackage() {
    // console.log('Buy package called');
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
      // if (this.state.selectedPackage === '') {
      //   Toast.show({
      //     text: i18n.t('common.select_package_warning'),
      //     position: 'top',
      //   });
      //   this.setState({isLoading: false});
      //   return;
      // }

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
            
            // console.log('expiry', expiry, purchaseStatusResponse.data);
            
            
            
            let isPurchaseValid = expiry - Date.now() > 0;
            
            // console.log('purcahse valid?', isPurchaseValid);
            await this.setState({isPurchaseValid});
            this.setState({isLoading: false});
          } catch (e) {
            this.setState({isLoading: false});
            Alert.alert('Error', `Server Error: ${e.message}`);
          }
          
          // console.log('purcahse valid in state?', this.state.isPurchaseValid);
          if (this.state.isPurchaseValid) {
            this.setState({isLoading: false});
            Alert.alert(i18n.t('common.active_subs_message'));
            return;
          }
        }
        
        let packageName: any = Platform.select({
          ios: 'be.balletworkout.app.amonthDiscount',
          android: 'be.balletworkout.app.amonthdiscount',
        }); // this.packages['1month'].package; //this.state.selectedPackage;
        // const packageName: any = Platform.select({
        //   ios: 'be.balletworkout.app.a3month',
        //   android: 'be.balletworkout.app.a3month',
        // })
        const purchaseResult = await RNIap.requestSubscription(packageName);
        const [ result ] = await AFLogEvent('New_Promo_Purchse', purchaseResult);
        console.log('AppsFlyer New Promo Purchase Result.....', result)
        // console.log('PurchaseResult..........',purchaseResult)
        
        
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

  render() {
    return (
      <FootModal
        visible={this.props.visibility}
        title={i18n.t('home.welcomeGiftTitle')}
        titleStyle={{width: WIDTH * 0.8, fontSize: WIDTH * 0.05}}
        loading={this.state.isLoading}
        cancelCallBack={() => this._onCancelButtton()}
        >
        <View style={{flex: 1}}>
          <Text style={[styles.textDesc]}>
            {i18n.t('home.welcomeGiftDesc1')}
            <Text style={styles.textDescDark}>
              {' '}
              {i18n.t('home.welcomeGiftDesc2')}{' '}
            </Text>
            {i18n.t('home.welcomeGiftDesc3')}
          </Text>
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => this.buyPackage()}>
              <Text style={{color: '#ffffff', fontSize: 18}}>
                {i18n.t('home.tryNow')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.termsContainer}>
            <Text style={styles.textTerms}>
              {i18n.t('home.welcomeGiftTerms')}
            </Text>
            <TouchableOpacity onPress={() => this.handleLink()}>
              <Text style={styles.termsText}>
                {i18n.t('home.TermsCondition')}
              </Text>
            </TouchableOpacity>
          </View>
          {/* <Text style={styles.textTerms}>
            {i18n.t('home.welcomeGiftTerms')}{' '}
            <Text style={styles.termsText}>
              {i18n.t('home.TermsCondition')}
            </Text>
          </Text> */}
          <View style={{flex: 1,marginTop: 10,marginHorizontal: -HEIGHT * 0.035}}>
            <Image
            source={bottomImage}
            style={styles.bottomImage}
            resizeMode={'cover'}
            />
          </View>
        </View>
      </FootModal>
    );
  }
}

const styles = StyleSheet.create({
  textDesc: {
    fontSize: WIDTH * 0.04,
    color: '#828282',
    fontWeight: '400',
  },
  textTerms: {
    fontSize: WIDTH * 0.03,
    color: '#828282',
    fontWeight: '400',
    textAlign: 'center',
  },
  textDescDark: {
    fontSize: WIDTH * 0.04,
    color: '#828282',
    fontWeight: '600',
  },
  termsText: {
    fontSize: WIDTH * 0.03,
    color: '#020202',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  termsContainer: {
    alignItems: 'center',
  },
  footer: {
    marginVertical: HEIGHT * 0.02,
  },
  footerButton: {
    width: '100%',
    height: HEIGHT * 0.08,
    backgroundColor: '#81CC6F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  bottomImage: {
    width: '100%',
    height: '100%'
  },
});
export default GiftModel;
