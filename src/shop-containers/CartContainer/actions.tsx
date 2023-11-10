import CART from './constants';
import axios from 'axios';
import { baseShopServerApi } from './../../common/appConstants';
import { retrieveCart } from './../../common/shop/shopActions/cart/actions';

/**
 * @constant axios
 */
const http = axios.create({
    baseURL: baseShopServerApi,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});


/**
* Shipping Actions
*/
//Fetch Shipping Address
export function fetchingShippingAddress() {
    return {
        type: CART.FETCH_SHIPPING_ADDRESSES,
    }
}
export function fetchingShippingAddressSuccess(data: any) {
    return {
        type: CART.FETCH_SHIPPING_ADDRESSES_SUCCESS,
        payload: data,
    }
}
export function fetchingShippingAddressFailure(errors: any) {
    return {
        type: CART.FETCH_SHIPPING_ADDRESSES_FAILURE,
        payload: errors
    }
}
// Select Shipping Address
export function selectingShippingAddress() {
    return {
        type: CART.SELECT_SHIPPING_ADDRESS,
    }
}
export function selectingShippingAddressSuccess(data: any) {
    return {
        type: CART.SELECT_SHIPPING_ADDRESS_SUCCESS,
        payload: data,
    }
}
export function selectingShippingAddressFailure(errors: any) {
    return {
        type: CART.SELECT_SHIPPING_ADDRESS_FAILURE,
        payload: errors
    }
}
// Fetch Shipping Methods
export function fetchingShippingMethods() {
    return {
        type: CART.FETCH_SHIPPING_METHODS,
    }
}
export function fetchingShippingMethodsSuccess(data: any) {
    return {
        type: CART.FETCH_SHIPPING_METHODS_SUCCESS,
        payload: data,
    }
}
export function fetchingShippingMethodsFailure(errors: any) {
    return {
        type: CART.FETCH_SHIPPING_METHODS_FAILURE,
        payload: errors
    }
}
// Select Shipping Method
export function selectingShippingMethods() {
    return {
        type: CART.SELECT_SHIPPING_MEHTOD,
    }
}
export function selectingShippingMethodsSuccess(data: any) {
    return {
        type: CART.SELECT_SHIPPING_MEHTOD_SUCCESS,
        payload: data,
    }
}
export function selectingShippingMethodsFailure(errors: any) {
    return {
        type: CART.SELECT_SHIPPING_MEHTOD_FAILURE,
        payload: errors
    }
}



/**
 * Payment Actions
 */
//Fetch Payment Address
export function fetchingPaymentAddress() {
    return {
        type: CART.FETCH_PAYMENT_ADDRESSES,
    }
}
export function fetchingPaymentAddressSuccess(data: any) {
    return {
        type: CART.FETCH_PAYMENT_ADDRESSES_SUCCESS,
        payload: data,
    }
}
export function fetchingPaymentAddressFailure(errors: any) {
    return {
        type: CART.FETCH_PAYMENT_ADDRESSES_FAILURE,
        payload: errors
    }
}
// Select Payment Address
export function selectingPaymentAddress() {
    return {
        type: CART.SELECT_PAYMENT_ADDRESS,
    }
}
export function selectingPaymentAddressSuccess(data: any) {
    return {
        type: CART.SELECT_PAYMENT_ADDRESS_SUCCESS,
        payload: data,
    }
}
export function selectingPaymentAddressFailure(errors: any) {
    return {
        type: CART.SELECT_PAYMENT_ADDRESS_FAILURE,
        payload: errors
    }
}
// Fetch Payment Methods
export function fetchingPaymentMethods() {
    return {
        type: CART.FETCH_PAYMENT_METHODS,
    }
}
export function fetchingPaymentMethodsSuccess(data: any) {
    return {
        type: CART.FETCH_PAYMENT_METHODS_SUCCESS,
        payload: data,
    }
}
export function fetchingPaymentMethodsFailure(errors: any) {
    return {
        type: CART.FETCH_PAYMENT_METHODS_SUCCESS,
        payload: errors
    }
}
// Select Payment Method
export function selectingPaymentMethods() {
    return {
        type: CART.SELECT_PAYMENT_MEHTOD,
    }
}
export function selectingPaymentMethodsSuccess(data: any) {
    return {
        type: CART.SELECT_PAYMENT_MEHTOD_SUCCESS,
        payload: data,
    }
}
export function selectingPaymentMethodsFailure(errors: any) {
    return {
        type: CART.SELECT_PAYMENT_MEHTOD_FAILURE,
        payload: errors
    }
}


/**
 * Dispatch Actions
 * Shipping
 */
export function fetchShippingAddressses() {
    return (dispatch: Function, getState: Function) => {
        dispatch(fetchingShippingAddress());

        let shopToken = getState().shopAuth.shopAuthData.access_token;

        http.get('shippingaddress', {
            headers: {
                Authorization: `Bearer ${shopToken}`
            }
        }).then(({ data }) => {

            if (data.success) {
                dispatch(fetchingShippingAddressSuccess(data.data));
            } else {
                dispatch(fetchingShippingAddressFailure(data.error));
            }

        }).catch(({ response }) => {
            dispatch(fetchingShippingAddressFailure(response.data));
        });
    }
}

