import SHOP_HOME from './constants';
import axios from 'axios';
import { baseShopServerApi } from './../../common/appConstants';

/**
 * @constant axios
 */
const http = axios.create({
    baseURL: baseShopServerApi,
    timeout: 60*3*1000,
    headers: { 'Content-Type': 'application/json' }
});

function fetchingProductList() {
    return {
        type: SHOP_HOME.FETCH_PRODUCT_LIST,
    };
}

function fetchingProductListSuccess(list: any) {
    return {
        type: SHOP_HOME.FETCH_PRODUCT_LIST_SUCCESS,
        payload: list,
    };
}

function fetchingProductListFailure(error: any) {
    return {
        type: SHOP_HOME.FETCH_PRODUCT_LIST_FAILURE,
        payload: error,
    };
}

export function fetchProductList() {
    return (dispatch: Function, getState: Function) => {
        let shopToken = getState().shopAuth.shopAuthData.access_token;

        dispatch(fetchingProductList());

        http.get('products', {
            headers: {
                Authorization: `Bearer ${shopToken}`
            }
        }).then(({ data }) => {
            if (data.success)
                dispatch(fetchingProductListSuccess(data.data));
            else
                dispatch(fetchingProductListFailure(data.error));
        }).catch(({ response }) => {
            dispatch(fetchingProductListFailure(response.data));
        });

    }
}