import SHOP_AUTH from './constants';

const initialState = {
    isAuthenticating: false,
    errors: null,
    shopAuthData: {},
    isAuthenticated: false,
};

export default function (state: any = initialState, action: any) {

    if(SHOP_AUTH.AUTHENTICATE_SHOP_ACCESS === action.type) {
        return {
            ...state,
            isAuthenticating: true,
            isAuthenticated: false,
            shopAuthData: {},
            errors: null,
        };
    }

    if(SHOP_AUTH.AUTHENTICATE_SHOP_ACCESS_SUCCESS === action.type) {
        return {
            ...state,
            isAuthenticating: false,
            isAuthenticated: true,
            shopAuthData: action.payload,
            errors: null,
        };
    }

    if(SHOP_AUTH.AUTHENTICATE_SHOP_ACCESS_FAILURE === action.type) {
        return {
            ...state,
            isAuthenticating: false,
            isAuthenticated: false,
            shopAuthData: {},
            errors: action.payload,
        };
    }

    return state;

}