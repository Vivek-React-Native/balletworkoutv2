import React from 'react';
import ValidationComponent from 'react-native-form-validator';
import { View, Text, StyleSheet } from 'react-native';
import { Form, Button, Item, Input } from 'native-base';
import i18n from '../../../../i18n';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../../../../utilities/Theme';

const VIEW_CALLBACK_ENUMS = {
    SHOP_CUSTOMER_LOGIN: 'shop-login-modal/login'
};

interface Props {
    rules: any;
    viewCallback: Function;
}
interface State {
    email: string,
    password: string,
}

export default class LoginForm extends ValidationComponent<Props, State> {

    validationRules = {
        email: { required: true, email: true },
        password: { required: true },
    }

    showPassword: boolean = false;

    state = {
        email: "",
        password: "",
    };

    renderTextField(name: string, label: string, isSecuredEntry = false, keypad = "default") {

        let hasErrors = this.isFieldInError(name);
        let errors = this.getErrorsInField(name);
        return (
            <View>
                <Item style={styles.inputItem} error={this.isFieldInError(name)}>
                    <Input
                        selectionColor={SECONDARY_COLOR}
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

    _onSubmitForm = () => {
        if (this.validate(this.validationRules)) {
            this.setState({ error: false });
            this.props.viewCallback(VIEW_CALLBACK_ENUMS.SHOP_CUSTOMER_LOGIN, { ...this.state });
        } else {
            this.setState({ error: true });
        }
    }

    render() {
        return (
            <View>
                <Form>
                    <Text style={styles.title}>{i18n.t('shop.shop_login_form_title')}</Text>
                    {this.renderTextField('email', i18n.t('shop.shop_user_form.email'), false, 'email-address')}
                    {this.renderTextField('password', i18n.t('shop.shop_user_form.password'), true)}

                    <Button style={styles.submitButton} full onPress={() => this._onSubmitForm()}>
                        <Text style={styles.submitButtonText}>{i18n.t('shop.shop_user_form.login_btn_text')}</Text>
                    </Button>
                </Form>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    submitButton: {
        backgroundColor: PRIMARY_COLOR,
    },
    submitButtonText: {
        color: "#fff",
        fontFamily: 'Montserrat-SemiBold'
    },
    title: {
        fontFamily: 'Montserrat-SemiBold',
        color: PRIMARY_COLOR,
        fontSize: 16
    },
    inputItem: {
        marginLeft: 0,
    },
    inputText: {
        fontFamily: "Montserrat-Regular",
    },
});

export { VIEW_CALLBACK_ENUMS as LOGIN_FORM_ENUMS };
