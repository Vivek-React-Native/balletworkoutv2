import React from 'react';
import { View, StyleSheet, Text, Linking } from 'react-native';
import ValidationComponent from 'react-native-form-validator';
import { Form, Item, Input, Picker, Toast, Button, Left, Body, CheckBox } from 'native-base';
import i18n from '../../../../i18n';
import shopCountries from '../../../../data/shopCountries';
import axios from 'axios';
import { baseShopServerApi } from '../../../../appConstants';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../../../../utilities/Theme';

const http = axios.create({
    baseURL: baseShopServerApi,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});

const VIEW_CALLBACK_ENUMS = {
    SHOP_REGISTRATION: 'shop-login-modal/registration',
};

interface Props {
    store: any;
    viewCallback: Function;
}
interface State {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirm: string;
    telephone: string;
    fax: string;
    company_id: number;
    company: string;
    city: string;
    address_1: string;
    address_2: string;
    country_id: number;
    postcode: string;
    zone_id: number;
    tax_id: number;
    agree: string;
}

export default class RegisterForm extends ValidationComponent<Props, State> {

    showPassword: boolean = false;
    zones: any = [];

    state = {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirm: "",
        telephone: "",
        fax: "",
        company_id: "",
        company: "",
        city: "",
        address_1: "",
        address_2: "",
        country_id: 0,
        postcode: "",
        zone_id: 0,
        tax_id: 0,
        agree: "",
    }

    validationRules = {
        firstname: { minlength: 3, required: true },
        lastname: { minlength: 3, required: true },
        email: { required: true, email: true },
        password: { minlength: 6, maxlength: 15, required: true },
        confirm: { confirmPassword: () => this.state.password, required: true },
        telephone: { required: true },
        city: { required: true },
        address_1: { required: true },
        country_id: { minlength: 1, required: true },
        postcode: { required: true },
        zone_id: { minlength: 1, required: true },
        agree: { booleanRequired: true },
    };

    _onSelectCountry(name: string, value: any) {

        const { store } = this.props;

        this.setState({ [name]: value });

        let shopToken = store.getState().shopAuth.shopAuthData.access_token;

        http.get(`countries/${value}`, {
            headers: {
                Authorization: `Bearer ${shopToken}`
            }
        }).then(({ data }) => {
            if (data.success) {
                this.zones = data.data.zone;
                this.setState({ zones: data.data.zone });
            } else {
                Toast.show({
                    text: i18n.t('shop.shop_user_form.server_error_fetching_zones') + data.error,
                });
            }
        }).catch(({ response }) => {
            Toast.show({
                text: i18n.t('shop.shop_user_form.server_error_fetching_zones'),
            });
        });

    }

    renderTextField(name: string, label: string, isSecuredEntry = false, keypad = "default") {

        let hasErrors = this.isFieldInError(name);
        let errors = this.getErrorsInField(name);
        return (
            <View>
                <Item style={styles.inputItem} error={this.isFieldInError(name)}>
                    <Input
                        keyboardType={keypad}
                        ref={name}
                        style={styles.inputText}
                        secureTextEntry={isSecuredEntry && !this.showPassword}
                        onChangeText={(value) => this.setState({ [name]: value })}
                        placeholder={label}
                        value={this.state[name]} />
                </Item>
                {hasErrors && errors.map((errorMessage: any, index: number) => <Text key={name + index}>{errorMessage}</Text>)}
            </View>
        );
    }

    renderCountryPicker(name: string, label: string, countries: any) {

        let hasErrors = this.isFieldInError(name);
        let errors = this.getErrorsInField(name);

        return (
            <View>
                <Item style={styles.inputItem}>
                    <Picker
                        ref={name}
                        mode="dropdown"
                        placeholder={label}
                        itemTextStyle={{ fontFamily: 'Montserrat-Regular' }}
                        placeholderStyle={styles.pickerTextStyle}
                        textStyle={styles.pickerTextStyle}
                        selectedValue={this.state[name]}
                        onValueChange={(value) => this._onSelectCountry(name, value)}>
                        {
                            countries.length > 0 ?
                                countries.map((country: any, index: number) => <Picker.Item key={index} label={country.name} value={country.country_id} />)
                                : <Picker.Item key={'nodata'} label={'No Country'} value={'0'} />
                        }
                    </Picker>
                </Item>
                {hasErrors && errors.map((errorMessage: any, index: number) => <Text key={name + index}>{errorMessage}</Text>)}
            </View>
        );
    }

    renderStatePicker(name: string, label: string, zones: any) {

        let hasErrors = this.isFieldInError(name);
        let errors = this.getErrorsInField(name);

        return (
            <View>
                <Item style={styles.inputItem}>
                    <Picker
                        ref={name}
                        mode="dropdown"
                        placeholder={label}
                        itemTextStyle={{ fontFamily: 'Montserrat-Regular' }}
                        placeholderStyle={styles.pickerTextStyle}
                        textStyle={styles.pickerTextStyle}
                        selectedValue={this.state[name]}
                        onValueChange={(value) => this.setState({ [name]: value })}>
                        {
                            zones.length > 0 ?
                                zones.map((zone: any, index: number) => <Picker.Item key={index} label={zone.name} value={zone.zone_id} />)
                                : <Picker.Item key={'nodata'} label={'No Zones'} value={'0'} />
                        }
                    </Picker>
                </Item>
                {hasErrors && errors.map((errorMessage: any, index: number) => <Text key={name + index}>{errorMessage}</Text>)}
            </View>
        );
    }

