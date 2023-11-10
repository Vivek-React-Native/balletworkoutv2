import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, Linking, Platform } from 'react-native';
import { Container, List, ListItem, Left, Right, Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfilePicture from './components/ProfilePicture';
import { PADDING_LEFT_RIGHT, PRIMARY_COLOR, SECONDARY_COLOR } from './../../../utilities/Theme';
import i18n from '../../../common/i18n';
import { logOutUser, deleteAccount } from './../../../common/auth/actions';
import { policyUrl, termsUrl, supportUrl } from '../../../common/appConstants';
import Loader from '../../../common/components/Loader';
import InAppPurchaseModalNew from '../../../common/components/InAppPurchaseModalNew';
import { LanguageIcon } from '../../../assets/icons/Svgs';

interface Props {
    navigation: any;
    store: any;
}
interface State {
    country: string;
    isLoading: boolean;
    iapModelVisibility: boolean;
}

export default class Settings extends Component<Props, State> {

    unSubscribeStore: Function;

    state = {
        country: "",
        isLoading: false,
        iapModelVisibility: false,
    };

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        const { store, navigation } = this.props;
        this.setState({ country: store.getState().auth.userData.country });
        this.unSubscribeStore = store.subscribe(() => {
            this.setState({ country: store.getState().auth.userData.country });
            let isLoading = store.getState().auth.isLoading;
            this.setState({ isLoading });
            let isLoggedIn = store.getState().auth.isLoggedIn;

            if (!isLoggedIn) {
                this.unSubscribeStore();
                navigation.navigate('auth');
            }

        });
    }

    handleLink(url: string) {
        Linking.openURL(url).catch((error: any) => console.warn(error));
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    logout() {
        const { store } = this.props;
        // console.log('from register: ');
        this.unSubscribeStore();
        this.props.navigation.navigate('auth');
        store.dispatch(logOutUser());
    }

    _onPressLogout() {
        Alert.alert(
            i18n.t('settings.logout'),
            i18n.t('settings.logout_confirm_message') + '?',
            [
                { text: 'OK', onPress: () => this.logout() },
                { text: i18n.t('settings.cancel'), style: 'cancel' },
            ]
        );
    }

    _onPressDeleteAccount() {
        Alert.alert(
            i18n.t('settings.delete_account'),
            i18n.t('settings.delete_account_confirm_message') + '?',
            [
                { text: i18n.t('settings.delete').toUpperCase(), onPress: () => this.delete() },
                { text: i18n.t('settings.cancel'), style: 'cancel' },
            ]
        );
    }

    _onPressCancelSubscription() {
        Alert.alert(
            i18n.t('settings.cancel_subscription'),
            Platform.OS === 'ios' ? i18n.t('settings.cancel_subscription_confirm_ios') : i18n.t('settings.cancel_subscription_confirm') + '?',
            [
                { text: 'Ok', onPress: () => this.cancelSubscription() },
                { text: i18n.t('settings.cancel'), style: 'cancel' },
            ]
        );
    }

    cancelSubscription() {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else if (Platform.OS === 'android') {
            Linking.openURL('https://play.google.com/store/account/subscriptions?sku=yoursku&package=be.balletworkout.app');
        }
    }

    delete() {
        const { store } = this.props;
        store.dispatch(deleteAccount());
    }

    setIapModelVisibility(iapModelVisibility: boolean) {
        this.setState({ iapModelVisibility });
    }

    render() {
        const { store } = this.props;
        return (
            <Container style={styles.container}>
                {!this.state.isLoading || <Loader />}
                <ProfilePicture store={store} />
                <View style={styles.settingsContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <List style={styles.settingsList}>
                            <ListItem button style={styles.settingsListItem} onPress={() => this.props.navigation.navigate('profile')}>
                                <Left><Text style={styles.settingsText}>{i18n.t('settings.my_profile')}</Text></Left>
                                <Right><Icon style={styles.settingsRightArrow} name="chevron-right" /></Right>
                            </ListItem>
                            {
                                this.state.country !== 'BE' ||
                                <ListItem button style={[styles.settingsListItem, styles.schecduleTab]} onPress={() => this.props.navigation.navigate('schedule')}>
                                    <Left><Text style={styles.settingsText}>{i18n.t('settings.class_schedule').toUpperCase()}</Text></Left>
                                    <Right><Icon style={[styles.settingsRightArrow, { color: PRIMARY_COLOR }]} name="chevron-right" /></Right>
                                </ListItem>
                            }
                            <ListItem button style={styles.settingsListItem} onPress={() => this.props.navigation.navigate('languageSettings')}>
                                <Left style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}><Text style={{paddingTop: 7}}><LanguageIcon width="27" height="27" color={'#d2959f'} /> </Text><Text style={styles.settingsText}>{i18n.t('settings.language')}</Text></Left>
                                <Right><Icon style={styles.settingsRightArrow} name="chevron-right" /></Right>
                            </ListItem>
                            <ListItem button style={styles.settingsListItem} onPress={() => this.props.navigation.navigate('notification')}>
                                <Left><Text style={styles.settingsText}>{i18n.t('settings.notification')}</Text></Left>
                                <Right><Icon style={styles.settingsRightArrow} name="chevron-right" /></Right>
                            </ListItem>
                            <ListItem button noBorder style={styles.settingsListItem} onPress={() => this.props.navigation.navigate('notificationCenter')}>
                                <Left><Text style={styles.settingsText}>{i18n.t('settings.notification_center')}</Text></Left>
                                <Right><Icon style={styles.settingsRightArrow} name="chevron-right" /></Right>
                            </ListItem>
                        </List>

                        <List style={styles.settingsList}>
                            <ListItem
                                button
                                style={styles.settingsListItem}
                                onPress={() => this.handleLink(supportUrl + `?lang=${i18n.language.substring(0, 2)}`)}>
                                <Left><Text style={styles.settingsText}>{i18n.t('settings.help_and_support')}</Text></Left>
                                <Right><Icon style={styles.settingsRightArrow} name="chevron-right" /></Right>
                            </ListItem>

                            <ListItem button style={styles.settingsListItem} onPress={() => this.handleLink(policyUrl + `?lang=${i18n.language.substring(0, 2)}`)}>
                                <Left><Text style={styles.settingsText}>{i18n.t('settings.privacy_policy')}</Text></Left>
                                <Right><Icon style={styles.settingsRightArrow} name="chevron-right" /></Right>
                            </ListItem>

                            <ListItem button noBorder style={styles.settingsListItem} onPress={() => this.handleLink(termsUrl + `?lang=${i18n.language.substring(0, 2)}`)}>
                                <Left><Text style={styles.settingsText}>{i18n.t('settings.terms_of_service')}</Text></Left>
                                <Right><Icon style={styles.settingsRightArrow} name="chevron-right" /></Right>
                            </ListItem>
                        </List>

                        <List style={styles.settingsList}>
                            <ListItem button style={styles.settingsListItem} onPress={() => this.setState({ iapModelVisibility: true })}>
                                <Left><Text style={styles.settingsText}>{i18n.t('settings.buy_renew_subscription')}</Text></Left>
                                <Right><Icon style={styles.settingsRightArrow} name="chevron-right" /></Right>
                            </ListItem>
                            <ListItem button style={styles.settingsListItem} onPress={() => this._onPressCancelSubscription()}>
                                <Left><Text style={styles.settingsText}>{i18n.t('settings.cancel_subscription')}</Text></Left>
                                <Right><Icon style={styles.settingsRightArrow} name="chevron-right" /></Right>
                            </ListItem>
                            <ListItem button
                                style={styles.settingsListItem}
                                onPress={() => this._onPressLogout()}>
                                <Left><Text style={styles.settingsText}>{i18n.t('settings.logout')}</Text></Left>
                                <Right><Icon style={styles.settingsRightArrow} name="chevron-right" /></Right>
                            </ListItem>
                            <ListItem button
                                noBorder
                                style={styles.settingsListItem}
                                onPress={() => this._onPressDeleteAccount()}>
                                <Left><Text style={styles.settingsText}>{i18n.t('settings.delete_account')}</Text></Left>
                                <Right><Icon style={styles.settingsRightArrow} name="chevron-right" /></Right>
                            </ListItem>
                        </List>
                    </ScrollView>
                </View>
                <InAppPurchaseModalNew
                    onCancel={() => this.setIapModelVisibility(false)}
                    visibility={this.state.iapModelVisibility} store={store} />
            </Container>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    settingsContainer: {
        flex: 1,
        paddingLeft: PADDING_LEFT_RIGHT,
        paddingRight: PADDING_LEFT_RIGHT,
        marginBottom: 20,
    },
    settingsList: {
        flex: 1,
        borderRadius: 10,
        borderColor: "#c3c3c3",
        borderWidth: 1,
        marginTop: 20,
    },
    settingsListItem: {
        marginLeft: 0,
        paddingLeft: 15,
        paddingRight: 15,
        height: 50,
    },
    settingsText: {
        color: PRIMARY_COLOR,
        fontFamily: 'Montserrat-Bold',
    },
    settingsRightArrow: {
        color: '#c3c3c3',
    },
    schecduleTab: {
        //backgroundColor: SECONDARY_COLOR,
    },
})
