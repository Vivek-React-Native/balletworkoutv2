import RECIPES from './constants';
import { baseUrlApi } from './../../common/appConstants';
import axios from 'axios';
import i18n from '../../common/i18n';
import http from './../../common/tools/axiosClient';

// const http = axios.create({
//     baseURL: baseUrlApi,
//     headers: [
//         { 'Content-Type': 'application/json' }
//     ]
// });

export function fetchingRecipes() {
    return {
        type: RECIPES.FETCHING,
    };
}

export function fetchedSuccessfully(recipes: any) {
    return {
        type: RECIPES.SUCCESS_FETCHING,
        payload: recipes,
    };
}

export function fetchedWithFailure(errors: any) {
    return {
        type: RECIPES.FAILURE_FETCHING,
        payload: errors,
    };
}

export default function fetchRecipes() {
    return (dispatch: Function, getState: Function) => {
        let token = getState().auth.tokenData.token;
        let selectedLanguage = i18n.language || getState().auth.userData.language;
        dispatch(fetchingRecipes());

        http().get('recipe/get-all', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept-Language': selectedLanguage,
            }
        }).then(({ data }) => {            
            dispatch(fetchedSuccessfully(data.data));
        }).catch(({ response }) => {
            dispatch(fetchedWithFailure(response));
        });

    }
}
