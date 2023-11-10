import CART_ACTIONS from './constants';
import axios from 'axios';
import { baseShopServerApi } from '../../../appConstants';

/**
 * @constant axios
 */
const http = axios.create({
    baseURL: baseShopServerApi,
    timeout: 60*3*1000,
    headers: { 'Content-Type': 'application/json' }
});

/**
 * Add to Cart Actions
 */
export function addingToCart() {
    return {
        type: CART_ACTIONS.ADD_TO_CART,
    };
}

export function addToCartSuccess(cart: any) {
    return {
        type: CART_ACTIONS.ADD_TO_CART_SUCCESS,
        payload: cart,
    };
}

export function addToCartFailure(errors: any) {
    return {
        type: CART_ACTIONS.ADD_TO_CART_FAILURE,
        payload: errors,
    };
}

/**
 * Retrieve Cart Actions
 */
export function retriewingCart() {
    return {
        type: CART_ACTIONS.RETRIEVE_CART,
    };
}

export function retrieveCartSuccess(cart: any) {
    return {
        type: CART_ACTIONS.RETRIEVE_CART_SUCEESS,
        payload: cart,
    };
}

export function retrieveCartFailure(errors: any) {
    return {
        type: CART_ACTIONS.RETRIEVE_CART_FAILURE,
        payload: errors,
    };
}

export function updatingCartItem() {
    return {
        type: CART_ACTIONS.UPDATE_CART_ITEM,
    };
}

export function updateCartItemSuccess() {
    return {
        type: CART_ACTIONS.UPDATE_CART_ITEM_SUCCESS,
    };
}

export function updateCartItemFailure(errors: any) {
    return {
        type: CART_ACTIONS.UPDATE_CART_ITEM_FAILURE,
        payload: errors,
    };
}

export function removingCartItem() {
    return {
        type: CART_ACTIONS.REMOVE_CART_ITEM
    };
}

export function removingCartItemSuccess() {
    return {
        type: CART_ACTIONS.REMOVE_CART_ITEM_SUCCESS,
    }
}

export function removingCartItemFailure(errors: any) {
    return {
        type: CART_ACTIONS.REMOVE_CART_ITEM_FAILURE,
        payload: errors,
    }
}

/**
 * Add to cart dispatch
 * @param item 
 * @param product 
 */
export function addToCart(item: any, product: any) {
    return (dispatch: Function, getState: Function) => {
        dispatch(addingToCart());

        const shopToken = getState().shopAuth.shopAuthData.access_token;

        http.post('cart', item, {
            headers: {
                Authorization: `Bearer ${shopToken}`
            }
        }).then(({ data }) => {

            if (data.success) {
                dispatch(addToCartSuccess({ item, product }));
                dispatch(retrieveCart());
            } else {
                dispatch(addToCartFailure(data.error));
            }

        }).catch(({ response }) => {

            if (typeof response === 'undefined') {
                dispatch(addToCartFailure("Network Error!"));
            } else {
                dispatch(addToCartFailure(response.error));
            }            
        });
    }
}

/**
 * Retrieve Cart Dispatch
 */
export function retrieveCart() {
    return (dispatch: Function, getState: Function) => {

        const shopToken = getState().shopAuth.shopAuthData.access_token;

        dispatch(retriewingCart());

        http.get('cart', {
            headers: {
                Authorization: `Bearer ${shopToken}`,
            }
        }).then(({ data }) => {
            if (typeof data !== 'undefined' && data.success) {
                dispatch(retrieveCartSuccess(data.data));
            } else {
                dispatch(retrieveCartFailure(data.error));
            }
        }).catch(({ response }) => {
            if (typeof response === 'undefined') {
                dispatch(retrieveCartFailure("Network Error"));
            } else {
                dispatch(retrieveCartFailure(response.error));
            }
        });
    }
}

export function updateCartItem(item: any) {

    return (dispatch: Function, getState: Function) => {

        const shopToken = getState().shopAuth.shopAuthData.access_token;

        dispatch(updatingCartItem());

        http.put('cart', item, {
            headers: {
                Authorization: `Bearer ${shopToken}`,
            }
        }).then(({ data }) => {
            if (data.success) {
                dispatch(updateCartItemSuccess());
                dispatch(retrieveCart());
            } else {
                dispatch(updateCartItemFailure(data.error));
            }
        }).catch(({ response }) => {      
            if (typeof response === 'undefined') {
                dispatch(updateCartItemFailure("Network Error"));
            } else {
                dispatch(updateCartItemFailure(response.error));
            }
        });
    }
}

export function removeCartItem(item: any) {
    return (dispatch: Function, getState: Function) => {

        let shopToken = getState().shopAuth.shopAuthData.access_token;

        dispatch(removingCartItem());

        http.delete('cart', {
            data: item,
            headers: {
                Authorization: `Bearer ${shopToken}`,
            }
        }).then(({ data }) => {
            if (data.success) {
                dispatch(removingCartItemSuccess());
                dispatch(retrieveCart());
            } else {
                dispatch(removingCartItemFailure(data.error));
            }
        }).catch(({ response }) => {
            if (typeof response === 'undefined') {
                dispatch(removingCartItemFailure("Network Error"));
            } else {
                dispatch(removingCartItemFailure(response.error));
            }
            
        });

    }
}