export function selectShippingAddress(shippingAddress: any) {
    return (dispatch: Function, getState: Function) => {
        dispatch(selectingShippingAddress());

        let shopToken = getState().shopAuth.shopAuthData.access_token;

        http.post('shippingaddress', shippingAddress, {
            headers: {
                Authorization: `Bearer ${shopToken}`
            }
        }).then(({ data }) => {

            if (data.success) {
                dispatch(selectingShippingAddressSuccess(shippingAddress.address_id));
            } else {
                dispatch(selectingShippingAddressFailure(data.error));
            }

        }).catch(({ response }) => {
            dispatch(selectingShippingAddressFailure(response.data));
        });
    }
}

export function fetchShippingMethods() {
    return (dispatch: Function, getState: Function) => {
        dispatch(fetchingShippingMethods());

        let shopToken = getState().shopAuth.shopAuthData.access_token;

        http.get('shippingmethods', {
            headers: {
                Authorization: `Bearer ${shopToken}`
            }
        }).then(({ data }) => {
            if (data.success) {
                dispatch(fetchingShippingMethodsSuccess(data.data));
            } else {
                dispatch(fetchingShippingMethodsFailure(data.error));
            }

        }).catch(({ response }) => {
            dispatch(fetchingShippingMethodsFailure(response.data));
        });
    }
}

export function selectShippingMethods(shippingMethod: any) {
    return (dispatch: Function, getState: Function) => {
        dispatch(selectingShippingMethods());

        let shopToken = getState().shopAuth.shopAuthData.access_token;

        http.post('shippingmethods', shippingMethod, {
            headers: {
                Authorization: `Bearer ${shopToken}`
            }
        }).then(({ data }) => {
            if (data.success) {
                dispatch(selectingShippingMethodsSuccess(shippingMethod.shipping_method));
                dispatch(retrieveCart());
            } else {
                dispatch(selectingShippingMethodsFailure(data.error));
            }

        }).catch(({ response }) => {
            dispatch(selectingShippingMethodsFailure(response.data));
        });
    }
}


/**
 * Dispatch Actions
 * Payment
 */
export function fetchPaymentAddressses() {
    return (dispatch: Function, getState: Function) => {
        dispatch(fetchingPaymentAddress());

        let shopToken = getState().shopAuth.shopAuthData.access_token;

        http.get('paymentaddress', {
            headers: {
                Authorization: `Bearer ${shopToken}`
            }
        }).then(({ data }) => {

            if (data.success) {
                dispatch(fetchingPaymentAddressSuccess(data.data));
            } else {
                dispatch(fetchingPaymentAddressFailure(data.error));
            }

        }).catch(({ response }) => {
            dispatch(fetchingPaymentAddressFailure(response.data));
        });
    }
}

export function selectPaymentAddress(paymentAddress: any) {
    return (dispatch: Function, getState: Function) => {
        dispatch(selectingPaymentAddress());

        let shopToken = getState().shopAuth.shopAuthData.access_token;

        http.post('paymentaddress', paymentAddress, {
            headers: {
                Authorization: `Bearer ${shopToken}`
            }
        }).then(({ data }) => {

            if (data.success) {
                dispatch(selectingPaymentAddressSuccess(paymentAddress.address_id));
            } else {
                dispatch(selectingPaymentAddressFailure(data.error));
            }

        }).catch(({ response }) => {
            dispatch(selectingPaymentAddressFailure(response.data));
        });
    }
}

export function fetchPaymentMethods() {
    return (dispatch: Function, getState: Function) => {
        dispatch(fetchingPaymentMethods());

        let shopToken = getState().shopAuth.shopAuthData.access_token;

        http.get('paymentmethods', {
            headers: {
                Authorization: `Bearer ${shopToken}`
            }
        }).then(({ data }) => {
            if (data.success) {
                dispatch(fetchingPaymentMethodsSuccess(data.data));
            } else {
                dispatch(fetchingPaymentMethodsFailure(data.error));
            }

        }).catch(({ response }) => {
            dispatch(fetchingPaymentMethodsFailure(response.data));
        });
    }
}

export function selectPaymentMethods(paymentMethod: any) {
    return (dispatch: Function, getState: Function) => {
        dispatch(selectingPaymentMethods());

        let shopToken = getState().shopAuth.shopAuthData.access_token;

        http.post('paymentmethods', paymentMethod, {
            headers: {
                Authorization: `Bearer ${shopToken}`
            }
        }).then(({ data }) => {
            if (data.success) {
                dispatch(selectingPaymentMethodsSuccess(paymentMethod.payment_method));
            } else {
                dispatch(selectingPaymentMethodsFailure(data.error));
            }

        }).catch(({ response }) => {
            dispatch(selectingPaymentMethodsFailure(response.data));
        });

    }
}
