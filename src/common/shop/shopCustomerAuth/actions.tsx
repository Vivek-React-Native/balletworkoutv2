import SHOP_CUSTOMER_AUTH from './constants';
import axios from 'axios';
import { baseShopServerApi } from './../../appConstants';

/**
 * @constant axios
 */
const http = axios.create({
    baseURL: baseShopServerApi,
    timeout: 60*3*1000,
    headers: { 'Content-Type': 'application/json' }
});

export function customerLogin() {
    return {
        type: SHOP_CUSTOMER_AUTH.LOGIN_SHOP_CUSTOMER,
    };
}

export function customerLoginSuccess(data: any) {
    return {
        type: SHOP_CUSTOMER_AUTH.LOGIN_SHOP_CUSTOMER_SUCCESS,
        payload: data,
    };
}

export function customerLoginFailure(error: any) {
    return {
        type: SHOP_CUSTOMER_AUTH.LOGIN_SHOP_CUSTOMER_FAILURE,
        payload: error,
    };
}

export function registeringCustomer() {
    return {
        type: SHOP_CUSTOMER_AUTH.REGISTERING_CUSTOMER,
    }
}

export function registeringCustomerSuccess(userData: any) {
    return {
        type: SHOP_CUSTOMER_AUTH.REGISTERING_CUSTOMER_SUCCESS,
        payload: userData,
    }
}

export function registeringCustomerFailure(errors: any) {
    return {
        type: SHOP_CUSTOMER_AUTH.REGISTERING_CUSTOMER_FAILURE,
        payload: errors,
    }
}

export function customerLoggingOut() {
    return {
        type: SHOP_CUSTOMER_AUTH.LOGOUT_SHOP_CUSTOMER,
    };
}

export function customerLoggingOutSuccess() {
    return {
        type: SHOP_CUSTOMER_AUTH.LOGOUT_SHOP_CUSTOMER_SUCCESS,
    };
}

export function customerLoggingOutFailure(error: any) {
    return {
        type: SHOP_CUSTOMER_AUTH.LOGOUT_SHOP_CUSTOMER_FAILURE,
        payload: error,
    };
}

export function doCustomerLogin(loginData: Object) {
    return (dispatch: Function, getState: Function) => {

        let shopToken = getState().shopAuth.shopAuthData.access_token;

        http.post('login', loginData, {
            headers: {
                Authorization: `Bearer ${shopToken}`
            }
        }).then(({ data }) => {
            if (data.success) {
                dispatch(customerLoginSuccess(data.data));
            } else if (!data.success && typeof data.error === 'object') {
                dispatch(customerLoginFailure(data.error.warning));
            } else if (!data.success && typeof data.error === 'string' && data.error === 'User already is logged') {
                dispatch(customerLoginSuccess(null));
            }
        }).catch(({ response }) => {
            dispatch(customerLoginFailure(response.data));
        });
    }
}

export function doRegisterCustomer(user: any) {
    return (dispatch: Function, getState: Function) => {
        dispatch(registeringCustomer());

        let shopToken = getState().shopAuth.shopAuthData.access_token;

        http.post('register', user, {
            headers: { Authorization: `Bearer ${shopToken}` }
        }).then(({ data }) => {
            if (data.success) {
                dispatch(registeringCustomerSuccess(data.data));
            } else {
                dispatch(registeringCustomerFailure(data.error));
            }
        }).catch(({ response }) => {
            dispatch(registeringCustomerFailure(response.data));
        });
    }
}

export function loginCustomer(userData: any) {
    return (dispatch: Function) => {
        dispatch(registeringCustomerSuccess(userData));
    }
}

export function logoutCustomer() {
    return (dispatch: Function, getState: Function) => {
        dispatch(customerLoggingOut());
        let shopToken = getState().shopAuth.shopAuthData.access_token;
        http.post('logout', {}, {
            headers: {
                Authorization: `Bearer ${shopToken}`
            }
        }).then(({ data }) => {
            if (data.success) {
                dispatch(customerLoggingOutSuccess());
            } else {
                dispatch(customerLoggingOutFailure(data.error));
            }
        }).catch(({ response }) => {
            if (typeof response !== 'undefined') {
                dispatch(customerLoggingOutFailure('Network Error'));
            } else {
                dispatch(customerLoggingOutFailure(response.data));
            }
        });
    }
}
