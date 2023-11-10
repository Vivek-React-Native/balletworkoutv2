import SHOP_CUSTOMER_AUTH from './constants';

const initialState = {
    isLogged: false,
    isLoading: false,
    errors: null,
}

export default function (state: any = initialState, action: any) {

    if(action.type === SHOP_CUSTOMER_AUTH.LOGGING_IN_CUSTOMER) {
        return {
            ...state,
            isLoading: true,
            error: null,
        };
    }

    if(action.type === SHOP_CUSTOMER_AUTH.LOGGING_IN_CUSTOMER_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            isLogged: true,
        };
    }

    if(action.type === SHOP_CUSTOMER_AUTH.LOGGING_IN_CUSTOMER_FAILURE) {
        return {
            ...state,
            isLoading: false,
            isLogged: false,
            errors: action.payload,
        }
    }

    if(action.type === SHOP_CUSTOMER_AUTH.REGISTERING_CUSTOMER) {
        return {
            ...state,
            isLoading: true,
            error: null,
        };
    }

    if(action.type === SHOP_CUSTOMER_AUTH.REGISTERING_CUSTOMER_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            isLogged: true,
        };
    }

    if(action.type === SHOP_CUSTOMER_AUTH.REGISTERING_CUSTOMER_FAILURE) {
        return {
            ...state,
            isLoading: false,
            isLogged: false,
            errors: action.payload,
        }
    }

    return state;
}