    renderCheckbox(name: string, label: string) {
        let hasErrors = this.isFieldInError(name);
        let errors = this.getErrorsInField(name);
        return (
            <View>
                <View style={styles.checkBoxContainer}>
                    <Left style={{ flex: 0.2 }}>
                        <CheckBox
                            ref={name}
                            color={SECONDARY_COLOR}
                            checked={this.state.agree === "1"}
                            onPress={() => this.setState({ agree: this.state.agree === "1" ? "0" : "1" })} />
                    </Left>
                    <Body style={{ flex: 1 }}>
                        <Text style={styles.agreeText} >{label}<Text style={styles.termsLink} onPress={() => this.handleClick('http://tatevikballet.com/index.php?route=information/information&information_id=5')}>{i18n.t('shop.terms_and_condition_link_text')}</Text></Text>
                    </Body>
                </View>
                {hasErrors && errors.map((errorMessage: any, index: number) => <Text key={name + index}>{errorMessage}</Text>)}
            </View>
        );
    }

    handleClick = (url: string) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                // console.log("Don't know how to open URI: " + url);
            }
        });
    };

    _onSubmitForm = () => {
        if (this.validate(this.validationRules)) {
            this.setState({ error: false });
            this.props.viewCallback(VIEW_CALLBACK_ENUMS.SHOP_REGISTRATION, { ...this.state });
        } else {
            this.setState({ error: true });
        }
    }

    render() {
        return (
            <View style={styles.container}>
            <Text style={styles.title}>{i18n.t('shop.shop_registration_form_title')}</Text>
                <Form>
                    {this.renderTextField('firstname', i18n.t('shop.shop_user_form.first_name') + '*')}
                    {this.renderTextField('lastname', i18n.t('shop.shop_user_form.last_name') + '*')}
                    {this.renderTextField('email', i18n.t('shop.shop_user_form.email') + '*', false, 'email-address')}
                    {this.renderTextField('password', i18n.t('shop.shop_user_form.password') + '*', true)}
                    {this.renderTextField('confirm', i18n.t('shop.shop_user_form.confirm_password') + '*', true)}
                    {this.renderTextField('telephone', i18n.t('shop.shop_user_form.telephone') + '*')}
                    {this.renderTextField('fax', i18n.t('shop.shop_user_form.fax'))}
                    {this.renderTextField('company_id', i18n.t('shop.shop_user_form.company_id'))}
                    {this.renderTextField('company', i18n.t('shop.shop_user_form.company'))}
                    {this.renderTextField('city', i18n.t('shop.shop_user_form.city') + '*')}
                    {this.renderTextField('address_1', i18n.t('shop.shop_user_form.address_1') + '*')}
                    {this.renderTextField('address_2', i18n.t('shop.shop_user_form.address_2'))}
                    {this.renderCountryPicker('country_id', i18n.t('shop.shop_user_form.country') + '*', shopCountries)}
                    {this.renderStatePicker('zone_id', i18n.t('shop.shop_user_form.zone') + '*', this.zones)}
                    {this.renderTextField('postcode', i18n.t('shop.shop_user_form.postcode') + '*')}
                    {this.renderCheckbox('agree', i18n.t('shop.shop_user_form.agree_text') + '*')}

                    <Button style={styles.submitButton} full onPress={() => this._onSubmitForm()}>
                        <Text style={styles.submitButtonText}>{i18n.t('shop.shop_user_form.register_btn_text')}</Text>
                    </Button>
                </Form>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 15,
    },
    inputItem: {
        marginLeft: 0,
    },
    inputText: {
        fontFamily: "Montserrat-Regular",
    },
    pickerTextStyle: {
        paddingLeft: 5,
        fontFamily: 'Montserrat-Regular',
    },
    submitButton: {
        backgroundColor: PRIMARY_COLOR,
    },
    submitButtonText: {
        color: "#fff",
        fontFamily: 'Montserrat-SemiBold'
    },
    checkBoxContainer: {
        flex: 0,
        flexDirection: 'row',
        marginBottom: 15,
        marginTop: 15,
    },
    agreeText: {
        fontFamily: 'Montserrat-Regular'
    },
    checkboxWrapper: {
        alignItems: 'flex-start',
    },
    checkboxContentWrapper: {
        alignItems: 'flex-start',
    },
    termsLink: {
        color: PRIMARY_COLOR,
        fontFamily: 'Montserrat-SemiBold'
    },
    title: {
        fontFamily: 'Montserrat-SemiBold',
        color: PRIMARY_COLOR,
        fontSize: 16
    }
});

export { VIEW_CALLBACK_ENUMS as REGISTRATION_FORM_ENUMS };