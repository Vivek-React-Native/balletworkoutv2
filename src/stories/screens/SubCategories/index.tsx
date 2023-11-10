import React, {Component} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import CategoryBanner from './components/CategoryBanner';
import SubCategoryList from './components/SubCategoryList';
import {baseServerUri} from '../../../common/appConstants';
import Loader from '../../../common/components/Loader';
import {InAppPurchaseModalNew} from '../../../common/components/InAppPurchaseModalNew';
import {AppEventsLogger} from 'react-native-fbsdk';
import {Container} from "native-base";
import SpanHeader from "../../../common/components/SpanHeader";
import i18n from '../../../common/i18n';

interface Props {
    navigation: any;
    subCategories: any;
    store: any;
    category:any
}

interface State {
    isLoading: boolean;
    purchaseExpired: boolean;
    iapModelVisibility: boolean;
}

export default class SubCategories extends Component<Props, State> {

    unSubscribeStore: Function;

    state = {
        isLoading: false,
        purchaseExpired: true,
        iapModelVisibility: false,
    };

    componentDidMount() {
        const {store, subCategories} = this.props;
        let isLoading = store.getState().subCategories.isLoading;

        const {name, type} = this.props.navigation.getParam('category');

        AppEventsLogger.logEvent('View content', {"Content ID": name, "Content Type": type});

        this.setState({isLoading});

        this.unSubscribeStore = store.subscribe(() => {
            let isLoading = store.getState().subCategories.isLoading;

            let purchaseExpiry = store.getState().auth.userData ? store.getState().auth.userData.purchase_validity_expiry : 0;

            let purchaseExpired: boolean = (purchaseExpiry - Date.now()) <= 0;

            this.setState({isLoading, purchaseExpired});

        });

    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    setIapModelVisibility(iapModelVisibility: boolean) {
        this.setState({iapModelVisibility});
    }

    render() {
        const {store, subCategories} = this.props;
        const {name, type, banner_image_dir, banner_image, image_prefix} = this.props.navigation.getParam('category');
        // console.log('subCategories---------------------------------', subCategories);
        return (
            <Container style={styles.container}>
                {this.state.isLoading && <Loader/>}
                <SpanHeader
                    navigation={this.props.navigation}
                    title={name}
                    subtitle={i18n.t('home.class')}
                    hideMenu
                />
                <SubCategoryList
                    sourceUrl={baseServerUri + banner_image_dir + image_prefix + banner_image}
                    subCategoryType={type}
                    subCategories={this.props.subCategories}
                    navigation={this.props.navigation}
                    purchaseExpired={this.state.purchaseExpired}
                    setIapModelVisibility={this.setIapModelVisibility.bind(this)}
                    category={this.props.category}
                />
                <InAppPurchaseModalNew
                    onCancel={() => this.setIapModelVisibility(false)}
                    visibility={this.state.iapModelVisibility} store={store}
                />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollView: {
        flex: 1
    },
});
