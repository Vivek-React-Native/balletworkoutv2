import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, CardItem, Left, Body, Right, Text } from 'native-base';
import NumericInput from 'react-native-numeric-input';
import { SECONDARY_COLOR } from '../../../../utilities/Theme';
import i18n from '../../../../common/i18n';

interface Props {
    updateItem: Function;
    removeItem: Function;
    item: any;
}
interface State {
    quantity: number;
}
export default class CartItem extends Component<Props, State> {

    state = {
        quantity: this.props.item.quantity,
    }

    updateQty() {
        const { item, updateItem, removeItem } = this.props;
        let itemQty = {
            key: item.key,
            quantity: this.state.quantity.toString()
        };
        updateItem(itemQty);
    }

    removeItem() {
        const { item, updateItem, removeItem } = this.props;
        let itemDeletion = {
            key: item.key,
        };
        removeItem(itemDeletion);
    }

    render() {
        const { item } = this.props;
        return (
            <View style={styles.container}>
                <Card noShadow>
                    <CardItem style={styles.productItem}>
                        <Left style={styles.itemImageWrapper}>
                            <Image
                                style={styles.itemImage}
                                source={{ uri: item.thumb }} />
                        </Left>
                        <Body style={styles.itemBody}>
                            <View>
                                <Text style={styles.text}>{item.name}</Text>
                            </View>
                            <View>
                                <NumericInput
                                    rounded={true}
                                    value={this.state.quantity}
                                    step={1}
                                    totalWidth={60}
                                    minValue={1}
                                    maxValue={99}
                                    onChange={(value: number) => { this.setState({ quantity: value }) }}
                                    borderColor={SECONDARY_COLOR}
                                    initValue={this.state.quantity} />
                            </View>
                            <View style={styles.actionsContainer}>
                                <Text
                                    style={[styles.actions, styles.text]}
                                    onPress={() => this.updateQty()}>
                                    {i18n.t('shop.update_cart_item_text')}
                                </Text>
                                <Text
                                    style={[styles.actions, styles.text]}
                                    onPress={() => this.removeItem()}>
                                    {i18n.t('shop.remove_cart_item_text')}
                                </Text>
                            </View>
                        </Body>
                        <Right style={styles.itemAmount}>
                            <Text style={styles.price}>{item.price}</Text>
                            <Text style={styles.totalPrice}>{item.total}</Text>
                        </Right>
                    </CardItem>
                </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
    },
    productItem: {
        flex: -1,
        minHeight: 100,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    itemImageWrapper: {
        flex: 1,
    },
    itemImage: {
        flex: 1,
        height: 50,
        width: null,
        resizeMode: 'contain'
    },
    itemBody: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignSelf: 'stretch',

    },
    itemAmount: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'column',
    },
    actionsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 5,
    },
    text: {
        fontFamily: 'Montserrat-Regular'
    },
    actions: {
        flex: 1,
        fontSize: 14,
    },
    price: {
        flex: 0,
        fontFamily: 'Montserrat-Regular'
    },
    totalPrice: {
        flex: 0,
        fontFamily: 'Montserrat-SemiBold'
    }
});
