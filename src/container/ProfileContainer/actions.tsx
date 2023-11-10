import PROFILE from './constants';
import { baseUrlApi } from './../../common/appConstants';
import { updatingUserData } from './../../common/auth/actions';
import axios from 'axios';
import i18n from '../../common/i18n';
import http from './../../common/tools/axiosClient';
import AsyncStorage from '@react-native-community/async-storage';
import { Toast } from 'native-base';

// const http = axios.create({
//     baseURL: baseUrlApi,
//     timeout: 60 * 3 * 1000, 
//     headers: [
//         { 'Content-Type': 'application/json' }
//     ]
// });

export function savingAccountDetails() {
    return {
        type: PROFILE.SAVING_ACCOUNT_DETAILS,
    }
}

export function accountDetailsSaved(data: any) {
    return {
        type: PROFILE.SAVING_ACCOUNT_DETAILS_SUCCESS,
        payload: data
    };
}

export function accountDetailsSaveFailure(errors: any) {
    return {
        type: PROFILE.SAVING_ACCOUNT_DETAILS_FAILURE,
        payload: errors
    }
}

export function saveAccountDetails(profile: any) {
    return (dispatch: Function, getState: Function) => {
        let token = getState().auth.tokenData.token;

        const validateEmail = (email:any) => {
            const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            return reg.test(email);
        }

        if(profile.first_name == ''){
            // dispatch(accountDetailsSaveFailure('Please enter your first name..'));
            Toast.show({
                text: i18n.t('auth.EnterFirstName'),
                position:'top'
            })
            return
        }
        
        if(profile.email == ''){
            // dispatch(accountDetailsSaveFailure('Please enter email.'));
            Toast.show({
                text: i18n.t('auth.EnterEmail'),
                position:'top'
            })
            return
        }
         
        if(!validateEmail(profile.email)){
            // dispatch(accountDetailsSaveFailure('Please enter correct email..'));
            Toast.show({
                text: i18n.t('auth.isEmailValid'),
                position:'top'
            })
            return
        }

        dispatch(savingAccountDetails());
        // console.log('profile...',profile)

        http().post('user/save-profile', profile, {
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(({ data }) => {
            // console.log('Succes from api...',data)
            i18n.changeLanguage(data.language);
            dispatch(accountDetailsSaved(data));
            dispatch(updatingUserData(data));
        }).catch(({ response }) => {
            // console.log('Error from api...',response)
            dispatch(accountDetailsSaveFailure(response));
        });
    }
}

// function updatingLanguage() {
//     return {
//         type: PROFILE.UPDATE_PROFILE_LANGUAGE,
//     };
// }

// function updatingLanguageSuccess(data: any) {
//     return {
//         type: PROFILE.UPDATE_PROFILE_LANGUAGE,
//         payload: data,
//     };
// }

// function updatingLanguageFailure(error: any) {
//     return {
//         type: PROFILE.UPDATE_PROFILE_LANGUAGE,
//         payload: error
//     };
// }

// export function updateLanguage(language: string) {
//     return (dispatch: Function, getState: Function) => {
//         let token = getState().auth.tokenData.token;
//         dispatch(updatingLanguage());

//         http().post('user/update-language', {language: language}, {
//             headers: { 'Authorization': 'Bearer ' + token }
//         }).then(({ data }) => {
//             i18n.changeLanguage(language);
//             dispatch(accountDetailsSaved(data));
//             dispatch(updatingUserData(data));
//         }).catch(({ response }) => {
//             dispatch(updatingLanguageFailure(response.data));
//         });
//     }
// }

export function fetchingAccountDetails() {
    return {
        type: PROFILE.FETCHING_ACCOUNT_DETAILS,
    }
}

export function fetchedAccountDetails(accountDetails: any) {
    return {
        type: PROFILE.FETCHING_ACCOUNT_DETAILS_SUCCESS,
        payload: accountDetails,
    }
}

export function fetchingAccountDetailsFailure(errors) {
    return {
        type: PROFILE.FETCHING_ACCOUNT_DETAILS_FAILURE,
        payload: errors,
    }
}

export function fetchAccountDetails() {
    return (dispatch: Function, getState: Function) => {
        let token = getState().auth.tokenData.token;
        dispatch(fetchingAccountDetails());
        http().get('user/get-profile', {
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(({ data }) => {
            dispatch(fetchedAccountDetails(data));
        }).catch(({ response }) => {
            dispatch(fetchingAccountDetailsFailure(response));
        });
    }
}

export function uploadingPicture() {
    return {
        type: PROFILE.UPLOADING_PROFILE_PICTURE
    }
}

export function uploadingPictureSuccess() {
    return {
        type: PROFILE.UPLOADING_PROFILE_PICTURE_SUCCESS
    }
}

export function uploadingPictureFailure(errors: any) {
    return {
        type: PROFILE.UPLOADING_PROFILE_PICTURE_FAILURE,
        payload: errors,
    }
}

export function uploadPicture(data: any) {
    return (dispatch: Function, getState: Function) => {

        let token = getState().auth.tokenData.token;

        dispatch(uploadingPicture());

        let fd = new FormData();
        // console.log('data...',data)
        fd.append('profile_picture', data);

        // http().post('user/upload-profile-picture', fd, {
            //     headers: {
                //         'Content-Type': 'multipart/form-data',
                //         Authorization: `Bearer ${token}`,
                //     }
                // })
        fetch(baseUrlApi + 'user/upload-user-profile-picture',{
            method: 'POST',
            body: fd,
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            }
        })
        .then((data)=> data.json())
        .then(( data ) => {
            // console.log('success from api..',JSON.stringify(data))
            dispatch(uploadingPictureSuccess());
            dispatch(updatingUserData(data.userData));
        }).catch(( error ) => {
            // console.log('Error from api...',error)
            dispatch(uploadingPictureFailure(error));
        });

    }
}
