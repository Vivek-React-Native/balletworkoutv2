import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Body, Right, Radio, CheckBox, List, ListItem, Left } from 'native-base';
import i18n from '../../../../common/i18n';
import { SECONDARY_COLOR } from '../../../../utilities/Theme';

const VEIW_CALLBACK_ENUMS = {
    SELECT_SHIPPING_ADDRESS: 'cart-addresses/select-shipping-address',
    SELECT_PAYMENT_ADDRESS: 'cart-addresses/select-payment-address',
};

interface Props {
    shippingAddresses: any;
    paymentAddresses: any;
    shippingAddress: string;
    paymentAddress: string;
    viewCallback: Function;
}
interface State {
    selectedShippingAddress: string;
    selectedPaymentAddress: string;
    paymentAddressIsSameAsShipping: boolean;
}

export default class Addresses extends Component<Props, State> {

    state = {
        selectedShippingAddress: this.props.shippingAddress,
        selectedPaymentAddress: this.props.paymentAddress,
        paymentAddressIsSameAsShipping: true,
    };

    onSelectShippingAddress(addressId: string) {
        if (this.state.paymentAddressIsSameAsShipping) {

            this.setState({ selectedShippingAddress: addressId });
            this.setState({ selectedPaymentAddress: addressId });

            this.props.viewCallback(VEIW_CALLBACK_ENUMS.SELECT_SHIPPING_ADDRESS, {
                shipping_address: "existing",
                address_id: addressId,
            });

            this.props.viewCallback(VEIW_CALLBACK_ENUMS.SELECT_PAYMENT_ADDRESS, {
                payment_address: "existing",
                address_id: addressId,
            });

        } else {

            this.setState({ selectedPaymentAddress: addressId });

            this.props.viewCallback(VEIW_CALLBACK_ENUMS.SELECT_PAYMENT_ADDRESS, {
                payment_address: "existing",
                address_id: addressId,
            });

        }
    }

    onSelectPaymentAddress(addressId: string) {
        this.setState({ selectedPaymentAddress: addressId });
        
        this.props.viewCallback(VEIW_CALLBACK_ENUMS.SELECT_PAYMENT_ADDRESS, {
            payment_address: "existing",
            address_id: addressId,
        });
    }

    renderShippingAddress(address: any) {
        return (
            <ListItem style={styles.addressContainerItem} key={address.address_id} button onPress={() => this.onSelectShippingAddress(address.address_id)}>
                <Body style={styles.addressBody}>
                    <Text style={styles.addressName}>{address.firstname} {address.lastname}</Text>
                    <Text style={styles.address}>{address.address_1}</Text>
                    {address.address_2 !== "" ? <Text style={styles.address}>{address.address_1}</Text> : null}
                    <Text style={styles.address}>{address.city}</Text>
                    <Text style={styles.address}>{address.zone}</Text>
                    <Text style={styles.address}>{address.country}</Text>
                    <Text style={styles.address}>{address.postcode}</Text>
                </Body>
                <Right>
                    <Radio onPress={() => this.setState({ selectedShippingAddress: address.address_id })} selected={this.state.selectedShippingAddress === address.address_id} />
                </Right>
            </ListItem>
        );
    }

    renderPaymentAddress(address: any) {
        return (
            <ListItem style={styles.addressContainerItem} key={'payment-' + address.address_id} button onPress={() => this.onSelectPaymentAddress(address.address_id)}>
                <Body style={styles.addressBody}>
                    <Text style={styles.addressName}>{address.firstname} {address.lastname}</Text>
                    <Text style={styles.address}>{address.address_1}</Text>
                    {address.address_2 !== "" ? <Text style={styles.address}>{address.address_1}</Text> : null}
                    <Text style={styles.address}>{address.city}</Text>
                    <Text style={styles.address}>{address.zone}</Text>
                    <Text style={styles.address}>{address.country}</Text>
                    <Text style={styles.address}>{address.postcode}</Text>
                </Body>
                <Right>
                    <Radio onPress={() => this.setState({ selectedPaymentAddress: address.address_id })} selected={this.state.selectedPaymentAddress === address.address_id} />
                </Right>
            </ListItem>
        );
    }

    render() {
        const { paymentAddresses, shippingAddresses } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.addressesBlock}>
                    <Text style={styles.addressBlockTitle}>{i18n.t('shop.shipping_address_title')}</Text>
                    {
                        shippingAddresses.length > 0 ?
                            <List style={styles.addressesList}>
                                {
                                    shippingAddresses.map((address: any, index: number) => this.renderShippingAddress(address))
                                }
                            </List> : null
                    }
                </View>

                <View style={styles.addressesBlock}>
                    <Text style={styles.addressBlockTitle}>{i18n.t('shop.payment_address_title')}</Text>

                    <View style={styles.paymentAddressConfirmationBlock}>
                        <Left style={{ flex: 0 }}>
                            <CheckBox
                                color={SECONDARY_COLOR}
                                onPress={() => { this.setState({ paymentAddressIsSameAsShipping: !this.state.paymentAddressIsSameAsShipping }) }}
                                checked={this.state.paymentAddressIsSameAsShipping} />
                        </Left>
                        <Body style={{ flex: 1 }}><Text>{i18n.t('shop.payment_address_is_same_checkbox_text')}</Text></Body>
                    </View>

                    <View>

                        {
                            !this.state.paymentAddressIsSameAsShipping && paymentAddresses.length > 0 ?
                                <List style={styles.addressesList}>
                                    {
                                        paymentAddresses.map((address: any, index: number) => this.renderPaymentAddress(address))
                                    }
                                </List> : null
                        }
                    </View>

                </View>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0,
    },
    addressesList: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    addressContainerItem: {
        marginLeft: 0,
    },
    addressBody: {
        flex: 1,
        flexDirection: 'column',
    },
    addressName: {
        fontFamily: 'Montserrat-SemiBold',
    },
    address: {
        fontFamily: 'Montserrat-Regular',
    },
    addressesBlock: {
        marginBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
    },
    addressBlockTitle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
    },
    paymentAddressConfirmationBlock: {
        flexDirection: 'row',
        marginTop: 10,
    }
});

export { VEIW_CALLBACK_ENUMS as CALLBACK_ENUMS_ADDRESSES };
