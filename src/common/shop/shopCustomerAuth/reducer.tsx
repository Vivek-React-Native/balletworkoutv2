import SHOP_CUSTOMER_AUTH from './constants';

const initialState = {
    isLoggedIn: false,
    isLoggingIn: false,
    error: null,
    shopCustomerData: {},
};

export default function (state: any = initialState, action: any) {

    if (action.type === SHOP_CUSTOMER_AUTH.LOGIN_SHOP_CUSTOMER) {
        return {
            ...state,
            isLoggedIn: false,
            isLoggingIn: true,
            error: null,
            shopCustomerData: {},
        };
    }

    if (action.type === SHOP_CUSTOMER_AUTH.LOGIN_SHOP_CUSTOMER_SUCCESS) {

        if (action.payload) {
            return {
                ...state,
                isLoggedIn: true,
                isLoggingIn: false,
                error: null,
                shopCustomerData: action.payload,
            };
        } else {
            return {
                ...state,
                isLoggedIn: true,
                isLoggingIn: false,
                error: null,
            };
        }
    }

    if (action.type === SHOP_CUSTOMER_AUTH.LOGIN_SHOP_CUSTOMER_FAILURE) {
        return {
            ...state,
            isLoggedIn: false,
            isLoggingIn: false,
            error: action.payload,
            shopCustomerData: {}
        };
    }

    if (action.type === SHOP_CUSTOMER_AUTH.REGISTERING_CUSTOMER) {
        return {
            ...state,
            isLoggedIn: false,
            isLoggingIn: true,
            error: null,
            shopCustomerData: {},
        };
    }

    if (action.type === SHOP_CUSTOMER_AUTH.REGISTERING_CUSTOMER_SUCCESS) {

        if (action.payload) {
            return {
                ...state,
                isLoggedIn: true,
                isLoggingIn: false,
                error: null,
                shopCustomerData: action.payload,
            };
        } else {
            return {
                ...state,
                isLoggedIn: true,
                isLoggingIn: false,
                error: null,
            };
        }
    }

    if (action.type === SHOP_CUSTOMER_AUTH.REGISTERING_CUSTOMER_FAILURE) {
        return {
            ...state,
            isLoggedIn: false,
            isLoggingIn: false,
            error: action.payload,
            shopCustomerData: {}
        };
    }


    if (action.type === SHOP_CUSTOMER_AUTH.LOGOUT_SHOP_CUSTOMER) {
        return {
            ...state,
            isLoggingIn: true,
            error: null,
        };
    }

    if (action.type === SHOP_CUSTOMER_AUTH.LOGOUT_SHOP_CUSTOMER_SUCCESS) {
        return {
            ...state,
            isLoggedIn: false,
            isLoggingIn: false,
            error: null,
            shopCustomerData: {},
        };
    }

    if (action.type === SHOP_CUSTOMER_AUTH.LOGOUT_SHOP_CUSTOMER_FAILURE) {
        return {
            ...state,
            error: action.payload,
        };
    }

    return state;
}