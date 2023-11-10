import { Platform, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

const isIPhone: boolean = Platform.OS === 'ios';
const isIPhoneX: boolean = Platform.OS === 'ios' && height >= 811;
const isAndroid: boolean = Platform.OS === 'android';
const isIpad: boolean = Platform.OS === 'ios' && width >= 768;
const isTab: boolean = Platform.OS === 'android' && width >= 768;
const isIphoneSe: boolean = Platform.OS === 'ios' && width <= 320;

function isIphoneWithNotch() {
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        (height === 780 ||
            width === 780 ||
            height === 812 ||
            width === 812 ||
            height === 844 ||
            width === 844 ||
            height === 896 ||
            width === 896 ||
            height === 926 ||
            width === 926)
    );
}

export { isIPhoneX, isAndroid, isIpad, isIPhone, isTab, isIphoneSe, isIphoneWithNotch };
