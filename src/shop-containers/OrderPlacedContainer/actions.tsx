import SHOP_ORDERS from './constants';
import axios from 'axios';
import { baseShopServerApi } from '../../common/appConstants';

/**
 * @constant axios
 */
const http = axios.create({
    baseURL: baseShopServerApi,
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
});

export function fetchingOrders() {
    return {
        type: SHOP_ORDERS.FETCH_ORDERS,
    };
}

export function fetchingOrdersSuccess(orders:any) {
    return {
        type: SHOP_ORDERS.FETCH_ORDERS_SUCCESS,
        payload: orders,
    };
}

export function fetchingOrdersFailure(errors: any) {
    return {
        type: SHOP_ORDERS.FETCH_ORDERS_FAILURE,
        payload: errors,
    };
}

export function fetchOrders() {
    return (dispatch: Function, getState: Function) => {
        dispatch(fetchingOrders());

        let shopToken = getState().shopAuth.shopAuthData.access_token;

        http.get('orders', {
            headers: {
                Authorization: `Bearer ${shopToken}`
            }
        }).then(({data}) => {

            if(data.success) {
                dispatch(fetchingOrdersSuccess(data.data));
            }

        }).catch(({response}) => {

        });
    }
}