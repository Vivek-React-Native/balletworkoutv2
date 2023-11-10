import SHOP_CUSTOMER_AUTH from './constants';
import axios from 'axios';
import { baseShopServerApi } from './../../../appConstants';

/**
 * @constant axios
 */
const http = axios.create({
    baseURL: baseShopServerApi,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});

export function registeringCustomer() {
    return {
        type: SHOP_CUSTOMER_AUTH.REGISTERING_CUSTOMER,
    }
}

export function registeringCustomerSuccess() {
    return {
        type: SHOP_CUSTOMER_AUTH.REGISTERING_CUSTOMER_SUCCESS,
    }
}

export function registeringCustomerFailure(errors: any) {
    return {
        type: SHOP_CUSTOMER_AUTH.REGISTERING_CUSTOMER_FAILURE,
        payload: errors,
    }
}

export function customerLoggingIn() {
    return {
        type: SHOP_CUSTOMER_AUTH.LOGGING_IN_CUSTOMER
    }
}

export function customerlogInSuccess() {
    return {
        type: SHOP_CUSTOMER_AUTH.LOGGING_IN_CUSTOMER_SUCCESS,
    }
}

export function customerLogInFailure(error: any) {
    return {
        type: SHOP_CUSTOMER_AUTH.LOGGING_IN_CUSTOMER_FAILURE,
        payload: error,
    }
}

export function customerLogIn(userCredentials: any) {
    return (dispatch: Function, getState: Function) => {
        dispatch(customerLoggingIn());
        let shopToken = getState().shopAuth.shopAuthData.access_token;

        http.post('login', userCredentials, {
            headers: {
                Authorization: `Bearer ${shopToken}`,
            }
        }).then(({data}) => {
            if(data.success) {
                dispatch(customerlogInSuccess());
            } else {
                dispatch(customerLogInFailure(data.error));
            }
        }).catch(({response}) => {

        });
    }
}

export function registerCustomer(user: any) {
    return (dispatch: Function, getState: Function) => {
        dispatch(registeringCustomer());

        let shopToken = getState().shopAuth.shopAuthData.access_token;

        http.post('register', user, {
            headers: { Authorization: `Bearer ${shopToken}` }
        }).then(({data}) => {
            if(data.success) {
                dispatch(registeringCustomerSuccess());
            } else {
                dispatch(registeringCustomerFailure(data.error));
            }
        }).catch(({response}) => {
            dispatch(registeringCustomerFailure(response.data));
        });
    }
}