import CART from './constants';

const intialState = {
    isLoading: false,
    errors: null,
    shippingAddresses: {},
    paymentAddresses: {},
    shippingMethods: {},
    paymentMethods: {},
};

export default function (state: any = intialState, action: any) {

    if (action.type === CART.FETCH_SHIPPING_ADDRESSES) {
        return {
            ...state,
            isLoading: true,
            errors: null,
        };
    }

    if (action.type === CART.FETCH_SHIPPING_ADDRESSES_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            errors: null,
            shippingAddresses: action.payload,
        };
    }
    
    if (action.type === CART.FETCH_SHIPPING_ADDRESSES_FAILURE) {
        return {
            ...state,
            isLoading: false,
            errors: action.payload,
        };
    }
    
    if (action.type === CART.FETCH_SHIPPING_METHODS) {
        return {
            ...state,
            isLoading: true,
            errors: null,
        };
    }
    
    if (action.type === CART.FETCH_SHIPPING_METHODS_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            errors: null,
            shippingMethods: action.payload,
        };
    }
    
    if (action.type === CART.FETCH_SHIPPING_METHODS_FAILURE) {
        return {
            ...state,
            isLoading: false,
            errors: action.payload,
        };
    }
    
    if (action.type === CART.SELECT_SHIPPING_ADDRESS) {
        return {
            ...state,
            isLoading: true,
            errors: null,
        };
    }
    
    if (action.type === CART.SELECT_SHIPPING_ADDRESS_SUCCESS) {

        let shippingAddresses = state.shippingAddresses;

        shippingAddresses['address_id'] = action.payload;

        return {
            ...state,
            isLoading: false,
            errors: null,
            shippingAddresses,
        };
    }
    
    if (action.type === CART.SELECT_SHIPPING_ADDRESS_FAILURE) {
        return {
            ...state,
            isLoading: false,
            errors: null,
        };
    }
    
    if (action.type === CART.SELECT_SHIPPING_MEHTOD) {
        return {
            ...state,
            isLoading: true,
            errors: null,
        };
    }
    
    if (action.type === CART.SELECT_SHIPPING_MEHTOD_SUCCESS) {

        let shippingMethods = state.shippingMethods;

        shippingMethods['code'] = action.payload;

        return {
            ...state,
            isLoading: false,
            errors: null,
            shippingMethods
        };
    }
    
    if (action.type === CART.SELECT_SHIPPING_MEHTOD_FAILURE) {
        return {
            ...state,
            isLoading: false,
            errors: action.payload,
        };
    }
    

    /**
     * Payment Reducers
     */
    if (action.type === CART.FETCH_PAYMENT_ADDRESSES) {
        return {
            ...state,
            isLoading: true,
            errors: null,
        };
    }
    
    if (action.type === CART.FETCH_PAYMENT_ADDRESSES_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            errors: null,
            paymentAddresses: action.payload,
        };
    }
    
    if (action.type === CART.FETCH_PAYMENT_ADDRESSES_FAILURE) {
        return {
            ...state,
            isLoading: false,
            errors: action.payload,
        };
    }
    
    if (action.type === CART.SELECT_PAYMENT_ADDRESS) {
        return {
            ...state,
            isLoading: true,
            errors: null,
        };
    }
    
    if (action.type === CART.SELECT_PAYMENT_ADDRESS_SUCCESS) {

        let paymentAddresses = state.paymentAddresses;

        paymentAddresses['address_id'] = action.payload;

        return {
            ...state,
            isLoading: false,
            errors: null,
            paymentAddresses,
        };
    }
      
    if (action.type === CART.SELECT_PAYMENT_ADDRESS_FAILURE) {
        return {
            ...state,
            isLoading: false,
            errors: action.payload,
        };
    }

    if (action.type === CART.FETCH_PAYMENT_METHODS) {
        return {
            ...state,
            isLoading: true,
            errors: null,
        };
    }
    
    if (action.type === CART.FETCH_PAYMENT_METHODS_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            errors: null,
            paymentMethods: action.payload,
        };
    }
    
    if (action.type === CART.FETCH_PAYMENT_METHODS_FAILURE) {
        return {
            ...state,
            isLoading: false,
            errors: action.payload,
        };
    }
  
    if (action.type === CART.SELECT_PAYMENT_MEHTOD) {
        return {
            ...state,
            isLoading: true,
            errors: null,
        };
    }
    
    if (action.type === CART.SELECT_PAYMENT_MEHTOD_SUCCESS) {

        let paymentMethods = state.paymentMethods;

        paymentMethods['code'] = action.payload;

        return {
            ...state,
            isLoading: false,
            errors: null,
            paymentMethods
        };
    }
    
    if (action.type === CART.SELECT_PAYMENT_MEHTOD_FAILURE) {
        return {
            ...state,
            isLoading: false,
            errors: action.payload,
        };
    }

    return state;
}