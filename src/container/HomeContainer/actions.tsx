import HOME from './constants';
import {baseUrlApi} from './../../common/appConstants';
import axios from 'axios';
import i18n from '../../common/i18n';
import http from './../../common/tools/axiosClient';

// const http = axios.create({
//     baseURL: baseUrlApi,
//     headers: [
//         {'Content-Type': 'application/json'}
//     ]
// });

export function listCategories() {
  return {
    type: HOME.FETCH_CATEGORIES,
    payload: {
      isLoading: true,
    },
  };
}

export function listCategoriesSuccess(categories: any) {
  return {
    type: HOME.FETCH_CATEGORIES_SUCCESS,
    payload: categories.data,
  };
}

export function listCategoriesError(errors: any) {
  return {
    type: HOME.FETCH_CATEGORIES_FAILURE,
    payload: errors,
  };
}

export default function fetchCategories() {
  return async (dispatch: Function, getState: Function) => {
    let token = getState().auth.tokenData.token;
    let selectedLanguage = i18n.language || getState().auth.userData.language;
    dispatch(listCategories());
    http()
      .get('category/get-all', {
        headers: {
          Authorization: 'Bearer ' + token,
          'Accept-Language': selectedLanguage,
        },
      })
      .then((response: any) => {
        dispatch(listCategoriesSuccess(response.data));
      })
      .catch((error: any) => {
        dispatch(listCategoriesError(error.response));
      });
  };
}
