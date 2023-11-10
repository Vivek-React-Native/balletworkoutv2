const CART = {
    
    /**
     * Shipping Actions
     */
    //fetch addresses
    FETCH_SHIPPING_ADDRESSES: 'cart/fetch-shipping-address',
    FETCH_SHIPPING_ADDRESSES_SUCCESS: 'cart/fetch-shipping-address-success',
    FETCH_SHIPPING_ADDRESSES_FAILURE: 'cart/fetch-shipping-address-failure',
    //select address
    SELECT_SHIPPING_ADDRESS: 'cart/select-shipping-address',
    SELECT_SHIPPING_ADDRESS_SUCCESS: 'cart/select-shipping-address-success',
    SELECT_SHIPPING_ADDRESS_FAILURE: 'cart/select-shipping-address-failure',
    //fetch shipping methods
    FETCH_SHIPPING_METHODS: 'cart/fetch-shipping-methods',
    FETCH_SHIPPING_METHODS_SUCCESS: 'cart/fetch-shipping-methods-success',
    FETCH_SHIPPING_METHODS_FAILURE: 'cart/fetch-shipping-methods-failure',
    //set shipping method
    SELECT_SHIPPING_MEHTOD: 'cart/select-shipping-methos',
    SELECT_SHIPPING_MEHTOD_SUCCESS: 'cart/select-shipping-method-success',
    SELECT_SHIPPING_MEHTOD_FAILURE: 'cart/select-shipping-method-failure',

    /**
     * Payment Actions
     */
    //fetch addresses
    FETCH_PAYMENT_ADDRESSES: 'cart/fetch-payment-address',
    FETCH_PAYMENT_ADDRESSES_SUCCESS: 'cart/fetch-shipping-payment-success',
    FETCH_PAYMENT_ADDRESSES_FAILURE: 'cart/fetch-shipping-payment-failure',
    //select address
    SELECT_PAYMENT_ADDRESS: 'cart/select-payment-address',
    SELECT_PAYMENT_ADDRESS_SUCCESS: 'cart/select-payment-address-success',
    SELECT_PAYMENT_ADDRESS_FAILURE: 'cart/select-payment-address-failure',
    //fetch payment methods
    FETCH_PAYMENT_METHODS: 'cart/fetch-payment-methods',
    FETCH_PAYMENT_METHODS_SUCCESS: 'cart/fetch-payment-methods-success',
    FETCH_PAYMENT_METHODS_FAILURE: 'cart/fetch-payment-methods-failure',
    //set payment method
    SELECT_PAYMENT_MEHTOD: 'cart/select-payment-methos',
    SELECT_PAYMENT_MEHTOD_SUCCESS: 'cart/select-payment-method-success',
    SELECT_PAYMENT_MEHTOD_FAILURE: 'cart/select-payment-method-failure',
};

export default CART;