import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import ProductImages from './components/ProductImages';
import ProductTitle from './components/ProductTitle';
import ProductPrice from './components/ProductPrice';
import OtherInfo from './components/OtherInfo';
import ProductOptions from './components/ProductOptions';
import ProductInfo from './components/ProductInfo';
import ProductButtons from './components/ProductButtons';
import i18n from '../../../common/i18n';
import { addToCart } from './../../../common/shop/shopActions';
import QuantityInput from './components/QuantityInput';
import Loader from '../../../common/components/Loader';
import { SECONDARY_COLOR } from '../../../utilities/Theme';
import { Toast } from 'native-base';

interface Props {
    navigation: any;
    addToCart: Function;
    store: any;
    isLoading: boolean;
}
interface State {
    productOptions: any;
    errors: any;
    quantity: number;
    isLoading: boolean;
}

export class ProductDetails extends Component<Props, State> {

    product: any;
    unSubscribeStore: Function;

    state = {
        errors: {},
        productOptions: {},
        quantity: 1,
        isLoading: this.props.isLoading,
    };

    componentWillMount() {
        const { store } = this.props;

        this.unSubscribeStore = store.subscribe(() => {
            let isLoading = store.getState().cart.isLoading;

            let hasError = store.getState().cart.errors;

            if (hasError !== null) {
                this.showError(hasError);
            }

            this.setState({ isLoading });
        });

    }

    showError(hasError: any) {
        if (typeof hasError === 'string') {
            if (hasError.toLowerCase() !== 'Cart is empty'.toLowerCase()) {
                Toast.show({
                    text: hasError + ': here'
                });
            }
        } else {
            Toast.show({
                text: i18n.t('shop.server_error_occurred')
            });
        }
    }

    constructor(props: any) {
        super(props);
        const { navigation } = this.props;
        this.product = navigation.getParam('product');
    }

    _setProductOptions(productOptions: any) {
        this.setState({ productOptions });
    }

    _setQuantity(quantity: number) {
        this.setState({ quantity });
    }

    _addToCart() {
        let item = {};
        let options = this.state.productOptions;

        if (this.__optionValidate()) {

            item = {
                "product_id": this.product.id,
                "quantity": this.state.quantity,
                "option": options
            };

            this.props.addToCart(item, this.product);
        }
    }

    private __optionValidate() {
        let error: any = {};
        const { options } = this.product;
        const { productOptions } = this.state;

        if (options.length === 0) {
            return Object.keys(error).length === 0;
        }

        options.map((option: any, index: number) => {
            if (option.required === "1" && typeof productOptions[option.product_option_id] === 'undefined') {
                error[option.product_option_id] = `${option.name} ${i18n.t('shop.required_option_text')}`;
            }
        });
        if (error) {
            this.setState({ errors: error });
        }

        return Object.keys(error).length === 0;
    }

    componentWillUnmount() {
        this.unSubscribeStore();
    }

    render() {
        const { name, images, price_formated, special_formated, special_start_date, special_end_date, sku, stock_status, options, description, reviews } = this.product;

        return (
            <View style={styles.container}>
                {!this.state.isLoading || <Loader color={SECONDARY_COLOR} />}
                <ScrollView style={{ flex: 1 }} >
                    <ProductImages images={images} />
                    <View style={styles.detailsContainer}>
                        <ProductTitle title={name} />
                        <ProductPrice
                            price={price_formated}
                            specialPrice={special_formated}
                            specialPriceStartDate={special_start_date}
                            specialPriceEndDate={special_end_date} />
                        <OtherInfo
                            productCode={sku !== "" ? sku : name}
                            availability={stock_status} />
                        {
                            options.length > 0 ? <ProductOptions errors={this.state.errors} productOptions={options} setProductOptions={this._setProductOptions.bind(this)} /> : null
                        }

                        <QuantityInput setQuantity={this._setQuantity.bind(this)} value={this.state.quantity} />
                    </View>

                    <ProductInfo productDescription={description} reviews={reviews} />
                </ScrollView>
                <ProductButtons productAvailability={stock_status} addToCart={this._addToCart.bind(this)} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch'
    },
    detailsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        paddingLeft: 15,
        paddingRight: 15,
    },
});

const mapStateToProps = (state: any) => {
    const { cart } = state;

    return cart;
}

const mapDispatchToProps = (dispatch: Function) => {
    return {
        addToCart: (item: any, product: any) => dispatch(addToCart(item, product)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)
