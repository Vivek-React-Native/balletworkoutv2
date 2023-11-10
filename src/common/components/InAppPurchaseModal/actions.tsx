import IN_APP_PURCHASES from './constants';
import http from './../../tools/axiosClient';
import i18n from '../../i18n';
import { verifyingPurchaseSuccess } from '../../auth/actions';

export function addingPurchaseData() {
    return {
        type: IN_APP_PURCHASES.PURCHASE_DATA_SEND,
    };
}

export function addPurchaseDataSuccess(data: any) {
    return {
        type: IN_APP_PURCHASES.PURCHASE_DATA_SEND_SUCCESS,
        payload: data,
    };
}

export function addPurchaseDataFailure(error: any) {
    return {
        type: IN_APP_PURCHASES.PURCHASE_DATA_SEND_FAILURE,
        payload: error,
    };
}

export function addPurchaseData(purchaseData: any) {
    return (dispatch: Function, getState: Function) => {
        // console.log('sending  data...');
        let token = getState().auth.tokenData.token;
        let selectedLanguage = i18n.language;

        http().post('in-app-purchase/add-purchase', purchaseData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept-Language': selectedLanguage
            }
        }).then(({data}) => {
            // console.log(data);
            dispatch(addPurchaseDataSuccess(data.data));
            dispatch(verifyingPurchaseSuccess(data.data.expiryTime));
        }).catch(({response}) => {
            // console.log(response);
            dispatch(addPurchaseDataFailure(response));
        });

    }
}