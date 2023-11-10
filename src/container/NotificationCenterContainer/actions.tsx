import NOTIFICATIONS from './constants';
import http from './../../common/tools/axiosClient';
import i18n from '../../common/i18n';

function fetchingNotifications() {
    return {
        type: NOTIFICATIONS.FETCH_NOTIFICATIONS,
    };
}

function fetchingNotificationsSuccess(data: any) {
    return {
        type: NOTIFICATIONS.FETCH_NOTIFICATIONS_SUCCESS,
        payload: data
    };
}

function fetchingNotificationsFailure(error: any) {
    return {
        type: NOTIFICATIONS.FETCH_NOTIFICATIONS_FAILURE,
        payload: error
    };
}

export default function fetchNotifications() {

    

    return (dispatch: Function, getState: Function) => {
        
        let token = getState().auth.tokenData.token;
        let selectedLanguage = i18n.language || getState().auth.userData.language;

        dispatch(fetchingNotifications());

        http().get('notification/get-all', {
            headers: {
                Authorization: 'Bearer ' + token,
                'Accept-Language': selectedLanguage,
            }
        }).then(({data}) => {
            dispatch(fetchingNotificationsSuccess(data.data));
        }).catch(({response}) => {
            dispatch(fetchingNotificationsFailure(response.data));
        });

    }
}