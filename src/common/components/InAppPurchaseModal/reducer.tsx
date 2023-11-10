import IN_APP_PURCHASES from './constants';
import AUTH from './../../auth/constants';

const initialState = {
    isLoading: false,
    error: null,
    expiryTime: 0,
    productId: '',
};

export default function (state: any = initialState, action: any) {

    if (action.type === IN_APP_PURCHASES.PURCHASE_DATA_SEND) {
        return {
            ...state,
            isLoading: true,
        };
    }

    if (action.type === IN_APP_PURCHASES.PURCHASE_DATA_SEND_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            expiryTime: action.payload.expiryTime,
            productId: action.payload.productId,
            error: null,
        };
    }

    if (action.payload === IN_APP_PURCHASES.PURCHASE_DATA_SEND_FAILURE) {
        return {
            ...state,
            isLoading: false,
            expiryTime: 0,
            productId: '',
            error: action.payload
        };
    }

    return state;
}