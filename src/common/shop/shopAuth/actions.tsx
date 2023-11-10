import SHOP_AUTH from './constants';
import axios from 'axios';
import { baseUrlApi } from './../../appConstants';
import { fetchProductList } from './../../../shop-containers/ShopHomeContainer/actions';

/**
 * @constant axios
 */
const http = axios.create({
    baseURL: baseUrlApi,
    timeout: 60 * 3 * 1000,
    headers: { 'Content-Type': 'application/json' }
});

export function authenticatingShop() {
    return {
        type: SHOP_AUTH.AUTHENTICATE_SHOP_ACCESS,
    };
}

export function authenticatingShopSuccessful(data: any) {
    return {
        type: SHOP_AUTH.AUTHENTICATE_SHOP_ACCESS_SUCCESS,
        payload: data,
    };
}

export function authenticatingShopfailure(data: any) {
    return {
        type: SHOP_AUTH.AUTHENTICATE_SHOP_ACCESS_SUCCESS,
        payload: data,
    };
}

export function authenticateShop() {
    return (dispatch: Function, getState: Function) => {
        let token = getState().auth.tokenData.token;
        let shopTokenData = getState().shopAuth.shopAuthData;

        if (Object.keys(shopTokenData).length === 0 || ((shopTokenData.timestamp + shopTokenData.timestamp) < ((new Date()).getTime() / 1000)) || typeof shopTokenData.access_token === 'undefined') {

            http.post('user/shop-authentication', {}, {
                headers: { Authorization: `Bearer ${token}` }
            }).then((response) => {
                const {data} = response;
                dispatch(authenticatingShopSuccessful(data))
                dispatch(fetchProductList());
            }).catch((error) => {
                const { response } = error;
                dispatch(authenticatingShopfailure(response.data));
            });
        } else {
            dispatch(authenticatingShopSuccessful(shopTokenData));
        }
    }
}
