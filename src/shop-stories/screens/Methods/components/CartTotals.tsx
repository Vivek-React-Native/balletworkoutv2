import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { List, ListItem } from 'native-base';
import i18n from '../../../../common/i18n';
import { PRIMARY_COLOR } from '../../../../utilities/Theme';


interface Props {
    store: any
}
interface State {
    totals: any;
}

export default class CartTotals extends Component<Props, State> {

    unSubscribeStore: Function;

    state = {
        totals: [],
    };

    componentWillMount() {

        const { store } = this.props;
        this.setState({ totals: store.getState().cart.cart.totals });

        this.unSubscribeStore = store.subscribe(() => {
            let totals = store.getState().cart.cart.totals;

            this.setState({ totals });
        });
    }

    renderTotal(total: any) {
        return (
            <ListItem style={styles.totalListItem} key={total.code}>
                <Text style={styles.totalText}><Text style={styles.totalTitle}>{total.title}: </Text>{total.text}</Text>
            </ListItem>
        );
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{i18n.t('shop.cart_total_title')}</Text>
                <List>
                    {this.state.totals.length > 0 ? this.state.totals.map((total: any, index: number) => this.renderTotal(total)) : null}
                </List>
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
        color: PRIMARY_COLOR,
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
    },
    totalListItem: {
        marginLeft: 0,
        justifyContent: 'flex-end',
    },
    totalText: {
        fontFamily: 'Montserrat-Regular'
    },
    totalTitle: {
        fontFamily: 'Montserrat-SemiBold'
    }
});