import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { } from 'native-base';
import ShopHeader from './../../common/shop/components/ShopHeader/ShopHeader';
import Order from './../../shop-stories/screens/Order';
import EmptyComponent from '../../common/components/EmptyComponent';


interface Props {
    navigation: any;
    screenProps: any;
}
interface State { }

export default class OrderPlacedContainer extends Component<Props, State> {

    static navigationOptions = {
        drawerLabel: EmptyComponent,
    };

    render() {
        const { screenProps: { store }, navigation } = this.props;
        return (
            <View style={styles.container}>
                <ShopHeader
                    store={store}
                    showMiniCart={true}
                    navigation={navigation} />
                <Order store={store} navigation={navigation} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
});

