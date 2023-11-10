import CART_ACTIONS from './constants';
import { findArray } from '../../../../utilities/Functions';

const initialState = {
    isLoading: false,
    errors: null,
    cart: {
        cart: {
            products: []
        }
    },
};

export default function (state: any = initialState, action: any) {

    if (action.type === CART_ACTIONS.ADD_TO_CART) {
        return {
            ...state,
            isLoading: true,
            errors: null,
            cart: {},
        }
    }

    if (action.type === CART_ACTIONS.ADD_TO_CART_SUCCESS2) {

        let cartState = state.cart;

        // get item and product from payload
        const { item, product } = action.payload;

        // find if item is already there in the cart
        let items = findArray(cartState, { product_id: action.payload.product_id });

        let cart = null;

        // if item is already there then update it
        if (items.length > 0) {
            cart = cartState.map((item: any, index: number) => {
                if (item.product_id === action.payload.product_id) {
                    return {
                        ...item,
                        quantity: item.quantity + action.payload.quantity,
                    };
                }
            });
        } else { // else add it
            item["price"] = product.special === "" ? parseFloat(product.price) : parseFloat(product.special);
            cartState.push(item);
            cart = cartState;
        }

        return {
            ...state,
            isLoading: false,
            errors: null,
            cart: cart,
        }
    }

    if (action.type === CART_ACTIONS.ADD_TO_CART_SUCCESS) {

        return {
            ...state,
            isLoading: false,
            errors: null,
        }

    }

    if (action.type === CART_ACTIONS.ADD_TO_CART_FAILURE) {
        return {
            ...state,
            isLoading: false,
            errors: action.payload,
        }
    }

    if (action.type === CART_ACTIONS.RETRIEVE_CART) {
        return {
            ...state,
            isLoading: true,
            errors: null,
        }
    }

    if (action.type === CART_ACTIONS.RETRIEVE_CART_SUCEESS) {
        return {
            ...state,
            isLoading: false,
            errors: null,
            cart: action.payload,
        }
    }

    if (action.type === CART_ACTIONS.RETRIEVE_CART_FAILURE) {
        return {
            ...state,
            isLoading: false,
            errors: action.payload,
            cart: {
                cart: {
                    products: []
                }
            },
        }
    }

    if(action.type === CART_ACTIONS.UPDATE_CART_ITEM) {
        return {
            ...state,
            isLoading: true,
            errors: null,
        }
    }

    if (action.type === CART_ACTIONS.UPDATE_CART_ITEM_SUCCESS) {

        return {
            ...state,
            isLoading: false,
            errors: null,
        }

    }

    if (action.type === CART_ACTIONS.UPDATE_CART_ITEM_FAILURE) {
        return {
            ...state,
            isLoading: false,
            errors: action.payload,
        }
    }

    if(action.type === CART_ACTIONS.REMOVE_CART_ITEM) {
        return {
            ...state,
            isLoading: true,
            errors: null,
        }
    }

    if (action.type === CART_ACTIONS.REMOVE_CART_ITEM_SUCCESS) {

        return {
            ...state,
            isLoading: false,
            errors: null,
        }

    }

    if (action.type === CART_ACTIONS.REMOVE_CART_ITEM_FAILURE) {
        return {
            ...state,
            isLoading: false,
            errors: action.payload,
        }
    }

    return state;
}
