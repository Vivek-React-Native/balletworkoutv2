import React, { Component } from 'react';
import { View, StyleSheet, Text, Picker } from 'react-native';
import { Form, Icon, Item, Label, Left, Body } from 'native-base';
import i18n from '../../../../common/i18n';

interface Props {
    setProductOptions: Function,
    productOptions: any;
    errors: any;
}
interface State {
    options: any;
}

export default class ProductOptions extends Component<Props, State> {

    state = {
        options: {},
    }

    onValueChange(productOptionId: string, productOptionValueId: string) {
        let options = this.state.options;
        options[productOptionId] = productOptionValueId;
        this.setState({ options }, () => this.props.setProductOptions(this.state.options));
    }

    renderPicker(name: string, productOptionId: string, optionValues: any) {

        const { errors } = this.props;

        return (
            <View key={productOptionId}>
                <Item style={styles.inputItem}>
                    <Left>
                        <Label style={styles.labelText}>{name}</Label>
                    </Left>
                    <Body>
                        <Picker
                            style={styles.pickerStyle}
                            mode="dialog"
                            iosIcon={<Icon name="ios-arrow-down-outline" />}
                            headerBackButtonText="Back"
                            placeholder={name}
                            selectedValue={this.state.options[productOptionId]}
                            onValueChange={(value: string) => this.onValueChange(productOptionId, value)}>
                            {
                                optionValues.length > 0 ?
                                    optionValues.map((optionValue: any, index: number) => {
                                        return this.renderPickerItems(optionValue.name, optionValue.product_option_value_id);
                                    }) : null
                            }
                        </Picker>
                    </Body>
                </Item>
                {typeof errors[productOptionId] !== 'undefined' ? <Text style={styles.errorText}>{errors[productOptionId]}</Text> : null}
            </View>
        );
    }

    renderPickerItems(label: string, productOptionValueId: string) {
        return (
            <Picker.Item key={productOptionValueId} label={label} value={productOptionValueId} />
        );
    }

    render() {
        const { productOptions } = this.props;
        return (
            <View style={styles.container}>
                <Form>
                    {
                        productOptions.length > 0 ?
                            productOptions.map((option: any, index: number) => {

                                if (option.type === "select") {

                                    return this.renderPicker(option.name, option.product_option_id, option.option_value);
                                }
                            }) : null
                    }
                </Form>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputItem: {
        flex: 1,
        marginLeft: 0,
        borderBottomWidth: 0,
    },
    labelText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
    },
    errorText: {
        color: 'red',
    },
    pickerStyle: {
        flex: 1,
        alignSelf: 'stretch'
    }
});
