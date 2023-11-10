import SUB_CATEGORIES from './constants';
import { baseUrlApi } from './../../common/appConstants';
import axios from 'axios';
import i18n from '../../common/i18n';
import http from './../../common/tools/axiosClient';

// const http = axios.create({
//     baseURL: baseUrlApi,
//     headers: [{ 'Content-Type': 'application/json' }]
// });

export function fetchingSubCategories() {
    return {
        type: SUB_CATEGORIES.FETCHING_SUB_CATEGORIES,
    }
}

export function fetchingCategoriesSuccess(subCategories: any) {
    return {
        type: SUB_CATEGORIES.FETCHING_SUB_CATEGORIES_SUCCESS,
        payload: subCategories,
    };
}

export function fetchingCategoriesFailure(errors: any) {
    return {
        type: SUB_CATEGORIES.FETCHING_SUB_CATEGORIES_FAILURE,
        payload: errors,
    };
}

export default function fetchSubCategories(id: number, type: string) {
    return (dispatch: Function, getState: Function) => {
        let token = getState().auth.tokenData.token;
        let selectedLanguage = i18n.language;
        dispatch(fetchingSubCategories());
        if (type === "CATEGORY") {
            http().get(`category/get-sub-categories?id=${id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Accept-Language': selectedLanguage,
                }
            }).then(({ data }) => {
                dispatch(fetchingCategoriesSuccess(data));
            }).catch(({ response }) => {
                dispatch(fetchingCategoriesFailure(response));
            });
        } else if (type === "GOAL") {
            http().get(`goal/get-all`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Accept-Language': selectedLanguage,
                }
            }).then(({ data }) => {
                dispatch(fetchingCategoriesSuccess(data));
            }).catch(({ response }) => {
                dispatch(fetchingCategoriesFailure(response));
            });
        }
    }
}
