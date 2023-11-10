import SHOP_HOME from './constants';

const initialState = {
    productList: [],
    isLoading: false,
    errors: null,
};

export default function (state: any = initialState, action: any) {

    if (action.type === SHOP_HOME.FETCH_PRODUCT_LIST) {
        return {
            productList: [],
            isLoading: true,
            errors: null,
        }
    }

    if (action.type === SHOP_HOME.FETCH_PRODUCT_LIST_SUCCESS) {
        return {
            productList: action.payload,
            isLoading: false,
            errors: null,
        }
    }

    if (action.type === SHOP_HOME.FETCH_PRODUCT_LIST_FAILURE) {
        return {
            productList: [],
            isLoading: false,
            errors: action.payload,
        }
    }

    return state;

}