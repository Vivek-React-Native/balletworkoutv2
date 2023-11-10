import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ListItem, Body, Left, Right, Radio, List, Input, Item, Label } from 'native-base';
import i18n from '../../../../common/i18n';
import { PRIMARY_COLOR } from '../../../../utilities/Theme';

const VIEW_CALLBACK_ENUMS = {
    SELECT_SHIPPING_METHOD: 'cart-shipping-method/select-method'
};

interface Props {
    viewCallback: Function;
    shippingMethods: any;
    shippingMethod: string;
}
interface State {
    selectedShippingMethod: string;
    shippingMethodComment: string;
}

export default class ShippingMethods extends Component<Props, State> {

    state = {
        selectedShippingMethod: this.props.shippingMethod,
        shippingMethodComment: "",
    };

    onSelectMethod(shippingMethod: string) {
        this.setState({ selectedShippingMethod: shippingMethod }, () => this.updateShippingMethod());

    }

    updateShippingMethod() {
        this.props.viewCallback(VIEW_CALLBACK_ENUMS.SELECT_SHIPPING_METHOD, {
            shipping_method: this.state.selectedShippingMethod,
            comment: this.state.shippingMethodComment,
        });
    }

    renderShippingMethod(method: any, key: string) {
        return (
            <ListItem style={styles.methodItem} button onPress={() => this.onSelectMethod(method.quote[key].code)} key={key}>
                <Left style={{ flex: 1 }}><Text style={styles.text}>{method.quote[key].text}</Text></Left>
                <Body style={{ flex: 5 }}>
                    <Text style={styles.text}>{method.title}</Text>
                </Body>
                <Right style={{ flex: 0 }}>
                    <Radio
                        onPress={() => this.onSelectMethod(method.quote[key].code)}
                        selected={this.state.selectedShippingMethod === method.quote[key].code} />
                </Right>
            </ListItem>
        );
    }

    render() {

        const { shippingMethods } = this.props;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>{i18n.t('shop.shipping_method_title')}</Text>
                {
                    Object.keys(shippingMethods).length > 0 ?
                        <List style={{flex: 0}}>
                            {
                                Object.keys(shippingMethods).map((key: string) => this.renderShippingMethod(shippingMethods[key], key))
                            }
                        </List> : null
                }
                {/* <Item style={{flex: 0}} stackedLabel>
                    <Label>Comment</Label>
                    <Input
                        value={this.state.shippingMethodComment}
                        multiline={true}
                        numberOfLines={5}
                        onChangeText={(value: string) => this.setState({ shippingMethodComment: value })} />
                </Item> */}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        marginTop: 15,
    },
    title: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: PRIMARY_COLOR,
    },
    text: {
        fontFamily: 'Montserrat-SemiBold',
        color: PRIMARY_COLOR,
    },
    methodItem: {
        marginLeft: 0,
    }
});

export { VIEW_CALLBACK_ENUMS as CALLBACK_ENUMS_SHIPPING_METHOD };
