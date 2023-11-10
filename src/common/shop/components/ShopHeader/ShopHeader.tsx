import React, { Component } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { Header, Body, Left, Right, StyleProvider, Container, Title, Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Logo from './../../Logo';
import { PADDING_LEFT_RIGHT, SECONDARY_COLOR, PRIMARY_COLOR } from '../../../../utilities/Theme';
import { isIPhone, isIpad, isTab } from '../../../../utilities/Screen';
import MiniCart from './components/MiniCart';

interface Props {
    hasBackButton: boolean;
    navigation: any;
    hasTabs: boolean;
    showBurgerMenu: boolean;
    showMiniCart: boolean;
    props: any;
};
interface State { };
export default class ShopHeader extends Component<Props, State> {

    public static defaultProps: Partial<Props> = {
        hasBackButton: true,
        hasTabs: false,
        showBurgerMenu: false,
        showMiniCart: false,
    };

    render() {

        const { navigation, hasBackButton, hasTabs, showBurgerMenu, showMiniCart, store } = this.props;

        return (
            <Header hasTabs={hasTabs} noShadow androidStatusBarColor={'#464c6e'} style={styles.header}>

                <Left style={styles.headerLeftRight}>
                    {
                        hasBackButton ?
                            <Button transparent onPress={() => navigation.goBack()}>
                                <Icon name="arrow-left" style={styles.icon} />
                            </Button> : null
                    }
                    {
                        showBurgerMenu ?
                            <Button transparent onPress={() => navigation.openDrawer()}>
                                <Icon name="menu" style={styles.icon} />
                            </Button> : null
                    }
                </Left>

                <Body style={styles.headerBody}>
                    <Logo />
                </Body>
                <Right>
                    { showMiniCart? <MiniCart navigation={navigation} store={store}/>: null }
                </Right>
            </Header>
        );
    }
}

const styles = StyleSheet.create({
    conatianer: {
        flex: 1,
    },
    header: {
        zIndex: 999999,
        height: isIPhone ? 85 : 65,
		paddingLeft: isIpad || isTab ? 25 : PADDING_LEFT_RIGHT,
		paddingRight: isIpad || isTab ? 25 : PADDING_LEFT_RIGHT,
		backgroundColor: PRIMARY_COLOR,
		justifyContent: 'space-between',
    },
    headerBody: {
        flex: 0,
    },
    headerLeftRight: {
        flex: 1,
    },
    icon: {
        fontSize: 25,
        color: '#ffffff',
    },
});
